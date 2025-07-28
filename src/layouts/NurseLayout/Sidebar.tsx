import React from 'react'
import { Layout, Menu } from 'antd'
import {
  FileTextOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  FileProtectOutlined,
  MessageOutlined,
  InboxOutlined,
  AppstoreOutlined,
  EditOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import path from '../../constants/path'

const { Sider } = Layout

// Component for animated icons with hover effects
const AnimatedIcon: React.FC<{
  children: React.ReactNode
  animationType?: 'scale' | 'bounce' | 'pulse' | 'rotate'
}> = ({ children, animationType = 'scale' }) => {
  const getAnimationClass = () => {
    switch (animationType) {
      case 'bounce':
        return 'hover:animate-bounce'
      case 'pulse':
        return 'hover:animate-pulse hover:scale-105'
      case 'rotate':
        return 'hover:rotate-12 hover:scale-110'
      default:
        return 'hover:scale-110'
    }
  }

  return (
    <span
      className={`inline-block transition-all duration-300 ease-in-out ${getAnimationClass()} mr-3`}
      style={{
        transformOrigin: 'center',
        color: '#000000'
      }}
    >
      {children}
    </span>
  )
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: path.HEALTH_RECORD_CENSORSHIP,
      icon: (
        <AnimatedIcon animationType='scale'>
          <FileTextOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Hồ sơ sức khỏe'
    },
    {
      key: path.MEDICAL_RESULT,
      icon: (
        <AnimatedIcon animationType='pulse'>
          <ExperimentOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Kết quả y tế'
    },
    {
      key: path.RECEIVE_MEDICINE,
      icon: (
        <AnimatedIcon animationType='bounce'>
          <MedicineBoxOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Nhận thuốc'
    },
    {
      key: path.MEDICAL_REPORT,
      icon: (
        <AnimatedIcon animationType='rotate'>
          <FileProtectOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Báo cáo y tế'
    },
    {
      key: path.PRIVATE_CONSULTATION,
      icon: (
        <AnimatedIcon animationType='scale'>
          <MessageOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Tư vấn'
    },
    {
      key: path.MEDICATION,
      icon: (
        <AnimatedIcon animationType='pulse'>
          <InboxOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Kho Thuốc'
    },
    {
      key: path.MEDICAL_SUPPLIES,
      icon: (
        <AnimatedIcon animationType='bounce'>
          <AppstoreOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Vật tư y tế'
    },
    {
      key: path.NURSE_CATEGORY_MANAGEMENT,
      icon: (
        <AnimatedIcon animationType='rotate'>
          <EditOutlined className='text-lg' />
        </AnimatedIcon>
      ),
      label: 'Quản lí Blog'
    }
  ]

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  return (
    <>
      <Sider width={220} className='fixed h-full left-0 top-0 bg-white border-r border-gray-200'>
        <div className='h-16 flex items-center px-6 border-b border-gray-200'>
          <div className='flex items-center'>
            <span className='text-blue-500 mr-2 transition-transform duration-300 hover:rotate-45 hover:scale-110'>
              <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect x='7' y='16' width='22' height='4' rx='2' fill='#06b6d4' />
                <rect x='16' y='7' width='4' height='22' rx='2' fill='#06b6d4' />
                <rect x='2' y='2' width='32' height='32' rx='8' stroke='#06b6d4' strokeWidth='3' />
              </svg>
            </span>
            <span className='text-2xl font-bold select-none'>
              <span className='text-gray-900'>Edu</span>
              <span style={{ color: '#06b6d4' }}>Care</span>
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
        />
      </Sider>

      {/* Custom CSS for enhanced styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ant-menu-item {
            transition: all 0.3s ease-in-out !important;
            border-radius: 8px !important;
            margin: 4px 8px !important;
          }

          .ant-menu-item:hover {
            background-color: rgba(6, 182, 212, 0.1) !important;
            transform: translateX(4px) !important;
            box-shadow: 0 2px 8px rgba(6, 182, 212, 0.15) !important;
          }

          .ant-menu-item-selected {
            background-color: rgba(6, 182, 212, 0.15) !important;
            border-radius: 8px !important;
            color: #06b6d4 !important;
            font-weight: 600 !important;
          }

          .ant-menu-item-selected .ant-menu-title-content {
            color: #06b6d4 !important;
          }

          .ant-menu-item:hover .ant-menu-title-content {
            color: #06b6d4 !important;
          }

          .ant-menu-item:hover span {
            color: #06b6d4 !important;
          }

          .ant-menu-item-selected span {
            color: #06b6d4 !important;
          }

          .ant-menu-item:hover span,
          .ant-menu-item-selected span {
            filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.4));
            transition: all 0.3s ease-in-out;
          }

          .ant-menu-title-content {
            transition: color 0.3s ease-in-out !important;
          }
        `
      }} />
    </>
  )
}

export default Sidebar