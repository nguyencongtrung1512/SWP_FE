import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Descriptions, Statistic } from 'antd'
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, HistoryOutlined, CalendarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import HistoryVaccination from './HistoryVaccination'

interface ScheduleData {
  key: string
  eventType: string
  grade: string
  date: string
  totalStudents: number
  confirmed: number
  rejected: number
  pending: number
  status: 'active' | 'completed' | 'cancelled'
  document?: string
  content?: string
  confirmedStudents?: {
    name: string
    parentName: string
    phone: string
    confirmDate: string
  }[]
  rejectedStudents?: {
    name: string
    parentName: string
    phone: string
    reason: string
  }[]
  pendingStudents?: {
    name: string
    parentName: string
    phone: string
  }[]
}

const mockData: ScheduleData[] = [
  {
    key: '1',
    eventType: 'Tiêm chủng',
    grade: 'Lớp 1',
    date: '15/04/2024',
    totalStudents: 30,
    confirmed: 25,
    rejected: 2,
    pending: 3,
    status: 'active',
    document: 'thong-tin-tiem-chung.pdf',
    content: 'Thông báo về đợt tiêm chủng định kỳ cho học sinh lớp 1',
    confirmedStudents: [
      {
        name: 'Nguyễn Văn A',
        parentName: 'Nguyễn Văn B',
        phone: '0123456789',
        confirmDate: '10/04/2024'
      }
    ],
    rejectedStudents: [
      {
        name: 'Trần Thị C',
        parentName: 'Trần Văn D',
        phone: '0987654321',
        reason: 'Học sinh đang bị ốm'
      }
    ],
    pendingStudents: [
      {
        name: 'Lê Văn E',
        parentName: 'Lê Thị F',
        phone: '0123456788'
      }
    ]
  }
]

const VaccinationSchedule: React.FC = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (record: ScheduleData) => {
    setSelectedSchedule(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  const columns: ColumnsType<ScheduleData> = [
    {
      title: 'Loại sự kiện',
      dataIndex: 'eventType',
      key: 'eventType'
    },
    {
      title: 'Khối/Lớp',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'blue', text: 'Đang diễn ra' },
          completed: { color: 'green', text: 'Hoàn thành' },
          cancelled: { color: 'red', text: 'Đã hủy' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: ScheduleData) => (
        <Space>
          {record.status === 'active' && (
            <Space>
              <Button type='primary' className='bg-green-500 hover:bg-green-600'>
                Đồng ý
              </Button>
              <Button type='primary' danger>
                Từ chối
              </Button>
            </Space>
          )}
          <Button className='ml-10' type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className='p-6 space-y-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <CalendarOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch tiêm chủng / khám sức khỏe</h1>
        </div>

        <Card className='shadow-md'>
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} kế hoạch`
            }}
          />
        </Card>
      </div>

      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch sử tiêm của con</h1>
        </div>
        <HistoryVaccination />
      </div>

      <Modal
        title='Chi tiết kế hoạch'
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <Button key='close' onClick={handleCloseModal}>
            Đóng
          </Button>
        ]}
      >
        {selectedSchedule && (
          <div className='space-y-6'>
            <Descriptions title='Thông tin cơ bản' bordered>
              <Descriptions.Item label='Loại sự kiện' span={3}>
                {selectedSchedule.eventType}
              </Descriptions.Item>
              <Descriptions.Item label='Khối/Lớp' span={3}>
                {selectedSchedule.grade}
              </Descriptions.Item>
              <Descriptions.Item label='Ngày dự kiến' span={3}>
                {selectedSchedule.date}
              </Descriptions.Item>
              <Descriptions.Item label='Tài liệu đính kèm' span={3}>
                <a href='#' className='text-blue-500 hover:text-blue-700'>
                  {selectedSchedule.document}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label='Nội dung thông báo' span={3}>
                {selectedSchedule.content}
              </Descriptions.Item>
            </Descriptions>

            <div className='grid grid-cols-3 gap-4'>
              <Card className='bg-green-50'>
                <Statistic
                  title='Đã xác nhận'
                  value={selectedSchedule.confirmed}
                  suffix={`/ ${selectedSchedule.totalStudents}`}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
              <Card className='bg-red-50'>
                <Statistic
                  title='Từ chối'
                  value={selectedSchedule.rejected}
                  suffix={`/ ${selectedSchedule.totalStudents}`}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Card>
              <Card className='bg-yellow-50'>
                <Statistic
                  title='Chưa phản hồi'
                  value={selectedSchedule.pending}
                  suffix={`/ ${selectedSchedule.totalStudents}`}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </div>

            {selectedSchedule.status === 'active' && (
              <div className='flex justify-center space-x-4 mt-6'>
                <Button type='primary' size='large' className='bg-green-500 hover:bg-green-600 px-8'>
                  Đồng ý
                </Button>
                <Button type='primary' danger size='large' className='px-8'>
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default VaccinationSchedule
