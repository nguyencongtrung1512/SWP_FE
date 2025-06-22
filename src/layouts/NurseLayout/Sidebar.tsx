import React from 'react'
import { Layout, Menu } from 'antd'
import { FileSearchOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import path from '../../constants/path'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    // {
    //   key: path.DASHBOARD_NURSE,
    //   icon: <FileSearchOutlined className='text-lg' />,
    //   label: 'DashBoard'
    // },
    {
      key: path.HEALTH_RECORD_CENSORSHIP,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Kiểm duyệt hồ sơ sức khỏe'
    },
    {
      key: path.SCHEDULE_VACCINATION,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Lập lịch tiêm'
    },
    {
      key: path.RESULTS_AFTER_VACCINATION,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Kết quả tiêm'
    },
    {
      key: path.RECEIVE_MEDICINE,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Nhận thuốc'
    },
    {
      key: path.MEDICAL_REPORT,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Báo cáo y tế'
    },
    {
      key: path.PRIVATE_CONSULTATION,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Tư vấn'
    },
    {
      key: path.MEDICATION,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Kho Thuốc'
    },
    {
      key: path.MEDICAL_SUPPLIES,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Vật tư y tế'
    },
    {
      key: path.MEDICAL_PLAN,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Kế hoạch y tế'
    },
    {
      key: path.NURSE_CATEGORY_MANAGEMENT,
      icon: <FileSearchOutlined className='text-lg' />,
      label: 'Quản lí Blog'
    }
  ]

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  return (
    <Sider width={220} className='fixed h-full left-0 top-0 bg-white border-r border-gray-200'>
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <div className='flex items-center'>
          <span className='text-blue-500 mr-2'>
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
      />
    </Sider>
  )
}

export default Sidebar
