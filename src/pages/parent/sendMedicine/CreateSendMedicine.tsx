import React from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Checkbox } from '../../../components/ui/checkbox'
import { Calendar } from '../../../components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { CalendarIcon, Plus, Trash2, Pill } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '../../../lib/utils'
import { toast } from 'react-toastify'
import { sendMedicationToStudent } from '../../../apis/parentMedicationRequest.api'
import { getMyChildren } from '../../../apis/parent.api'

interface FormValues {
  studentId: string
  reason: string
  medications: {
    name: string
    type: string
    usage: string
    dosage: string
    expiredDate?: Date
    note?: string
  }[]
  agreement1: boolean
  agreement2: boolean
}

interface Student {
  id: number
  fullname: string
}

const CreateSendMedicine: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [students, setStudents] = React.useState<Student[]>([])
  const [formData, setFormData] = React.useState<FormValues>({
    studentId: '',
    reason: '',
    medications: [{ name: '', type: '', usage: '', dosage: '', note: '' }],
    agreement1: false,
    agreement2: false
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getMyChildren()
        if (res.data) {
          setStudents(
            res.data.map((s) => ({
              id: s.studentId,
              fullname: s.fullname
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch students:', error)
      }
    }
    fetchStudents()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.studentId) {
      newErrors.studentId = 'Vui lòng chọn học sinh!'
    }

    if (!formData.reason) {
      newErrors.reason = 'Vui lòng nhập lý do gửi thuốc!'
    }

    formData.medications.forEach((med, index) => {
      if (!med.name) {
        newErrors[`medication_${index}_name`] = 'Vui lòng nhập tên thuốc!'
      }
      if (!med.type) {
        newErrors[`medication_${index}_type`] = 'Vui lòng nhập dạng thuốc!'
      }
      if (!med.dosage) {
        newErrors[`medication_${index}_dosage`] = 'Vui lòng nhập liều lượng!'
      }
      if (!med.usage) {
        newErrors[`medication_${index}_usage`] = 'Vui lòng nhập thời gian uống!'
      }
      if (med.expiredDate && med.expiredDate < new Date()) {
        newErrors[`medication_${index}_expiredDate`] = 'Hạn sử dụng không được nhỏ hơn ngày hiện tại!'
      }
    })

    if (!formData.agreement1) {
      newErrors.agreement1 = 'Vui lòng xác nhận cam kết!'
    }

    if (!formData.agreement2) {
      newErrors.agreement2 = 'Vui lòng xác nhận đồng ý!'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!')
      return
    }

    try {
      const data = {
        studentId: Number(formData.studentId),
        parentNote: formData.reason,
        medications: formData.medications.map((med) => ({
          name: med.name,
          type: med.type,
          usage: med.usage,
          dosage: med.dosage,
          expiredDate: med.expiredDate ? format(med.expiredDate, 'yyyy-MM-dd') : '',
          note: med.note || ''
        }))
      }

      await sendMedicationToStudent(data)

      toast.success('Gửi thông tin thuốc thành công!')
      setFormData({
        studentId: '',
        reason: '',
        medications: [{ name: '', type: '', usage: '', dosage: '', note: '' }],
        agreement1: false,
        agreement2: false
      })
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Failed to send medicine:', err)
      toast.error('Gửi thông tin thuốc thất bại!')
    }
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', type: '', usage: '', dosage: '', note: '' }]
    }))
  }

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index: number, field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full mx-auto'>
        <Card className='shadow-2xl border-0 bg-white/95 backdrop-blur-sm'>
          <CardHeader className='bg-gradient-to-r bg-blue-500 text-white shadow-lg text-white rounded-t-lg'>
            <CardTitle className='flex items-center gap-3 text-2xl'>
              <Pill className='w-8 h-8' />
              Form Gửi Thuốc Cho Học Sinh
            </CardTitle>
          </CardHeader>
          <CardContent className='p-8 space-y-8'>
            {/* 1. Thông tin học sinh */}
            <Card className='border-l-4 border-l-blue-500'>
              <CardHeader>
                <CardTitle className='text-lg text-gray-800'>1. Thông tin học sinh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='student'>Học sinh *</Label>
                    <Select
                      value={formData.studentId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, studentId: value }))}
                    >
                      <SelectTrigger className={cn(errors.studentId && 'border-red-500')}>
                        <SelectValue placeholder='Chọn học sinh' />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.fullname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.studentId && <p className='text-sm text-red-500'>{errors.studentId}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Thông tin thuốc */}
            <Card className='border-l-4 border-l-green-500'>
              <CardHeader>
                <CardTitle className='text-lg text-gray-800'>2. Thông tin thuốc</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {formData.medications.map((medication, index) => (
                  <div key={index} className='p-6 border border-gray-200 rounded-lg relative bg-gray-50'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label>Tên thuốc *</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          placeholder='Nhập tên thuốc'
                          className={cn(errors[`medication_${index}_name`] && 'border-red-500')}
                        />
                        {errors[`medication_${index}_name`] && (
                          <p className='text-sm text-red-500'>{errors[`medication_${index}_name`]}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label>Dạng thuốc *</Label>
                        <Input
                          value={medication.type}
                          onChange={(e) => updateMedication(index, 'type', e.target.value)}
                          placeholder='VD: Viên nén, Siro, Thuốc nhỏ mắt'
                          className={cn(errors[`medication_${index}_type`] && 'border-red-500')}
                        />
                        {errors[`medication_${index}_type`] && (
                          <p className='text-sm text-red-500'>{errors[`medication_${index}_type`]}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label>Liều lượng mỗi lần uống *</Label>
                        <Input
                          value={medication.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          placeholder='VD: 1 viên, 5ml'
                          className={cn(errors[`medication_${index}_dosage`] && 'border-red-500')}
                        />
                        {errors[`medication_${index}_dosage`] && (
                          <p className='text-sm text-red-500'>{errors[`medication_${index}_dosage`]}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label>Thời gian uống cụ thể *</Label>
                        <Input
                          value={medication.usage}
                          onChange={(e) => updateMedication(index, 'usage', e.target.value)}
                          placeholder='VD: Sau bữa trưa'
                          className={cn(errors[`medication_${index}_usage`] && 'border-red-500')}
                        />
                        {errors[`medication_${index}_usage`] && (
                          <p className='text-sm text-red-500'>{errors[`medication_${index}_usage`]}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label>Ngày sử dụng thuốc</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !medication.expiredDate && 'text-muted-foreground',
                                errors[`medication_${index}_expiredDate`] && 'border-red-500'
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {medication.expiredDate ? (
                                format(medication.expiredDate, 'dd/MM/yyyy', { locale: vi })
                              ) : (
                                <span>Ngày sử dụng thuốc</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0'>
                            <Calendar
                              mode='single'
                              selected={medication.expiredDate}
                              onSelect={(date) => date && updateMedication(index, 'expiredDate', date)}
                              disabled={(date) => date <= new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors[`medication_${index}_expiredDate`] && (
                          <p className='text-sm text-red-500'>{errors[`medication_${index}_expiredDate`]}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label>Ghi chú</Label>
                        <Input
                          value={medication.note || ''}
                          onChange={(e) => updateMedication(index, 'note', e.target.value)}
                          placeholder='Ghi chú thêm (nếu có)'
                        />
                      </div>
                    </div>

                    {formData.medications.length > 1 && (
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => removeMedication(index)}
                        className='absolute top-2 right-2'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type='button'
                  variant='outline'
                  onClick={addMedication}
                  className='w-full border-dashed border-2 h-12 text-blue-600 hover:bg-blue-50'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm thuốc
                </Button>
              </CardContent>
            </Card>
            {/*3. lý do gửi thuốc */}
            <Card className='border-l-4 border-l-purple-500'>
              <CardHeader>
                <CardTitle className='text-lg text-gray-800'>3. Lý do gửi thuốc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Label htmlFor='reason'>Lý do gửi thuốc *</Label>
                  <textarea
                    id='reason'
                    className={`w-full min-h-[80px] border rounded p-2 ${errors.reason ? 'border-red-500' : ''}`}
                    placeholder='Nhập lý do gửi thuốc cho học sinh...'
                    value={formData.reason}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                  {errors.reason && <p className='text-sm text-red-500'>{errors.reason}</p>}
                </div>
              </CardContent>
            </Card>

            {/* 4. Xác nhận và cam kết */}
            <Card className='border-l-4 border-l-orange-500'>
              <CardHeader>
                <CardTitle className='text-lg text-gray-800'>4. Xác nhận và cam kết</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='agreement1'
                    checked={formData.agreement1}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreement1: checked as boolean }))}
                    className={cn(errors.agreement1 && 'border-red-500')}
                  />
                  <Label htmlFor='agreement1' className='text-sm leading-relaxed'>
                    Tôi cam kết thông tin trên là chính xác, thuốc còn hạn sử dụng và không gây hại đến sức khỏe của con
                    tôi.
                  </Label>
                </div>
                {errors.agreement1 && <p className='text-sm text-red-500 ml-6'>{errors.agreement1}</p>}

                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='agreement2'
                    checked={formData.agreement2}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreement2: checked as boolean }))}
                    className={cn(errors.agreement2 && 'border-red-500')}
                  />
                  <Label htmlFor='agreement2' className='text-sm leading-relaxed'>
                    Tôi đồng ý để nhân viên y tế nhà trường hỗ trợ cho con tôi uống thuốc theo thông tin trên.
                  </Label>
                </div>
                {errors.agreement2 && <p className='text-sm text-red-500 ml-6'>{errors.agreement2}</p>}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className='w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
            >
              <Pill className='w-5 h-5 mr-2' />
              Gửi yêu cầu
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateSendMedicine
