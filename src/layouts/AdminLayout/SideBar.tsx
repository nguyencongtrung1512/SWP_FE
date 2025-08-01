import React from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import path from '../../constants/path'

const { Sider } = Layout

// Custom styled component for animated icons
const AnimatedIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className='inline-block transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-12 hover:text-blue-500 mr-3'
    style={{
      transformOrigin: 'center'
    }}
  >
    {children}
  </span>
)

// Alternative bounce animation
const BounceIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className='inline-block transition-all duration-300 ease-in-out hover:animate-bounce hover:text-blue-500 mr-3'>
    {children}
  </span>
)

// Pulse animation
const PulseIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className='inline-block transition-all duration-300 ease-in-out hover:animate-pulse hover:scale-105 hover:text-blue-500 mr-3'>
    {children}
  </span>
)

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: path.DASHBOARD_ADMIN,
      icon: (
        <AnimatedIcon>
          <DashboardOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Thống kê tổng quan'
    },
    {
      key: path.USER_MANAGEMENT,
      icon: (
        <BounceIcon>
          <UserOutlined className='text-lg' />
        </BounceIcon>
      ),
      label: 'Quản lí người dùng'
    },
    {
      key: path.GRADE_MANAGEMENT,
      icon: (
        <AnimatedIcon>
          <BookOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Quản lí lớp học'
    },
    {
      key: path.CATEGORY_MANAGEMENT,
      icon: (
        <PulseIcon>
          <EditOutlined className='text-lg' />
        </PulseIcon>
      ),
      label: 'Quản lí Blog'
    },
    {
      key: path.VACCINE_MANAGEMENT,
      icon: (
        <AnimatedIcon>
          <MedicineBoxOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Quản lí Vaccine'
    },
    {
      key: path.HEALTHCHECK_MANAGEMENT,
      icon: (
        <BounceIcon>
          <CalendarOutlined className='text-lg' />
        </BounceIcon>
      ),
      label: 'Quản lí lịch khám'
    }
  ]

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  return (
    <Sider width={220} className='fixed h-full left-0 top-0 bg-white border-r border-gray-200'>
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <div className='flex items-center'>
          <span className='text-blue-500 mr-2 transition-transform duration-300 hover:rotate-45 hover:scale-110'>
            <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect x='7' y='16' width='22' height='4' rx='2' fill='#1da1f2' />
              <rect x='16' y='7' width='4' height='22' rx='2' fill='#1da1f2' />
              <rect x='2' y='2' width='32' height='32' rx='8' stroke='#1da1f2' strokeWidth='3' />
            </svg>
          </span>
          <span className='text-2xl font-bold select-none'>
            <span className='text-gray-900'>Edu</span>
            <span className='text-blue-500'>Care</span>
          </span>
        </div>
      </div>
      <Menu
        mode='inline'
        selectedKeys={[location.pathname]}
        className='border-0'
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        style={{
          height: 'calc(100% - 64px)',
          borderRight: 0,
          fontSize: '15px'
        }}
        theme="light"
      />
      
      {/* Global CSS styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ant-menu-item {
            transition: all 0.3s ease-in-out !important;
          }

          .ant-menu-item:hover {
            background-color: #f0f9ff !important;
            border-radius: 8px !important;
            transform: translateX(4px) !important;
          }

          .ant-menu-item-selected {
            background-color: #dbeafe !important;
            border-radius: 8px !important;
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-2px) rotate(-5deg);
            }
            75% {
              transform: translateX(2px) rotate(5deg);
            }
          }

          .shake-on-hover:hover {
            animation: shake 0.5s ease-in-out;
          }
        `
      }} />
    </Sider>
  )
}

export default Sidebar