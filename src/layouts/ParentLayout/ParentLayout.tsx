import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'

const { Content } = Layout

const ParentLayout: React.FC = () => {
  return (
    <Layout className='min-h-screen bg-gray-50'>
      <Header />
      <Layout>
        <Content className='m-6 p-6 bg-white rounded-lg shadow-sm'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default ParentLayout
