import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Calendar } from '../../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  getNurseListForHealthConsultation,
  createHealthConsultationBookingByParent
} from '../../../apis/healthConsultationBooking.api'
import { getMyChildren } from '../../../api/parent.api'
import NurseCard from './NurseCard'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import Loading from '../../../components/Loading/Loading'
import SuccessModal from './successModal'

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void
}

interface AppointmentFormData {
  studentCode: string
  studentId: number
  nurseId: number
  scheduledTime: string
  reason: string
}

interface Student {
  id: number
  studentCode: string
  fullname: string
  className?: string
}

interface Nurse {
  accountID: number
  fullname: string
  email: string
  phoneNumber: string
  image?: string | null
}

const AppointmentForm = ({ onSubmit }: AppointmentFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedNurse, setSelectedNurse] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [nurses, setNurses] = useState<Nurse[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successDetails, setSuccessDetails] = useState<{ date?: string; time?: string; consultant?: string }>()

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const res = await getNurseListForHealthConsultation()
        console.log('Kết quả API:', res.data)
        const nursesData = Array.isArray(res.data) ? res.data : res.data?.$values || []
        setNurses(nursesData)
        if (!nursesData.length) {
          toast.warn('Không có y tá nào khả dụng!')
        }
      } catch (err) {
        console.log('Lỗi lấy danh sách y tá:', err)
      }
    }
    const fetchStudents = async () => {
      try {
        const res = await getMyChildren()
        setStudents(res.data || [])
      } catch {
        toast.error('Không thể tải danh sách học sinh!')
      }
    }
    fetchNurses()
    fetchStudents()
  }, [])

  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !selectedNurse || !selectedDate || !selectedTime || !reason.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    const student = students.find((s) => s.studentCode === selectedStudent)
    if (!student) {
      toast.error('Không tìm thấy thông tin học sinh')
      return
    }
    const scheduledDateTime = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(':')
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))
    const scheduledTime = dayjs(scheduledDateTime).format('YYYY-MM-DDTHH:mm:ss')
    const formData: AppointmentFormData = {
      studentCode: selectedStudent,
      studentId: student.id,
      nurseId: selectedNurse!,
      scheduledTime: scheduledTime,
      reason: reason.trim()
    }
    setLoading(true)
    try {
      await createHealthConsultationBookingByParent({
        studentId: formData.studentId,
        nurseId: formData.nurseId,
        parentId: 0,
        scheduledTime: formData.scheduledTime,
        reason: formData.reason,
        studentCode: formData.studentCode
      })
      // Lấy thông tin y tá
      const nurse = nurses.find((n) => n.accountID === selectedNurse)
      setSuccessDetails({
        date: selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : '',
        time: selectedTime,
        consultant: nurse ? nurse.fullname : ''
      })
      setShowSuccess(true)
      // Reset form
      setSelectedStudent('')
      setSelectedNurse(null)
      setSelectedDate(undefined)
      setSelectedTime('')
      setReason('')
      if (onSubmit) onSubmit(formData)
    } catch (err: unknown) {
      // Nếu backend trả về message lỗi, hiển thị ra toast
      let message: string | undefined
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: unknown }).response === 'object' &&
        (err as { response?: { data?: { message?: string } } }).response !== undefined
      ) {
        const response = (err as { response: { data?: { message?: string } } }).response
        message = response?.data?.message
      }
      if (message) {
        toast.error(message)
      } else {
        toast.error('Đặt lịch tư vấn thất bại!')
      }
    } finally {
      setLoading(false)
    }
  }

  if (nurses.length === 0 || students.length === 0) {
    return <Loading />
  }

  return (
    <>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} appointmentDetails={successDetails} />
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center text-green-700'>Đặt lịch tư vấn sức khỏe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Student Selection */}
            <div className='space-y-2'>
              <Label htmlFor='student'>Chọn học sinh</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn học sinh...' />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.studentCode}>
                      {student.studentCode} - {student.fullname} (Lớp {student.className})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nurse Selection */}
            <div className='space-y-3'>
              <Label>Chọn y tá</Label>
              <div className='grid gap-3'>
                {nurses.map((nurse) => (
                  <NurseCard
                    key={nurse.accountID}
                    nurse={nurse}
                    isSelected={selectedNurse === nurse.accountID}
                    onSelect={setSelectedNurse}
                  />
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Chọn ngày</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={
                        'w-full justify-start text-left font-normal' + (!selectedDate ? ' text-muted-foreground' : '')
                      }
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {selectedDate ? format(selectedDate, 'PPP', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className='p-3 pointer-events-auto'
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='space-y-2'>
                <Label>Chọn giờ</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn giờ...' />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reason */}
            <div className='space-y-2'>
              <Label htmlFor='reason'>Lý do tư vấn</Label>
              <Textarea
                id='reason'
                placeholder='Mô tả triệu chứng hoặc vấn đề sức khỏe cần tư vấn...'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className='min-h-[100px]'
              />
            </div>

            <Button type='submit' className='w-full bg-green-600 hover:bg-green-700' disabled={loading}>
              {loading ? 'Đang gửi...' : 'Đặt lịch tư vấn'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AppointmentForm
