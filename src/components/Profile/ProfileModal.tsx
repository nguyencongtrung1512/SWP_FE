import { Modal, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { formatDate } from '../../utils/ulits'
import type { Profile } from '../../apis/adminManageAcount'
import { profileInfor } from '../../apis/adminManageAcount'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileInfor.getProfileInfor()
        if (response.data) {
          setProfile(response.data)
        } else {
          setError('Không thể tải thông tin profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Có lỗi xảy ra khi tải thông tin profile')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen])

  return (
    <Modal title='Thông tin cá nhân' open={isOpen} onCancel={onClose} footer={null} width={600}>
      {loading ? (
        <Spin>loading...</Spin>
      ) : error ? (
        <div className='text-red-500 text-center'>{error}</div>
      ) : (
        profile && (
          <div className='space-y-4'>
            <div className='flex items-center'>
              <span className='font-semibold w-32'>Email:</span>
              <span>{profile.email}</span>
            </div>
            <div className='flex items-center'>
              <span className='font-semibold w-32'>Họ và tên:</span>
              <span>{profile.fullname}</span>
            </div>
            <div className='flex items-center'>
              <span className='font-semibold w-32'>Địa chỉ:</span>
              <span>{profile.address}</span>
            </div>
            <div className='flex items-center'>
              <span className='font-semibold w-32'>Ngày sinh:</span>
              <span>{formatDate(profile.dateOfBirth)}</span>
            </div>
            <div className='flex items-center'>
              <span className='font-semibold w-32'>Số điện thoại:</span>
              <span>{profile.phoneNumber}</span>
            </div>
          </div>
        )
      )}
    </Modal>
  )
}

export default ProfileModal
