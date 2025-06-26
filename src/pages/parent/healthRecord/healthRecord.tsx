import React, { useState, useEffect } from 'react'
import { Button, Spin } from 'antd'
import {
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { getAccountInfo, getMyChildren, Student, addHealthRecord, getHealthRecordsByStudentId, editHealthRecord, HealthRecordData } from '../../../api/parent.api'
import HealthRecordModal from './healthRecordModal'
import dayjs from 'dayjs'
import { translateMessage } from '../../../utils/message'
import { toast } from 'react-toastify'

interface HealthRecord {
  weight: number
  height: number
  note: string
  parentID: number
  studentCode: string
  leftEye: number
  rightEye: number
}

interface StudentWithHealthRecord extends Student {
  studentId: number
  className: string
  healthRecord?: HealthRecordData
}

const HealthRecord = () => {
  const [students, setStudents] = useState<StudentWithHealthRecord[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentWithHealthRecord | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<{ accountID: number } | null>(null)
  const [healthRecordIds, setHealthRecordIds] = useState<{[key: number]: number}>({})

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)

    try {
      const [accountRes, childrenRes] = await Promise.all([
        getAccountInfo(),
        getMyChildren()
      ])

      const account = accountRes?.data
      const children = childrenRes?.data

      if (!account || !children) {
        throw new Error('Không tìm thấy thông tin học sinh hoặc phụ huynh.')
      }

      setAccount(account)

      const studentsWithHealthRecords: StudentWithHealthRecord[] = []
      const recordIds: { [key: number]: number } = {}

      for (const student of children as StudentWithHealthRecord[]) {
        try {
          const healthRecordRes = await getHealthRecordsByStudentId(student.studentId)
          const recordList = healthRecordRes?.data?.$values

          if (recordList && recordList.length > 0) {
            const record = recordList[0]

            recordIds[student.studentId] = record.healthRecordId
            
            studentsWithHealthRecords.push({
              ...student,
              healthRecord: {
                weight: record.weight,
                height: record.height,
                // bmi: record.bmi,
                // nutritionStatus: record.nutritionStatus,
                leftEye: record.leftEye,
                rightEye: record.rightEye,
                note: record.note
              }
            })
            console.log(recordIds)
          } else {
            studentsWithHealthRecords.push({
              ...student,
              healthRecord: undefined
            })
          }
        } catch (e) {
          studentsWithHealthRecords.push({
            ...student,
            healthRecord: undefined
          })
        }
      }

      setHealthRecordIds(recordIds)
      setStudents(studentsWithHealthRecords)

      if (studentsWithHealthRecords.length > 0) {
        setSelectedStudent(studentsWithHealthRecords[0])
      }

    } catch (err) {
      console.log('Error fetching students:', err)
      setError('Không thể tải thông tin học sinh. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditHealthRecord = async (healthRecordData: HealthRecord) => {
    if (!selectedStudent || !healthRecordIds[selectedStudent.studentId]) {
      toast.error('Không tìm thấy thông tin hồ sơ sức khỏe!')
      return
    }

    try {
      const healthRecordId = healthRecordIds[selectedStudent.studentId]
      const response = await editHealthRecord(healthRecordId, healthRecordData)

      if (response.message === "Health record updated successfully." && response.data) {
        const updatedStudent: StudentWithHealthRecord = {
          ...selectedStudent,
          healthRecord: {
            weight: response.data.weight,
            height: response.data.height,
            // bmi: response.data.bmi,
            // nutritionStatus: response.data.nutritionStatus,
            leftEye: response.data.leftEye,
            rightEye: response.data.rightEye,
            note: response.data.note
          }
        }

        const updatedStudents = students.map(s => 
          s.studentId === selectedStudent.studentId ? updatedStudent : s
        )
        
        setStudents(updatedStudents)
        setSelectedStudent(updatedStudent)
        setIsEditModalOpen(false)
        
        toast.success('Cập nhật thông tin sức khỏe thành công!')
        
      } else {
        toast.error(translateMessage(response.message, 'healthRecord'))
      }
    } catch (error) {
      console.error('Error updating health record:', error)
      toast.error('Đã có lỗi xảy ra khi cập nhật hồ sơ sức khỏe!')
    }
  }

  const handleAddHealthRecord = async (healthRecordData: HealthRecord) => {
    if (!selectedStudent || !account?.accountID) {
      toast.error('Không tìm thấy thông tin phụ huynh và học sinh!')
      return
    }

    try {
      const response = await addHealthRecord({
        parentID: account.accountID,
        studentCode: selectedStudent.studentCode,
        weight: healthRecordData.weight,
        height: healthRecordData.height,
        leftEye: healthRecordData.leftEye,
        rightEye: healthRecordData.rightEye,
        note: ''
      })

      if (response.success && response.data) {
        const updatedStudent: StudentWithHealthRecord = {
          ...selectedStudent,
          healthRecord: {
            weight: response.data.weight,
            height: response.data.height,
            // bmi: response.data.bmi,
            // nutritionStatus: response.data.nutritionStatus,
            leftEye: response.data.leftEye,
            rightEye: response.data.rightEye,
            note: response.data.note
          }
        }

        const updatedStudents = students.map(s => 
          s.studentId === selectedStudent.studentId ? updatedStudent : s
        )
        
        setStudents(updatedStudents)
        setSelectedStudent(updatedStudent)
        setIsAddModalOpen(false)
        
        toast.success(translateMessage(response.message, 'healthRecord'))
        
        await fetchStudents()
      } else {
        toast.error(translateMessage(response.message, 'healthRecord'))
      }
    } catch (error) {
      console.error('Error adding health record:', error)
      toast.error('Đã có lỗi xảy ra khi tạo hồ sơ sức khỏe!')
    }
  }

  const handleStudentSelect = (student: StudentWithHealthRecord) => {
    setSelectedStudent(student)
  }

  // const translateNutritionStatus = (status: string) => {
  //   switch (status) {
  //     case 'Underweight':
  //       return 'Gầy (Thiếu cân)'
  //     case 'Normal':
  //       return 'Bình thường'
  //     case 'Overweight':
  //       return 'Thừa cân'
  //     case 'Obese':
  //       return 'Béo phì'
  //     case 'ExtremlyObese':
  //       return 'Béo phì nghiêm trọng'
  //     default:
  //       return 'Chưa xác định'
  //   }
  // }

  // const getNutritionStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'Underweight':
  //       return 'text-yellow-600 bg-yellow-50'
  //     case 'Normal':
  //       return 'text-green-600 bg-green-50'
  //     case 'Overweight':
  //       return 'text-orange-600 bg-orange-50'
  //     case 'Obese':
  //     case 'ExtremlyObese':
  //       return 'text-red-600 bg-red-50'
  //     default:
  //       return 'text-gray-600 bg-gray-50'
  //   }
  // }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <Spin size='large' />
          <p className='mt-4 text-gray-600'>Đang tải thông tin học sinh...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-lg mb-4'>{error}</div>
          <Button onClick={fetchStudents} type='primary'>
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-100'>
        <div className='w-full mx-auto px-20'>
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>Hồ Sơ Sức Khỏe Học Sinh</h1>
              <p className='text-gray-600 text-lg mt-2'>Theo dõi và cập nhật thông tin sức khỏe của con bạn</p>
            </div>
          </div>
          <div className='bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col justify-center items-center'>
            <div className='text-gray-500 text-xl font-medium'>Danh sách học sinh trống</div>
            <p className='text-gray-400 mt-2 text-lg mb-6'>Vui lòng thêm thông tin con của bạn để bắt đầu theo dõi sức khỏe</p>
            <a href='/parent/profile' className='px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors'>
              Đi đến hồ sơ
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-100'>
      <div className='w-full mx-auto px-20'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Hồ Sơ Sức Khỏe Học Sinh</h1>
            <p className='text-gray-600 text-lg mt-2'>Theo dõi và cập nhật thông tin sức khỏe của con bạn</p>
          </div>
        </div>
        
        <div className='flex justify-start mb-8 space-x-4'>
          {students.map((student) => (
            <button
              key={student.studentId}
              onClick={() => handleStudentSelect(student)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 whitespace-nowrap
              ${
                selectedStudent?.studentId === student.studentId
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${selectedStudent?.studentId === student.studentId ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-500'}`}
              >
                {student.fullname.charAt(0)}
              </div>
              <span className='font-medium text-md'>{student.fullname}</span>
            </button>
          ))}
        </div>
        
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{selectedStudent?.fullname}</h2>
                <p className='text-blue-100 mt-1'>Mã số: {selectedStudent?.studentCode}</p>
              </div>
              <div className='flex space-x-3'>
                {selectedStudent?.healthRecord && (
                  <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={() => setIsEditModalOpen(true)}
                    className='bg-white/20 border-none hover:bg-white/30'
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <InfoItem
                icon={<CalendarOutlined className='text-blue-500' />}
                label='Ngày sinh'
                value={
                  selectedStudent?.dateOfBirth
                    ? dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY')
                    : '—'
                }
              />
              <InfoItem
                icon={<UserOutlined className='text-blue-500' />}
                label='Giới tính'
                value={
                  selectedStudent?.gender === 'Male'
                    ? 'Nam'
                    : selectedStudent?.gender === 'Female'
                    ? 'Nữ'
                    : 'Khác'
                }
              />
              <InfoItem 
                icon={<TeamOutlined className='text-blue-500' />} 
                label='Lớp' 
                value={selectedStudent?.className} 
              />
            </div>

            <div className='bg-blue-50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <MedicineBoxOutlined className='text-blue-500 mr-2' />
                Thông tin sức khỏe
              </h3>
              
              {selectedStudent?.healthRecord ? (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Chiều cao</span>
                      <p className='font-semibold text-gray-900 text-lg'>
                        {selectedStudent.healthRecord.height} cm
                      </p>
                    </div>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Cân nặng</span>
                      <p className='font-semibold text-gray-900 text-lg'>
                        {selectedStudent.healthRecord.weight} kg
                      </p>
                    </div>
                  </div>
                  {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Chỉ số BMI</span>
                      <p className='font-semibold text-gray-900 text-lg'>
                        {selectedStudent.healthRecord.bmi}
                      </p>
                    </div>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Tình trạng dinh dưỡng</span>
                      <p className={`font-semibold text-lg px-3 py-1 rounded-full inline-block ${getNutritionStatusColor(selectedStudent.healthRecord.nutritionStatus)}`}>
                        {translateNutritionStatus(selectedStudent.healthRecord.nutritionStatus)}
                      </p>
                    </div>
                  </div> */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Chỉ số mắt trái</span>
                      <p className='font-semibold text-gray-900 text-lg'>
                        {selectedStudent.healthRecord.leftEye}/10
                      </p>
                    </div>
                    <div className='bg-white rounded-lg p-4 shadow-sm'>
                      <span className='text-gray-500 text-sm block mb-1'>Chỉ số mắt phải</span>
                      <p className='font-semibold text-lg px-3 py-1 rounded-full inline-block'>
                        {selectedStudent.healthRecord.rightEye}/10
                      </p>
                    </div>
                  </div>
                  <div className='bg-white rounded-lg p-4 shadow-sm'>
                    <span className='text-gray-500 text-sm block mb-1'>Ghi chú từ phụ huynh</span>
                    <p className='font-medium text-gray-900 text-lg leading-relaxed'>
                      {selectedStudent.healthRecord.note || 'Chưa có ghi chú'}
                    </p>
                  </div>
                </>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4'>
                    <MedicineBoxOutlined className='text-gray-500 text-2xl' />
                  </div>
                  <p className='text-gray-500 mb-2 text-lg'>Chưa có hồ sơ sức khỏe</p>
                  <p className='text-gray-400 mb-4 text-md'>Tạo hồ sơ sức khỏe để theo dõi con của bạn</p>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                    className='bg-blue-500 hover:bg-blue-600'
                    size='large'
                  >
                    Tạo hồ sơ sức khỏe
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <HealthRecordModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          if (!selectedStudent || !account) return Promise.resolve()

          return handleEditHealthRecord({
            ...data,
            parentID: account.accountID,
            studentCode: selectedStudent.studentCode
          })
        }}
        student={selectedStudent}
        mode="edit"
        initialData={selectedStudent?.healthRecord ? {
          weight: selectedStudent.healthRecord.weight,
          height: selectedStudent.healthRecord.height,
          note: selectedStudent.healthRecord.note,
          leftEye: selectedStudent.healthRecord.leftEye,
          rightEye: selectedStudent.healthRecord.rightEye
        } : undefined}
      />

      <HealthRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => {
          if (!selectedStudent || !account) return Promise.resolve()
          return handleAddHealthRecord({
            ...data,
            parentID: account.accountID,
            studentCode: selectedStudent.studentCode
          })
        }}
        student={selectedStudent}
        mode="add"
      />
    </div>
  )
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) => (
  <div className='bg-gray-50 rounded-lg p-4 flex items-start space-x-3 shadow-sm'>
    <div className='mt-1'>{icon}</div>
    <div className='flex-1'>
      <p className='text-gray-500 text-sm mb-1'>{label}</p>
      <p className='font-medium text-gray-900'>{value || 'N/A'}</p>
    </div>
  </div>
)

export default HealthRecord