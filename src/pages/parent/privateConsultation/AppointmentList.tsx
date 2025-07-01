import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import {
  getHealthConsultationBookingByParent,
  cancelHealthConsultationBooking
} from '../../../apis/healthConsultationBooking.api'
import { toast } from 'react-toastify'
import Loading from '../../../components/Loading/Loading'

export interface Appointment {
  bookingId: number
  studentName: string
  studentCode: string
  nurseName: string
  scheduledTime: string
  reason: string
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Done'
}

interface AppointmentListProps {
  appointments: Appointment[]
}

const AppointmentList = ({
  appointments,
  onCancel,
  reload
}: AppointmentListProps & { onCancel?: (id: number) => void; reload?: boolean }) => {
  const [showAll, setShowAll] = useState(false)
  const [internalAppointments, setInternalAppointments] = useState(appointments)

  useEffect(() => {
    setInternalAppointments(appointments)
  }, [appointments])

  useEffect(() => {
    // Gọi lại API hoặc cập nhật danh sách khi reload thay đổi
    if (reload !== undefined) {
      // Giả sử có hàm fetchAppointments, bạn có thể gọi lại ở đây nếu cần
      // fetchAppointments()
      setShowAll(false)
    }
  }, [reload])

  const sortedAppointments = [...internalAppointments].sort(
    (a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
  )
  const visibleAppointments = showAll ? sortedAppointments : sortedAppointments.slice(0, 3)

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-500'
      case 'Pending':
        return 'bg-yellow-500'
      case 'Done':
        return 'bg-green-500'
      case 'Cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'Đã xác nhận'
      case 'Pending':
        return 'Chờ xác nhận'
      case 'Done':
        return 'Hoàn thành'
      case 'Cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8 text-gray-500'>Chưa có lịch hẹn nào được đặt</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch hẹn của bạn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-7'>
          {visibleAppointments.map((appointment) => (
            <div
              key={appointment.bookingId}
              className='border rounded-lg p-6 hover:shadow-lg transition-shadow max-w-xl mx-auto bg-white'
            >
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-medium text-gray-900'>{appointment.studentName}</h3>
                  </div>
                  <div className='text-sm text-gray-600'>
                    Y tá: <span className='font-semibold text-blue-700'>{appointment.nurseName}</span>
                  </div>
                  <div className='flex items-center space-x-4 text-sm text-gray-600'>
                    <div className='flex items-center space-x-1'>
                      <Calendar className='w-4 h-4' />
                      <span>{format(new Date(appointment.scheduledTime), 'dd/MM/yyyy', { locale: vi })}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Clock className='w-4 h-4' />
                      <span>{format(new Date(appointment.scheduledTime), 'HH:mm')}</span>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700'>
                    <strong>Lý do:</strong> {appointment.reason}
                  </p>
                </div>
                <div className='flex flex-col items-end gap-4 min-w-[110px]'>
                  <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                  {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && onCancel && (
                    <button
                      type='button'
                      className='block mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold shadow'
                      onClick={() => onCancel(appointment.bookingId)}
                      style={{ minWidth: 48 }}
                    >
                      Hủy
                    </button>
                  )}
                  {(appointment.status === 'Confirmed') && (
                    <button
                      type='button'
                      className='block mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold shadow'
                      onClick={() => window.location.href = `/parent/private-consultation/video-call/${appointment.bookingId}`}
                      style={{ minWidth: 80 }}
                    >
                      Tham gia cuộc gọi
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {sortedAppointments.length > 3 && !showAll && (
          <div className='text-center mt-4'>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold shadow'
              onClick={() => setShowAll(true)}
            >
              Xem tất cả
            </button>
          </div>
        )}
        {sortedAppointments.length > 3 && showAll && (
          <div className='text-center mt-4'>
            <button
              className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold shadow'
              onClick={() => setShowAll(false)}
            >
              Ẩn bớt
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const AppointmentListContainer = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await getHealthConsultationBookingByParent()
      const data = res.data?.$values || []
      const mapped = data.map((item: unknown) => {
        const appt = item as Appointment & { bookingId?: number; nurse?: { fullname?: string } }
        return {
          ...appt,
          id: appt.bookingId,
          nurseName: appt.nurseName || (appt.nurse && appt.nurse.fullname) || 'Không rõ'
        }
      })
      setAppointments(mapped)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleCancel = async (bookingId: number) => {
    try {
      await cancelHealthConsultationBooking(bookingId)
      toast.success('Đã hủy lịch hẹn thành công!')
      fetchAppointments()
    } catch {
      toast.error('Hủy lịch hẹn thất bại!')
    }
  }

  if (loading) return <Loading />
  return <AppointmentList appointments={appointments} onCancel={handleCancel} />
}

export default AppointmentListContainer
