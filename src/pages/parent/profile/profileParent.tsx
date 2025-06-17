import React, { useEffect, useState } from 'react'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  UserAddOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { getAccountInfo } from '../../../api/parent.api'
import UpdateProfileModal from './updateProfile'
import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal'
import AddStudentModal from '../../../components/Profile/AddStudentModal'

interface StudentInfo {
  fullname: string
  studentCode: string
}

interface AccountInfo {
  accountID: number
  email: string
  fullname: string
  address: string
  phoneNumber: string
  student: StudentInfo[]
}

const ProfileParent = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)

  const fetchAccountInfo = async () => {
    setLoading(true)
    try {
      const response = await getAccountInfo()
      if (response.success) {
        setAccountInfo(response.data)
        console.log("Fetched account info:", response.data)
      } else {
        setError(response.message || 'Không thể lấy thông tin tài khoản')
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải thông tin')
      console.error('Error fetching account info:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccountInfo()
  }, [])

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleUpdateSuccess = () => {
    fetchAccountInfo() // Re-fetch account info after successful update
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
    fetchAccountInfo() // Re-fetch account info after successful addition
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
        {/* Thông tin phụ huynh bên trái */}
        <div className='bg-white rounded-2xl shadow p-8 w-[350px] flex flex-col items-center'>
          {/* Avatar */}
          <div className='w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-400 text-2xl relative'>
            <UserOutlined style={{ fontSize: 48 }} />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 select-none'>
              Profile
            </span>
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

        {/* Phần phải: Tabs + Danh sách con */}
        <div className='flex-1 flex flex-col gap-6'>
          {/* Tabs và nút chỉnh sửa */}
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

          {/* Danh sách con */}
          <div className='bg-white rounded-2xl shadow p-6'>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-lg font-semibold'>Danh sách con</div>
              <button className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium'
                onClick={handleOpenAddStudentModal}
              >
                <UserAddOutlined /> Thêm con
              </button>
            </div>
            {accountInfo?.student && accountInfo.student.length > 0 ? (
              <div className='flex gap-4'>
                {accountInfo.student.map((child, idx) => (
                  <div key={idx} className='flex items-center gap-4 bg-gray-50 rounded-xl p-4 flex-1 min-w-[220px]'>
                    <div className='w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg'>
                      {child.fullname?.split(' ').slice(-2).join(' ') || 'HS'}
                    </div>
                    <div>
                      <div className='font-semibold'>{child.fullname || 'Chưa có tên'}</div>
                      <div className='flex items-center gap-1 text-gray-400 text-xs mt-1'>
                        <TeamOutlined /> {child.studentCode || 'Chưa có mã học sinh'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-gray-500 text-center py-4'>Chưa có thông tin học sinh</div>
            )}
          </div>
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
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
      />
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        onAddSuccess={handleAddStudentSuccess}
      />
    </div>
  )
}

export default ProfileParent
