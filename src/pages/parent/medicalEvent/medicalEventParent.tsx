import React, { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Badge } from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { User, Calendar, FileText, Stethoscope, GraduationCap, Hash } from 'lucide-react'
import { getAllMedicalEventsForParent } from '../../../api/parent.api'
import MedicalEventDetail from './medicalEventDetail'

// Định nghĩa lại type cho MedicationUsed và MedicalSupplyUsed
interface MedicationUsed {
  medicationId: number
  name: string
  quantityUsed: number
}
interface MedicalSupplyUsed {
  medicalSupplyId: number
  name: string
  quantityUsed: number
}

// Thêm interface cho dữ liệu học sinh và event
interface StudentEvent {
  medicalEventId: number
  type: string
  description: string
  note: string
  date: string
  nurseName: string
  medications: { $id: string; $values: MedicationUsed[] }
  medicalSupplies: { $id: string; $values: MedicalSupplyUsed[] }
}

interface StudentCard {
  studentId: number
  studentName: string
  events: { $id: string; $values: StudentEvent[] }
  message?: string | null
  studentCode?: string
  className?: string
}

// Định nghĩa type cho selectedEvent phù hợp với MedicalEventDetailProps
interface SelectedEventDetail {
  date: string
  type: string
  description: string
  note: string
  nurseName: string
  medications: { $values: { name: string }[] }
  medicalSupplies: { $values: { name: string }[] }
}

