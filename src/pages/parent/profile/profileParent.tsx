import React from 'react'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EditOutlined,
  UserAddOutlined,
  TeamOutlined
} from '@ant-design/icons'

// Dữ liệu mẫu
const parent = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '+84 123 456 789',
  address: 'Hà Nội, Việt Nam',
  joined: 'Tháng 1, 2024'
}

const children = [
  {
    name: 'Nguyễn Văn B',
    age: 8,
    studentId: 'HS2024001'
  },
  {
    name: 'Nguyễn Thị C',
    age: 6,
    studentId: 'HS2024002'
  }
]

const ProfileParent = () => {
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
          <div className='text-xl font-bold mt-2'>{parent.name}</div>
          <div className='text-gray-500 mb-4'>Phụ huynh</div>
          <div className='w-full space-y-3 text-gray-700'>
            <div className='flex items-center gap-2'>
              <MailOutlined /> {parent.email}
            </div>
            <div className='flex items-center gap-2'>
              <PhoneOutlined /> {parent.phone}
            </div>
            <div className='flex items-center gap-2'>
              <EnvironmentOutlined /> {parent.address}
            </div>
            <div className='flex items-center gap-2'>
              <CalendarOutlined /> Tham gia: {parent.joined}
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
            <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50'>
              <EditOutlined /> Chỉnh sửa hồ sơ
            </button>
          </div>

          {/* Danh sách con */}
          <div className='bg-white rounded-2xl shadow p-6'>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-lg font-semibold'>Danh sách con</div>
              <button className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium'>
                <UserAddOutlined /> Thêm con
              </button>
            </div>
            <div className='flex gap-4'>
              {children.map((child, idx) => (
                <div key={idx} className='flex items-center gap-4 bg-gray-50 rounded-xl p-4 flex-1 min-w-[220px]'>
                  <div className='w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg'>
                    {child.name.split(' ').slice(-2).join(' ')}
                  </div>
                  <div>
                    <div className='font-semibold'>{child.name}</div>
                    <div className='text-gray-500 text-sm'>{child.age} tuổi</div>
                    <div className='flex items-center gap-1 text-gray-400 text-xs mt-1'>
                      <TeamOutlined /> {child.studentId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileParent
