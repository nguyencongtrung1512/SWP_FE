'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Badge } from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import { ScrollArea } from '../../../components/ui/scroll-area'
import {
  User,
  Calendar,
  FileText,
  Stethoscope,
  GraduationCap,
  Hash,
  ShieldAlert,
  Thermometer,
  WormIcon as Virus
} from 'lucide-react'
import { getAllMedicalEventsForParent } from '../../../apis/parent.api'
import MedicalEventDetail from './medicalEventDetail'
import Loading from '../../../components/Loading/Loading'

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
        const medicalEventsRes = await getAllMedicalEventsForParent()
        if (medicalEventsRes.data && Array.isArray(medicalEventsRes.data.$values)) {
          setMedicalEvents(medicalEventsRes.data.$values)
          setError(null)
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
        return <Thermometer className='h-5 w-5' />
      case 'Tai nạn':
        return <ShieldAlert className='h-5 w-5' />
      case 'Dịch bệnh':
        return <Virus className='h-5 w-5' />
      default:
        return <Stethoscope className='h-5 w-5' />
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <p className='text-red-600 font-semibold text-lg'>Lỗi: {error}</p>
          <Button className='mt-4 bg-blue-600 hover:bg-blue-700 text-white' onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const students = medicalEvents.map((student) => ({
    studentId: student.studentId,
    studentName: student.studentName,
    studentCode: student.studentCode || 'Không có',
    className: student.className || 'Không có'
  }))

  const selectedStudent = medicalEvents.find((s) => s.studentId === selectedStudentId)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-cyan-50'>
      <div className='container mx-auto p-4 py-6'>
        <div className='mb-6'>
          <h1 className='text-2xl font-extrabold mb-2 tracking-tight drop-shadow-md'>Sức khỏe con em</h1>
          <p className='text-blue-500 text-lg'>Theo dõi tình hình sức khỏe và các sự kiện y tế của con</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='md:col-span-1'>
            <Card className='bg-white/90 shadow-xl border-0 rounded-xl backdrop-blur-md h-full'>
              <div className='p-5'>
                <div className='flex items-center gap-2 mb-5'>
                  <div className='bg-blue-500 p-2 rounded-lg'>
                    <User className='h-5 w-5' />
                  </div>
                  <h2 className='text-lg font-bold text-blue-900'>Danh sách con</h2>
                </div>

                <ScrollArea className='h-[500px] pr-2'>
                  <div className='space-y-3'>
                    {students.map((stu) => (
                      <div
                        key={stu.studentId}
                        className={`cursor-pointer p-4 rounded-xl transition-all duration-300 ${selectedStudentId === stu.studentId
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg scale-[1.02]'
                          : 'bg-blue-50 hover:bg-blue-100'
                          }`}
                        onClick={() => setSelectedStudentId(stu.studentId)}
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-blue-400 font-bold text-base shadow-md ${selectedStudentId === stu.studentId ? 'bg-white text-blue-600' : 'bg-blue-600'
                              }`}
                          >
                            {stu.studentName.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <h3
                              className={`font-bold mb-1 text-base ${selectedStudentId === stu.studentId ? 'text-white' : 'text-blue-900'
                                }`}
                            >
                              {stu.studentName}
                            </h3>
                            <div
                              className={`flex items-center gap-1 text-xs ${selectedStudentId === stu.studentId ? 'text-blue-100' : 'text-blue-700'
                                } mb-1`}
                            >
                              <Hash className='h-3 w-3' />
                              <span>Mã HS: {stu.studentCode}</span>
                            </div>
                            <div
                              className={`flex items-center gap-1 text-xs ${selectedStudentId === stu.studentId ? 'text-blue-100' : 'text-blue-700'
                                }`}
                            >
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

          <div className='md:col-span-3'>
            {selectedStudent ? (
              <div className='space-y-5'>
                <Card className='bg-white/90 shadow-xl border-0 rounded-xl backdrop-blur-md'>
                  <div className='p-5'>
                    <div className='flex items-center gap-4'>
                      <div>
                        <h2 className='text-2xl font-bold text-blue-900 mb-1'>{selectedStudent.studentName}</h2>
                        <div className='flex flex-wrap items-center gap-4 text-sm text-blue-700'>
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

                <Card className='bg-white/90 shadow-xl border-0 rounded-xl backdrop-blur-md'>
                  <div className='p-5'>
                    <div className='flex items-center gap-2 mb-5'>
                      <div className='bg-blue-600 p-2 rounded-lg'>
                        <Stethoscope className='h-5 w-5 text-white' />
                      </div>
                      <h3 className='text-lg font-bold text-blue-900'>Lịch sử sự kiện y tế</h3>
                    </div>

                    <ScrollArea className='h-[450px] pr-2'>
                      {selectedStudent.events.$values.length === 0 ? (
                        <div className='text-center py-12 bg-blue-50 rounded-xl'>
                          <div className='text-blue-400 text-6xl mb-4'>🏥</div>
                          <p className='text-blue-700 font-semibold text-lg'>Hiện chưa có sự kiện y tế nào</p>
                          <p className='text-blue-500 mt-2'>Điều này có nghĩa là con bạn rất khỏe mạnh!</p>
                        </div>
                      ) : (
                        <div className='space-y-5'>
                          {selectedStudent.events.$values.map((event: StudentEvent, index: number) => (
                            <div key={event.medicalEventId} className='relative'>
                              {/* Timeline line */}
                              {index !== selectedStudent.events.$values.length - 1 && (
                                <div className='absolute left-6 top-12 w-0.5 h-full bg-blue-200'></div>
                              )}

                              <div className='flex gap-4'>
                                {/* Timeline dot */}
                                <div className='flex flex-col items-center'>
                                  <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md'>
                                    {getEventIcon(event.type)}
                                  </div>
                                </div>

                                {/* Event content */}
                                <div className='flex-1'>
                                  <div className='bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-600'>
                                    <div className='flex flex-wrap justify-between items-start mb-3 gap-2'>
                                      <div className='flex flex-wrap items-center gap-2'>
                                        <Badge className={`rounded-full px-3 py-1 ${getEventTypeColor(event.type)}`}>
                                          {event.type}
                                        </Badge>
                                        <div className='flex items-center gap-1 text-xs text-blue-700'>
                                          <Calendar className='h-4 w-4' />
                                          <span>{new Date(event.date).toLocaleString('vi-VN')}</span>
                                        </div>
                                      </div>

                                      <Button
                                        onClick={() => handleViewDetails(event)}
                                        className='bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                        size='sm'
                                      >
                                        <FileText className='h-4 w-4 mr-1' />
                                        Chi tiết
                                      </Button>
                                    </div>

                                    <p className='text-blue-900 font-medium mb-3'>{event.description}</p>

                                    {event.note && (
                                      <div className='bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400 mb-3'>
                                        <p className='text-sm text-blue-700'>
                                          <span className='font-semibold'>Ghi chú:</span> {event.note}
                                        </p>
                                      </div>
                                    )}

                                    <div className='pt-2 border-t border-blue-100'>
                                      <p className='text-xs text-blue-600'>
                                        Được chăm sóc bởi: <span className='font-bold'>{event.nurseName}</span>
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
              <Card className='bg-white/90 shadow-xl border-0 rounded-xl backdrop-blur-md h-full'>
                <div className='p-10 text-center'>
                  <div className='text-blue-400 text-6xl mb-6'>👶</div>
                  <h3 className='text-xl font-bold text-blue-900 mb-3'>Chọn một bé để xem chi tiết</h3>
                  <p className='text-blue-600'>Vui lòng chọn tên con từ danh sách bên trái để xem thông tin sức khỏe</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
          <DialogContent className='max-w-xl max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-xl border-0'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-blue-700 flex items-center gap-3'>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-md'>
                  <Stethoscope className='h-5 w-5' />
                </span>
                Chi tiết báo cáo y tế
              </DialogTitle>
            </DialogHeader>
            <Separator className='my-3' />
            <div className='py-4 px-1'>{selectedEvent && <MedicalEventDetail selectedEvent={selectedEvent} />}</div>
            <DialogFooter>
              <Button
                onClick={() => setIsModalVisible(false)}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6'
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
