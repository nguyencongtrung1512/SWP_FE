import React, { useState, useRef, useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/auth.context'
import { getAccountInfo } from '../../apis/parent.api'
import NurseProfileModal from '../../pages/nurse/profile/NurseProfile'
import path from '../../constants/path'

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

const { Header, Content } = Layout

const NurseLayout: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const { logout } = useAuth()
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

  const handleProfileClick = () => {
    setOpen(false)
    setProfileModalOpen(true)
  }

  const handleProfileModalClose = () => {
    setProfileModalOpen(false)
    fetchUser()
  }

  return (
    <Layout className='min-h-screen bg-gray-50'>
      <Sidebar />
      <Layout className='ml-[220px]'>
        <Header className='bg-white px-8 py-4 shadow-sm flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-800'>Nurse Dashboard</div>
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
              <span className='text-gray-700 font-medium'>{userData?.fullname || 'Y tá'}</span>
            </button>
            
            {open && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200'>
                <button
                  className='w-full flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 transition-colors text-sm'
                  onClick={handleProfileClick}
                >
                  <UserOutlined className='mr-2' />
                  <span>Hồ sơ</span>
                </button>
                <button
                  className='w-full flex items-center px-3 py-2 text-red-500 hover:bg-blue-50 transition-colors text-sm'
                  onClick={handleLogout}
                >
                  <LogoutOutlined className='mr-2' />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </Header>
        <Content className='m-6 p-6 bg-white rounded-lg shadow-sm'>
          <Outlet />
        </Content>
      </Layout>
      <NurseProfileModal
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        userData={userData ? {
          email: userData.email,
          fullname: userData.fullname,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          image: userData.image
        } : undefined}
      />
    </Layout>
  )
}

export default NurseLayout
