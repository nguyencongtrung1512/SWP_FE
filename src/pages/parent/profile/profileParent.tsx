import { useEffect, useState } from 'react'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  UserAddOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons'
import { getAccountInfo, getMyChildren, Student } from '../../../apis/parent.api'
import UpdateProfileModal from './updateProfile'
import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal'
import AddStudentModal from '../../../components/Profile/AddStudentModal'
import ElectronicHealthBook from '../../../components/Profile/ElectronicHealthBook'
import { getMedicalEventByStudent } from '../../../apis/electronicHealthBook.api'
import { getRecordsByStudent as getVaccinationRecordsByStudent } from '../../../apis/vaccination'
import { getRecordsByStudent as getHealthCheckRecordsByStudent } from '../../../apis/healthCheck'
import type { MedicalEvent } from '../../../apis/electronicHealthBook.api'
import type { VaccinationRecord } from '../../../apis/vaccination'
import type { HealthCheckRecord } from '../../../apis/healthCheck'

interface AccountInfo {
  $id: string
  id: number
  fullname: string
  email: string
  phoneNumber: string
  address: string
  role: string
  status: boolean
  parent: null
  nurse: null
  admin: null
  image?: string
}

const ProfileParent = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([])
  const [healthChecks, setHealthChecks] = useState<HealthCheckRecord[]>([])
  const [loadingBook, setLoadingBook] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [accountRes, childrenRes] = await Promise.all([getAccountInfo(), getMyChildren()])

      if (accountRes.success && accountRes.data) {
        setAccountInfo(accountRes.data)
      } else {
        setError(accountRes.message || 'Không thể lấy thông tin tài khoản')
      }

      if (childrenRes.success && childrenRes.data) {
        setStudents(childrenRes.data)
      } else {
        setError(childrenRes.message || 'Không thể lấy danh sách con')
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải thông tin')
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleUpdateSuccess = () => {
    fetchData()
  }

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false)
  }

  const handleOpenAddStudentModal = () => {
    setIsAddStudentModalOpen(true)
  }

  const handleCloseAddStudentModal = () => {
    setIsAddStudentModalOpen(false)
  }

  const handleAddStudentSuccess = () => {
    fetchData()
  }

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student)
    setLoadingBook(true)
    try {
      const [medicalEventRes, vaccinationRes, healthCheckRes] = await Promise.all([
        getMedicalEventByStudent(student.studentId),
        getVaccinationRecordsByStudent(student.studentId),
        getHealthCheckRecordsByStudent(student.studentId),
        console.log("trang 2 :getMedicalEventByStudent", getMedicalEventByStudent(4))
      ])
      setMedicalEvents(medicalEventRes.data?.events?.$values || [])
      setVaccinations(vaccinationRes.data?.$values || [])
      setHealthChecks(healthCheckRes.data?.$values || [])
    } catch {
      setMedicalEvents([])
      setVaccinations([])
      setHealthChecks([])
    }
    setLoadingBook(false)
  }

  const handleCloseHealthBook = () => {
    setSelectedStudent(null)
    setMedicalEvents([])
    setVaccinations([])
    setHealthChecks([])
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8 px-8 flex items-center justify-center'>
        <div className='text-lg text-gray-600'>Đang tải thông tin...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 py-8 px-8 flex items-center justify-center'>
        <div className='text-lg text-red-500'>{error}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-8'>
      <h1 className='text-2xl font-bold mb-6'>Hồ sơ của tôi</h1>
      <div className='flex gap-8'>
        <div className='bg-white rounded-2xl shadow p-8 w-[350px] flex flex-col items-center'>
          <div className='w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-400 text-2xl relative overflow-hidden'>
            {accountInfo?.image ? (
              <img
                src={`data:image/png;base64,${accountInfo.image}`}
                alt='avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <>
                <UserOutlined style={{ fontSize: 48 }} />
                <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 select-none'>
                  Profile
                </span>
              </>
            )}
          </div>
          <div className='text-xl font-bold mt-2'>{accountInfo?.fullname || 'Chưa có tên'}</div>
          <div className='text-gray-500 mb-4'>Phụ huynh</div>
          <div className='w-full space-y-3 text-gray-700'>
            <div className='flex items-center gap-2'>
              <MailOutlined /> {accountInfo?.email || 'Chưa có email'}
            </div>
            <div className='flex items-center gap-2'>
              <PhoneOutlined /> {accountInfo?.phoneNumber || 'Chưa có số điện thoại'}
            </div>
            <div className='flex items-center gap-2'>
              <EnvironmentOutlined /> {accountInfo?.address || 'Chưa có địa chỉ'}
            </div>
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <div className='space-x-2'>
              <button className='px-4 py-2 bg-gray-100 rounded-full font-medium'>Con của tôi</button>
            </div>
            <div className='flex gap-2'>
              <button
                className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50'
                onClick={handleOpenEditModal}
              >
                <EditOutlined /> Chỉnh sửa hồ sơ
              </button>
              <button
                className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50'
                onClick={handleOpenChangePasswordModal}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow p-6'>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-lg font-semibold'>Danh sách con</div>
              <button
                className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium'
                onClick={handleOpenAddStudentModal}
              >
                <UserAddOutlined /> Thêm con
              </button>
            </div>
            {students && students.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {students.map((child) => (
                  <div
                    key={child.studentId}
                    className={`flex items-center gap-4 bg-gray-50 rounded-xl p-4 min-w-[220px] cursor-pointer hover:bg-gray-100 transition-colors ${selectedStudent?.studentId === child.studentId ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => handleSelectStudent(child)}
                  >
                    <div className='flex-1'>
                      <div className='font-semibold'>{child.fullname || 'Chưa có tên'}</div>
                      <div className='flex items-center gap-1 text-gray-400 text-xs mt-1'>
                        <TeamOutlined /> {child.studentCode || 'Chưa có mã học sinh'}
                      </div>
                    </div>
                    <div className='p-2 text-blue-500'>
                      <BookOutlined />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-gray-500 text-center py-4'>Chưa có thông tin học sinh</div>
            )}
          </div>

          {selectedStudent && (
            <div className='mt-8 transition-all duration-500 ease-in-out'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-bold'>Sổ sức khỏe điện tử - {selectedStudent.fullname}</h2>
                <button
                  onClick={handleCloseHealthBook}
                  className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium'
                >
                  x
                </button>
              </div>
              <div className={`transition-all duration-500 ease-in-out ${loadingBook ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                {loadingBook ? (
                  <div className='text-center py-8 text-gray-500'>Đang tải dữ liệu sổ sức khỏe...</div>
                ) : (
                  <ElectronicHealthBook
                    student={{
                      studentId: selectedStudent.studentId,
                      fullname: selectedStudent.fullname,
                      classId: selectedStudent.classID,
                      className: selectedStudent.className,
                      studentCode: selectedStudent.studentCode,
                      gender: selectedStudent.gender,
                      parentId: selectedStudent.parentID,
                      parentName: '',
                      dateOfBirth: selectedStudent.dateOfBirth
                    }}
                    medicalEvents={medicalEvents}
                    vaccinations={vaccinations}
                    healthChecks={healthChecks}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {accountInfo && (
        <UpdateProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialData={{
            email: accountInfo.email,
            fullname: accountInfo.fullname,
            address: accountInfo.address,
            phoneNumber: accountInfo.phoneNumber
          }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={handleCloseChangePasswordModal} />
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        onAddSuccess={handleAddStudentSuccess}
      />
    </div>
  )
}

export default ProfileParent