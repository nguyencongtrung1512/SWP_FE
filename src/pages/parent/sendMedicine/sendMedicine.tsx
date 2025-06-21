import React from 'react'
import { HistoryOutlined } from '@ant-design/icons'
import CreateSendMedicine from './CreateSendMedicine'
import HistorySendMedicine from './HistorySendMedicine'

const MedicineSubmissions: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12'>
      <div className='w-full mx-auto px-20'>
        {/* Phần lịch sử đơn thuốc */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
          <div className='flex items-center mb-6'>
            <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
            <h1 className='text-2xl font-bold text-gray-800'>Lịch sử gửi thuốc</h1>
          </div>
          <HistorySendMedicine />
        </div>
        <CreateSendMedicine />
      </div>
    </div>
  )
}

export default MedicineSubmissions
