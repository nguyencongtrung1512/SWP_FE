import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const { Header, Content } = Layout

const ParentLayout: React.FC = () => {
  return (
    <Layout className='min-h-screen bg-gray-50'>
      <Sidebar />
      <Layout className='ml-[220px]'>
        <Header className='bg-white px-8 py-4 shadow-sm flex items-center justify-between'>
          <div className='text-2xl font-bold text-gray-800'>Parent Dashboard</div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                P
              </div>
              <span className='text-gray-700 font-medium'>Parent</span>
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

export default ParentLayout