const MedicalEventParent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventDetail | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [medicalEvents, setMedicalEvents] = useState<StudentCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  useEffect(() => {
    const fetchMedicalEvents = async () => {
      setLoading(true)
      try {
        // Lấy sự kiện y tế
        const medicalEventsRes = await getAllMedicalEventsForParent()
        if (medicalEventsRes.data && Array.isArray(medicalEventsRes.data.$values)) {
          setMedicalEvents(medicalEventsRes.data.$values)
          setError(null)
          // Chọn mặc định bé đầu tiên nếu có
          const studentIds = medicalEventsRes.data.$values.map((c: StudentCard) => c.studentId)
          if (studentIds.length > 0) setSelectedStudentId(studentIds[0])
        } else {
          setError('Không lấy được danh sách sự kiện y tế.')
        }
      } catch (err) {
        setError('Đã xảy ra lỗi bất ngờ.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMedicalEvents()
  }, [])

  const handleViewDetails = async (event: StudentEvent) => {
    const mappedEvent = {
      date: event.date,
      type: event.type,
      description: event.description,
      note: event.note,
      nurseName: event.nurseName,
      medications: { $values: (event.medications?.$values || []).map((m: MedicationUsed) => ({ name: m.name || '' })) },
      medicalSupplies: {
        $values: (event.medicalSupplies?.$values || []).map((s: MedicalSupplyUsed) => ({ name: s.name || '' }))
      }
    }
    setSelectedEvent(mappedEvent)
    setIsModalVisible(true)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Sốt':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Tai nạn':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Dịch bệnh':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Sốt':
        return '🌡️'
      case 'Tai nạn':
        return '⚠️'
      case 'Dịch bệnh':
        return '🦠'
      default:
        return '💊'
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 flex flex-col items-center'>
          <div className='text-gray-400 text-5xl mb-2 animate-bounce'>🏥</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <p className='text-red-600 font-semibold text-lg'>Lỗi: {error}</p>
        </div>
      </div>
    )
  }

  // Lấy danh sách các con từ dữ liệu BE trả về
  const students = medicalEvents.map((student) => ({
    studentId: student.studentId,
    studentName: student.studentName,
    studentCode: student.studentCode || 'Không có',
    className: student.className || 'Không có'
  }))

  // Lấy thông tin bé đang chọn
  const selectedStudent = medicalEvents.find((s) => s.studentId === selectedStudentId)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'>
      <div className='container mx-auto p-4'>
        <div className='mb-6'>
          <h1 className='text-2xl font-extrabold text-gray-800 mb-1 tracking-tight drop-shadow'>Sức khỏe con em</h1>
          <p className='text-gray-600 text-base'>Theo dõi tình hình sức khỏe và các sự kiện y tế của con</p>
        </div>

        <div className='flex gap-4'>
          {/* Cột trái: Danh sách tên các con */}
          <div className='w-64'>
            <Card className='bg-white/70 shadow-xl border-0 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01]'>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-4'>
                  <User className='h-5 w-5 text-blue-600 drop-shadow' />
                  <h2 className='text-lg font-extrabold text-gray-800 tracking-tight'>Danh sách con</h2>
                </div>
                <ScrollArea className='h-[400px] pr-1.5'>
                  <div className='space-y-2'>
                    {students.map((stu) => (
                      <div
                        key={stu.studentId}
                        className={`cursor-pointer p-3 rounded-xl transition-all duration-300 border-2 hover:shadow-xl hover:scale-105 ${selectedStudentId === stu.studentId
                          ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-100 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
                          }`}
                        onClick={() => setSelectedStudentId(stu.studentId)}
                      >
                        <div className='flex items-start gap-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-extrabold text-base shadow border-2 border-white'>
                            {stu.studentName.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-bold text-gray-800 mb-0.5 text-base tracking-tight'>
                              {stu.studentName}
                            </h3>
                            <div className='flex items-center gap-1 text-xs text-gray-500 mb-0.5'>
                              <Hash className='h-3 w-3' />
                              <span>Mã HS: {stu.studentCode}</span>
                            </div>
                            <div className='flex items-center gap-1 text-xs text-gray-500'>
                              <GraduationCap className='h-3 w-3' />
                              <span>Lớp: {stu.className}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </div>

          {/* Cột phải: Thông tin chi tiết bé và các sự kiện y tế */}
          <div className='flex-1'>
            {selectedStudent ? (
              <div className='space-y-4'>
                {/* Thông tin học sinh */}
                <Card className='bg-white/70 shadow-xl border-0 rounded-xl backdrop-blur-md transition-all duration-300 min-h-[110px]'>
                  <div className='p-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow border-2 border-white'>
                        {selectedStudent.studentName.charAt(0)}
                      </div>
                      <div>
                        <h2 className='text-xl font-extrabold text-gray-800 mb-1 tracking-tight drop-shadow'>
                          {selectedStudent.studentName}
                        </h2>
                        <div className='flex items-center gap-4 text-base text-gray-600'>
                          <div className='flex items-center gap-1'>
                            <GraduationCap className='h-4 w-4' />
                            <span>Lớp: {selectedStudent.className || 'Không có'}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Hash className='h-4 w-4' />
                            <span>Mã HS: {selectedStudent.studentCode || 'Không có'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Lịch sử sự kiện y tế */}
                <Card className='bg-white/70 shadow-xl border-0 rounded-xl backdrop-blur-md transition-all duration-300'>
                  <div className='p-4'>
                    <div className='flex items-center gap-2 mb-4'>
                      <Stethoscope className='h-5 w-5 text-blue-500 drop-shadow' />
                      <h3 className='text-lg font-extrabold text-gray-800 tracking-tight'>Lịch sử sự kiện y tế</h3>
                    </div>
                    <ScrollArea className='h-[450px] pr-1.5'>
                      {selectedStudent.events.$values.length === 0 ? (
                        <div className='text-center py-8'>
                          <div className='text-gray-400 text-5xl mb-2 animate-bounce'>🏥</div>
                          <p className='text-gray-500 font-semibold text-base'>Hiện chưa có sự kiện y tế nào</p>
                          <p className='text-gray-400 text-xs mt-1'>Điều này có nghĩa là con bạn rất khỏe mạnh!</p>
                        </div>
                      ) : (
                        <div className='space-y-3'>
                          {selectedStudent.events.$values.map((event: StudentEvent, index: number) => (
                            <div key={event.medicalEventId} className='relative group'>
                              {/* Timeline line */}
                              {index !== selectedStudent.events.$values.length - 1 && (
                                <div className='absolute left-5 top-10 w-0.5 h-full bg-gradient-to-b from-blue-200 to-transparent'></div>
                              )}
                              <div className='flex gap-3'>
                                {/* Timeline dot */}
                                <div className='flex flex-col items-center'>
                                  <div className='w-10 h-10 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow border-2 border-white group-hover:scale-110 transition-transform duration-300'>
                                    <span className='text-lg'>{getEventIcon(event.type)}</span>
                                  </div>
                                </div>
                                {/* Event content */}
                                <div className='flex-1'>
                                  <div
                                    className={`bg-white rounded-xl p-4 shadow hover:shadow-xl transition-shadow border-2 ${getEventTypeColor(event.type)} border-opacity-40 group-hover:scale-[1.01] duration-300`}
                                  >
                                    <div className='flex justify-between items-start mb-2'>
                                      <div className='flex items-center gap-2'>
                                        <Badge
                                          className={`rounded-full px-3 py-0.5 text-sm font-semibold shadow ${getEventTypeColor(event.type)}`}
                                        >
                                          {event.type}
                                        </Badge>
                                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                                          <Calendar className='h-4 w-4' />
                                          <span>{new Date(event.date).toLocaleString('vi-VN')}</span>
                                        </div>
                                      </div>
                                      <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleViewDetails(event)}
                                        className='bg-gradient-to-r from-blue-100 to-indigo-100 border-0 text-blue-700 font-semibold shadow hover:scale-110 transition-all px-3 py-1 rounded'
                                      >
                                        <FileText className='h-4 w-4 mr-1' />
                                        Chi tiết
                                      </Button>
                                    </div>
                                    <p className='text-gray-700 font-semibold mb-1 text-sm'>{event.description}</p>
                                    {event.note && (
                                      <div className='bg-blue-50 rounded p-2 border-l-4 border-blue-500'>
                                        <p className='text-xs text-blue-700 italic'>Ghi chú: {event.note}</p>
                                      </div>
                                    )}
                                    <div className='mt-2 pt-2 border-t border-gray-200'>
                                      <p className='text-xs text-gray-500'>
                                        Được chăm sóc bởi:{' '}
                                        <span className='font-bold text-blue-700'>{event.nurseName}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className='bg-white/70 shadow-xl border-0 rounded-xl backdrop-blur-md transition-all duration-300'>
                <div className='p-10 text-center'>
                  <div className='text-gray-400 text-5xl mb-4 animate-bounce'>👶</div>
                  <h3 className='text-lg font-extrabold text-gray-600 mb-2 tracking-tight'>
                    Chọn một bé để xem chi tiết
                  </h3>
                  <p className='text-gray-400 text-base'>
                    Vui lòng chọn tên con từ danh sách bên trái để xem thông tin sức khỏe
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Modal chi tiết */}
        <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
          <DialogContent className='max-w-xl max-h-[80vh] overflow-y-auto bg-white/80 rounded-2xl shadow-2xl backdrop-blur-lg border-0 animate-fade-in'>
            <DialogHeader>
              <DialogTitle className='text-xl font-extrabold text-blue-700 flex items-center gap-3 tracking-tight drop-shadow-md'>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 text-white shadow-lg mr-2'>
                  <Stethoscope className='h-6 w-6' />
                </span>
                Chi tiết báo cáo y tế
              </DialogTitle>
            </DialogHeader>
            <Separator className='my-2' />
            <div className='py-4 px-1'>{selectedEvent && <MedicalEventDetail selectedEvent={selectedEvent} />}</div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsModalVisible(false)}
                className='px-8 py-2 rounded-xl font-bold text-blue-700 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100 hover:border-blue-300 shadow-lg transition-all duration-200 text-base'
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default MedicalEventParent
