import React, { useState, useRef, useEffect } from 'react'
import { Layout } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './SideBar'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/auth.context'
import path from '../../constants/path'

const { Header, Content } = Layout

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate(path.login)
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
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

  return (
    <Layout className='min-h-screen bg-gray-50'>
      <Sidebar />
      <Layout className='ml-[220px]'>
        <Header className='bg-white px-8 py-4 shadow-sm flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-800'>Admin Dashboard</div>
          <div className='relative' ref={dropdownRef}>
            <button 
              className='flex items-center space-x-2 focus:outline-none rounded-full hover:bg-gray-100 p-1 transition-colors'
              onClick={() => setOpen(!open)}
            >
              <img 
                src={user?.avatar || 'https://i.pravatar.cc/150?img=8'} 
                alt='avatar' 
                className='w-10 h-10 rounded-full border-2 border-blue-400 object-cover'
              />
              <span className='text-gray-700 font-medium'>{user?.name || 'Admin'}</span>
            </button>
            
            {open && (
              <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200'>
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
        </Header>
        <Content className='m-6 p-6 bg-white rounded-lg shadow-sm'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
