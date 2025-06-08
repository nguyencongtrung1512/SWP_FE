import { useEffect, useState } from 'react'
import { formatDate } from '../../utils/ulits'
import type { Profile } from '../../apis/adminManageAcount'
import { profileInfor } from '../../apis/adminManageAcount'

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          setError('Không tìm thấy thông tin người dùng')
          setLoading(false)
          return
        }

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

    fetchProfile()
  }, [])

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Đang tải...</div>
  }

  if (error) {
    return <div className='text-red-500 text-center'>{error}</div>
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Thông tin cá nhân</h1>
      {profile && (
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
      )}
    </div>
  )
}

export default Profile
