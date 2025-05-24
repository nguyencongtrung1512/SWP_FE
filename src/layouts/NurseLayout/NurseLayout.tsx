import React from 'react'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const { Header, Content } = Layout

const NurseLayout: React.FC = () => {
  return (
    <Layout className='min-h-screen bg-gray-50'>
      <Sidebar />
      <Layout className='ml-[220px]'>
        <Header className='bg-white px-8 py-4 shadow-sm flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-800'>Nurse Dashboard</div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                N
              </div>
              <span className='text-gray-700 font-medium'>Nurse</span>
            </div>
          </div>
        </Header>
        <Content className='m-6 p-6 bg-white rounded-lg shadow-sm'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default NurseLayout
