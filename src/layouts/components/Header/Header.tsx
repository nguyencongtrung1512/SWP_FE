import { useState, useRef, useEffect } from 'react'
import path from '../../../constants/path'
import { useAuth } from '../../../contexts/auth.context'
import { useNavigate } from 'react-router-dom'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getAccountInfo } from '../../../apis/parent.api'

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

function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const [userData, setUserData] = useState<AccountInfo | null>(null)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate(path.login)
  }

  useEffect(() => {
    fetchUser()
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await getAccountInfo()
      if (response.success && response.data) {
        setUserData(response.data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  return (
    <header className='flex items-center px-12 py-6 bg-white w-full relative'>
      <div className='flex items-center mr-16 mb-2'>
        <a href={path.home} className='flex items-center'>
          <span className='text-blue-500 mr-2'>
            <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect x='7' y='16' width='22' height='4' rx='2' fill='#1da1f2' />
              <rect x='16' y='7' width='4' height='22' rx='2' fill='#1da1f2' />
              <rect x='2' y='2' width='32' height='32' rx='8' stroke='#1da1f2' strokeWidth='3' />
            </svg>
          </span>
          <span className='text-3xl font-bold select-none'>
            <span className='text-gray-900'>Edu</span>
            <span className='text-blue-500'>Care</span>
          </span>
        </a>
      </div>
      {/* Menu */}
      <nav className='flex space-x-8 text-lg font-medium flex-1'>
        <a href={path.healthRecord} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Khai báo sức khỏe
        </a>
        <a href={path.vaccinationSchedule} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Lịch y tế
        </a>
        <a href={path.sendMedicine} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Gửi thuốc
        </a>
        <a href={path.medicalEvent} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Báo cáo y tế
        </a>
        <a href={path.appointment} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Đặt lịch tư vấn
        </a>
        <a href={path.blog} className='text-gray-900 hover:text-blue-500 transition-colors'>
          Blog
        </a>
      </nav>
      {/* Avatar user - only shown when logged in */}
      {isAuthenticated && user ? (
        <div className='relative' ref={dropdownRef}>
          <button
            className='flex items-center space-x-2 focus:outline-none rounded-full hover:bg-gray-100 p-1 transition-colors'
            onClick={() => setOpen(!open)}
          >
            <img
              src={
                userData?.image
                  ? `data:image/png;base64,${userData.image}`
                  : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
              }
              alt='avatar'
              className='w-10 h-10 rounded-full border-2 border-blue-400 object-cover'
            />
            <span className='font-semibold text-gray-800 mr-1'>{user.fullname}</span>
          </button>
          {open && (
            <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200'>
              <a
                href={path.profile}
                className='flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors'
                onClick={() => setOpen(false)}
              >
                <UserOutlined className='mr-3 text-gray-500' />
                <span>Hồ sơ của tôi</span>
              </a>
              <button
                className='w-full flex items-center px-4 py-3 text-red-500 hover:bg-blue-50 transition-colors'
                onClick={handleLogout}
              >
                <LogoutOutlined className='mr-3' />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <span className='bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors' onClick={() => navigate(path.login)}>
          Đăng nhập
        </span>
      )}
    </header>
  )
}

export default Header
