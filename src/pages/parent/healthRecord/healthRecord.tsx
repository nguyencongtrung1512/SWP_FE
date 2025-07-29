import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Edit, User, Calendar, Users, Heart, Plus, Activity, Stethoscope, Eye, Weight, Ruler, FileText } from 'lucide-react'
import { getAccountInfo, getMyChildren, Student, addHealthRecord, getHealthRecordsByStudentId, editHealthRecord, HealthRecordData } from '../../../apis/parent.api'
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
      const [accountRes, childrenRes] = await Promise.all([getAccountInfo(), getMyChildren()])
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

      if (response.message === 'Health record updated successfully.' && response.data) {
        const updatedStudent: StudentWithHealthRecord = {
          ...selectedStudent,
          healthRecord: {
            weight: response.data.weight,
            height: response.data.height,
            leftEye: response.data.leftEye,
            rightEye: response.data.rightEye,
            note: response.data.note
          }
        }

        const updatedStudents = students.map((s) => (s.studentId === selectedStudent.studentId ? updatedStudent : s))

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
        note: healthRecordData.note || ''
      })

      if (response.success && response.data) {
        const updatedStudent: StudentWithHealthRecord = {
          ...selectedStudent,
          healthRecord: {
            weight: response.data.weight,
            height: response.data.height,
            leftEye: response.data.leftEye,
            rightEye: response.data.rightEye,
            note: response.data.note
          }
        }

        const updatedStudents = students.map((s) => (s.studentId === selectedStudent.studentId ? updatedStudent : s))

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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <Heart className='h-8 w-8 text-red-400 animate-pulse' />
            <Activity className='h-10 w-10 text-blue-500 animate-bounce' />
            <Stethoscope className='h-8 w-8 text-green-500 animate-pulse' />
          </div>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl'>
            <p className='text-gray-700 font-medium text-lg'>Đang tải thông tin học sinh...</p>
            <div className='mt-3 flex justify-center'>
              <div className='flex space-x-1'>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></div>
                <div
                  className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-lg mb-4'>{error}</div>
          <Button onClick={fetchStudents}>Thử lại</Button>
        </div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-100'>
        <div className='w-full mx-auto px-20'>
          <div className='flex justify-between items-center mb-2'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>Hồ Sơ Sức Khỏe Học Sinh</h1>
              <p className='text-gray-600 text-lg mt-2'>Theo dõi và cập nhật thông tin sức khỏe của con bạn</p>
            </div>
          </div>
          <Card className='shadow-xl'>
            <CardContent className='p-8 text-center flex flex-col justify-center items-center'>
              <div className='text-gray-500 text-xl font-medium'>Danh sách học sinh trống</div>
              <p className='text-gray-400 mt-2 text-lg mb-6'>
                Vui lòng thêm thông tin con của bạn để bắt đầu theo dõi sức khỏe
              </p>
              <Button variant='outline' asChild>
                <a href='/parent/profile'>Đi đến hồ sơ</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-cyan-50 py-12 px-100'>
      <div className='w-full mx-auto px-20'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Hồ Sơ Sức Khỏe Học Sinh</h1>
            <p className='text-gray-600 text-lg mt-2'>Theo dõi và cập nhật thông tin sức khỏe của con bạn</p>
          </div>
        </div>
        <div className='flex justify-start mb-4 space-x-4'>
          {students.map((student) => (
            <Button
              key={student.studentId}
              onClick={() => handleStudentSelect(student)}
              variant={selectedStudent?.studentId === student.studentId ? 'default' : 'outline'}
              className={`px-6 py-3 h-auto transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105 hover:shadow-lg
              ${
                selectedStudent?.studentId === student.studentId
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl border-0'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border-cyan-200 hover:border-cyan-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${selectedStudent?.studentId === student.studentId ? 'bg-white text-cyan-600 shadow-md' : 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700'}`}
              >
                {student.fullname.trim().split(" ").pop()?.charAt(0).toUpperCase()}
              </div>
              <span className='font-semibold'>{student.fullname}</span>
            </Button>
          ))}
        </div>
        <Card className='shadow-2xl overflow-hidden border-0 bg-white/95 backdrop-blur-sm'>
          <CardHeader className='bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-4'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{selectedStudent?.fullname}</h2>
                <p className='text-lg mt-1 text-white'>Mã số: {selectedStudent?.studentCode}</p>
              </div>
              <div className='flex space-x-3'>
                {selectedStudent?.healthRecord && (
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className='bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                    variant='ghost'
                  >
                    <Edit className='w-4 h-4 mr-2' />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <InfoItem
                icon={<Calendar className='text-cyan-600' />}
                label='Ngày sinh'
                value={selectedStudent?.dateOfBirth ? dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY') : '—'}
              />
              <InfoItem
                icon={<User className='text-cyan-600' />}
                label='Giới tính'
                value={
                  selectedStudent?.gender === 'Male' ? 'Nam' : selectedStudent?.gender === 'Female' ? 'Nữ' : 'Khác'
                }
              />
              <InfoItem icon={<Users className='text-cyan-600' />} label='Lớp' value={selectedStudent?.className} />
            </div>
            <div className='bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100'>
              <h3 className='text-lg font-bold text-gray-800 mb-6 flex items-center'>
                <div className='w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg'>
                  <Heart className='text-white w-5 h-5 animate-pulse' />
                </div>
                Thông tin sức khỏe
              </h3>

              {selectedStudent?.healthRecord ? (
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
                      <CardContent className='p-4'>
                        <div className='flex items-center mb-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3'>
                            <Ruler className='w-4 h-4 text-green-600' />
                          </div>
                          <span className='text-gray-600 font-semibold text-sm'>Chiều cao</span>
                        </div>
                        <p className='font-bold text-gray-900 ml-11'>{selectedStudent.healthRecord.height} cm</p>
                      </CardContent>
                    </Card>
                    <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
                      <CardContent className='p-4'>
                        <div className='flex items-center mb-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mr-3'>
                            <Weight className='w-4 h-4 text-blue-600' />
                          </div>
                          <span className='text-gray-600 font-semibold text-sm'>Cân nặng</span>
                        </div>
                        <p className='font-bold text-gray-900 ml-11'>{selectedStudent.healthRecord.weight} kg</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
                      <CardContent className='p-4'>
                        <div className='flex items-center mb-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3'>
                            <Eye className='w-4 h-4 text-purple-600' />
                          </div>
                          <span className='text-gray-600 font-semibold text-sm'>Chỉ số mắt trái</span>
                        </div>
                        <p className='font-bold text-gray-900 ml-11'>{selectedStudent.healthRecord.leftEye}/10</p>
                      </CardContent>
                    </Card>
                    <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
                      <CardContent className='p-4'>
                        <div className='flex items-center mb-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-3'>
                            <Eye className='w-4 h-4 text-indigo-600' />
                          </div>
                          <span className='text-gray-600 font-semibold text-sm'>Chỉ số mắt phải</span>
                        </div>
                        <p className='font-bold text-gray-900 ml-11'>{selectedStudent.healthRecord.rightEye}/10</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
                    <CardContent className='p-4'>
                      <div className='flex items-center mb-2'>
                        <div className='w-8 h-8 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mr-3'>
                          <FileText className='w-4 h-4 text-orange-600' />
                        </div>
                        <span className='text-gray-600 font-semibold text-sm'>Ghi chú từ phụ huynh</span>
                      </div>
                      <p className='font-medium text-gray-900 leading-relaxed break-words ml-11'>
                        {selectedStudent.healthRecord.note || 'Chưa có ghi chú'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg'>
                    <Heart className='text-cyan-500 w-10 h-10 animate-pulse' />
                  </div>
                  <h4 className='text-gray-700 mb-2 text-2xl font-bold'>Chưa có hồ sơ sức khỏe</h4>
                  <p className='text-gray-500 mb-6 max-w-md mx-auto text-lg'>
                    Tạo hồ sơ sức khỏe để theo dõi tình trạng sức khỏe của con bạn
                  </p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105'
                    size='lg'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Tạo hồ sơ sức khỏe
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <HealthRecordModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data: HealthRecordData) => {
          if (!selectedStudent || !account) return Promise.resolve()
          return handleEditHealthRecord({
            ...data,
            parentID: account.accountID,
            studentCode: selectedStudent.studentCode,
          })
        }}
        student={selectedStudent}
        mode="edit"
        initialData={
          selectedStudent?.healthRecord
            ? {
                weight: selectedStudent.healthRecord.weight,
                height: selectedStudent.healthRecord.height,
                note: selectedStudent.healthRecord.note,
                leftEye: selectedStudent.healthRecord.leftEye,
                rightEye: selectedStudent.healthRecord.rightEye,
              }
            : undefined
        }
      />

      <HealthRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data: HealthRecordData) => {
          if (!selectedStudent || !account) return Promise.resolve()
          return handleAddHealthRecord({
            ...data,
            parentID: account.accountID,
            studentCode: selectedStudent.studentCode,
          })
        }}
        student={selectedStudent}
        mode="add"
      />
    </div>
  )
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) => (
  <Card className='shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group'>
    <CardContent className='p-4 flex items-start space-x-3'>
      <div className='w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shadow-md'>
        {icon}
      </div>
      <div className='flex-1'>
        <p className='text-gray-600 font-semibold text-sm mb-1'>{label}</p>
        <p className='font-bold text-gray-900'>{value || 'N/A'}</p>
      </div>
    </CardContent>
  </Card>
)

export default HealthRecord