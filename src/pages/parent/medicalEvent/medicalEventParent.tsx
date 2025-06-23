import React, { useEffect, useState } from 'react'
import { Card, Button, Modal, Timeline } from 'antd'
import { getAllMedicalEventsForParent, getMyChildren, Student } from '../../../api/parent.api'
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
}

// Định nghĩa type dùng chung cho hiển thị thông tin học sinh
interface StudentCardInfo {
  studentId: number
  fullname?: string
  studentCode?: string
  className?: string
  classId?: string
  classID?: string
  dateOfBirth?: string
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

// Interface tạm cho _class
interface ClassInfo {
  className: string
}

const MedicalEventParent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventDetail | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [medicalEvents, setMedicalEvents] = useState<StudentCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [studentDetailsMap, setStudentDetailsMap] = useState<Record<number, StudentCardInfo | undefined>>({})
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  useEffect(() => {
    const fetchAccountInfoAndMedicalEvents = async () => {
      setLoading(true)
      try {
        // Lấy danh sách các con
        const childrenRes = await getMyChildren()
        console.log('con của tôi', childrenRes)
        let childrenDetails: StudentCardInfo[] = []
        if (childrenRes.success && Array.isArray(childrenRes.data)) {
          childrenDetails = childrenRes.data.map((child: Student) => ({
            studentId: child.id,
            fullname: child.fullname,
            studentCode: child.studentCode || 'Không có',
            className:
              child._class && typeof child._class === 'object' && 'className' in child._class
                ? (child._class as ClassInfo).className
                : 'Không có',
            classId: child.classID?.toString() || '',
            dateOfBirth: child.dateOfBirth
          }))
        }
        // Lấy sự kiện y tế
        const medicalEventsRes = await getAllMedicalEventsForParent()
        console.log("sự kiện y tế", medicalEventsRes.data)
        if (medicalEventsRes.data && Array.isArray(medicalEventsRes.data.$values)) {
          setMedicalEvents(medicalEventsRes.data.$values)
          // Map studentId -> thông tin chi tiết
          const detailsMap: Record<number, StudentCardInfo | undefined> = {}
          childrenDetails.forEach((child) => {
            detailsMap[child.studentId] = child
          })
          setStudentDetailsMap(detailsMap)
          setError(null)
          // Chọn mặc định bé đầu tiên nếu có
          const studentIds = childrenDetails.map((c) => c.studentId)
          if (studentIds.length > 0) setSelectedStudentId(studentIds[0])
        } else {
          setError('Không lấy được danh sách sự kiện y tế.')
        }
        console.log('studentDetailsMap', studentDetailsMap)
        console.log(
          'students',
          medicalEvents.map((student) => ({
            studentId: student.studentId,
            studentName: studentDetailsMap[student.studentId]?.fullname || student.studentName,
            studentCode: studentDetailsMap[student.studentId]?.studentCode || 'Không có',
            className: studentDetailsMap[student.studentId]?.className || 'Không có'
          }))
        )
      } catch (err) {
        setError('Đã xảy ra lỗi bất ngờ.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAccountInfoAndMedicalEvents()
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

  if (loading) {
    return <div className='p-6 text-center'>Đang tải dữ liệu...</div>
  }

  if (error) {
    return <div className='p-6 text-center text-red-500'>Lỗi: {error}</div>
  }

  // Lấy danh sách các con
  const students = medicalEvents.map((student) => ({
    studentId: student.studentId,
    studentName: studentDetailsMap[student.studentId]?.fullname || student.studentName,
    studentCode: studentDetailsMap[student.studentId]?.studentCode || 'Không có',
    className: studentDetailsMap[student.studentId]?.className || 'Không có'
  }))

  // Lấy thông tin bé đang chọn
  const selectedStudent = medicalEvents.find((s) => s.studentId === selectedStudentId)
  const selectedStudentInfo = selectedStudent ? studentDetailsMap[selectedStudent.studentId] : undefined

  return (
    <div className='flex gap-8 p-6'>
      {/* Cột trái: Danh sách tên các con */}
      <div className='w-1/4 bg-white rounded-lg shadow p-4'>
        <div className='font-bold text-lg mb-4'>Danh sách con</div>
        <div className='space-y-2'>
          {students.map((stu) => (
            <div
              key={stu.studentId}
              className={`cursor-pointer px-3 py-2 rounded transition border ${selectedStudentId === stu.studentId ? 'border-blue-500 bg-blue-50 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setSelectedStudentId(stu.studentId)}
            >
              <div className='font-semibold'>{stu.studentName}</div>
              <div className='text-xs text-gray-500'>Mã học sinh: {stu.studentCode}</div>
              <div className='text-xs text-gray-500'>Lớp: {stu.className}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Cột phải: Thông tin chi tiết bé và các sự kiện y tế */}
      <div className='flex-1'>
        {selectedStudent ? (
          <Card className='mb-6'>
            <div className='flex items-center gap-4'>
              {/* Avatar có thể bổ sung sau nếu có */}
              <div>
                <div className='text-2xl font-bold'>{selectedStudentInfo?.fullname || selectedStudent.studentName}</div>
                <div className='text-gray-500'>Lớp: {selectedStudentInfo?.className || 'Không có'}</div>
                {selectedStudentInfo?.dateOfBirth && (
                  <div className='text-gray-400 text-sm'>
                    Ngày sinh:{' '}
                    {selectedStudentInfo.dateOfBirth
                      ? new Date(selectedStudentInfo.dateOfBirth).toLocaleDateString('vi-VN')
                      : ''}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ) : null}
        {selectedStudent ? (
          <Card title='Lịch sử sự kiện y tế'>
            <Timeline className='mt-4'>
              {selectedStudent.events.$values.length === 0 ? (
                <Timeline.Item color='gray'>Hiện chưa có sự kiện y tế</Timeline.Item>
              ) : (
                selectedStudent.events.$values.map((event: StudentEvent) => (
                  <Timeline.Item
                    key={event.medicalEventId}
                    color={
                      event.type === 'Sốt'
                        ? 'red'
                        : event.type === 'Tai nạn'
                          ? 'orange'
                          : event.type === 'Dịch bệnh'
                            ? 'purple'
                            : 'blue'
                    }
                  >
                    <div className='flex justify-between items-center'>
                      <div>
                        <b>{event.type}</b> - {new Date(event.date).toLocaleString()}
                        <div>{event.description}</div>
                      </div>
                      <Button type='link' onClick={() => handleViewDetails(event)}>
                        Xem chi tiết
                      </Button>
                    </div>
                  </Timeline.Item>
                ))
              )}
            </Timeline>
          </Card>
        ) : (
          <div className='text-center text-gray-400 mt-10'>Chọn một bé để xem chi tiết sự kiện y tế</div>
        )}
        <Modal
          title='Chi tiết báo cáo y tế'
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={[
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>
          ]}
        >
          {selectedEvent && <MedicalEventDetail selectedEvent={selectedEvent} />}
        </Modal>
      </div>
    </div>
  )
}

export default MedicalEventParent
