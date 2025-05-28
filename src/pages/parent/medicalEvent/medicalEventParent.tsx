import React, { useState } from 'react'
import { Card, Table, Tag, Typography, Button, Modal, Descriptions, Timeline, Row, Col, Statistic } from 'antd'
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface MedicalEvent {
  id: string
  eventTime: string
  eventType: 'fever' | 'accident' | 'epidemic' | 'other'
  description: string
  action: 'rest' | 'call_parent' | 'hospital'
  notes?: string
  status: 'pending' | 'in_progress' | 'completed'
  createdBy: string
  createdAt: string
  attachments?: string[]
}

const mockData: MedicalEvent[] = [
  {
    id: '1',
    eventTime: '2024-03-20 10:30',
    eventType: 'fever',
    description: 'Học sinh sốt cao 39 độ',
    action: 'call_parent',
    notes: 'Đã cho uống hạ sốt và gọi phụ huynh',
    status: 'completed',
    createdBy: 'Y tá Nguyễn Thị H',
    createdAt: '2024-03-20 10:35'
  },
  {
    id: '2',
    eventTime: '2024-03-19 14:15',
    eventType: 'accident',
    description: 'Học sinh té ngã trong giờ ra chơi',
    action: 'hospital',
    notes: 'Đã sơ cứu và chuyển bệnh viện',
    status: 'in_progress',
    createdBy: 'Y tá Nguyễn Thị H',
    createdAt: '2024-03-19 14:20'
  },
  {
    id: '3',
    eventTime: '2024-02-15 09:00',
    eventType: 'fever',
    description: 'Học sinh sốt nhẹ 37.5 độ',
    action: 'rest',
    notes: 'Đã cho nghỉ ngơi và theo dõi',
    status: 'completed',
    createdBy: 'Y tá Trần Văn A',
    createdAt: '2024-02-15 09:05'
  }
]

const MedicalEventParent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleViewDetails = (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsModalVisible(true)
  }

  const columns: ColumnsType<MedicalEvent> = [
    {
      title: 'Thời gian',
      dataIndex: 'eventTime',
      key: 'eventTime'
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'eventType',
      key: 'eventType',
      render: (type: string) => {
        const types = {
          fever: { color: 'red', text: 'Sốt' },
          accident: { color: 'orange', text: 'Tai nạn' },
          epidemic: { color: 'purple', text: 'Dịch bệnh' },
          other: { color: 'blue', text: 'Khác' }
        }
        const { color, text } = types[type as keyof typeof types]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Xử lý cần thiết',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actions = {
          rest: { color: 'green', text: 'Cho nghỉ' },
          call_parent: { color: 'blue', text: 'Gọi phụ huynh' },
          hospital: { color: 'red', text: 'Chuyển viện' }
        }
        const { color, text } = actions[action as keyof typeof actions]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          pending: { color: 'blue', text: 'Chờ xử lý' },
          in_progress: { color: 'orange', text: 'Đang xử lý' },
          completed: { color: 'green', text: 'Đã hoàn thành' }
        }
        const { color, text } = statuses[status as keyof typeof statuses]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Yêu cầu xử lý',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          pending: { color: 'blue', text: 'Chờ xử lý' },
          in_progress: { color: 'orange', text: 'Chở về nhà' },
          completed: { color: 'green', text: 'Đã hoàn thành' }
        }
        const { color, text } = statuses[status as keyof typeof statuses]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      )
    }
  ]

  const currentEvents = mockData.filter((event) => event.status !== 'completed')
  const historyEvents = mockData.filter((event) => event.status === 'completed')

  return (
    <div className='p-6 space-y-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <AlertOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Báo cáo y tế hiện tại</h1>
        </div>

        <Row gutter={[16, 16]} className='mb-6'>
          <Col span={8}>
            <Card className='bg-red-50'>
              <Statistic
                title='Sốt'
                value={currentEvents.filter((e) => e.eventType === 'fever').length}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-orange-50'>
              <Statistic
                title='Tai nạn'
                value={currentEvents.filter((e) => e.eventType === 'accident').length}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-blue-100'>
              <Statistic
                title='Đang xử lý'
                value={currentEvents.filter((e) => e.status === 'in_progress').length}
                valueStyle={{ color: '#0066cc' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card className='shadow-md'>
          <Table columns={columns} dataSource={currentEvents} rowKey='id' pagination={false} />
        </Card>
      </div>

      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch sử báo cáo y tế</h1>
        </div>

        <Timeline
          items={historyEvents.map((event) => ({
            color: event.eventType === 'fever' ? 'red' : event.eventType === 'accident' ? 'orange' : 'blue',
            children: (
              <Card className='mb-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <Text strong className='text-lg'>
                      {event.eventType === 'fever'
                        ? 'Sốt'
                        : event.eventType === 'accident'
                          ? 'Tai nạn'
                          : event.eventType === 'epidemic'
                            ? 'Dịch bệnh'
                            : 'Khác'}
                    </Text>
                    <div className='text-gray-600 mt-2'>{event.eventTime}</div>
                    <div className='mt-2'>{event.description}</div>
                    {event.notes && <div className='mt-2 text-gray-600'>Ghi chú: {event.notes}</div>}
                  </div>
                  <Tag color='green' icon={<CheckCircleOutlined />}>
                    Đã hoàn thành
                  </Tag>
                </div>
              </Card>
            )
          }))}
        />
      </div>

      <Modal
        title='Chi tiết báo cáo y tế'
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedEvent && (
          <div className='space-y-6'>
            <Descriptions bordered>
              <Descriptions.Item label='Thời gian' span={3}>
                {selectedEvent.eventTime}
              </Descriptions.Item>
              <Descriptions.Item label='Loại sự kiện' span={3}>
                {selectedEvent.eventType === 'fever'
                  ? 'Sốt'
                  : selectedEvent.eventType === 'accident'
                    ? 'Tai nạn'
                    : selectedEvent.eventType === 'epidemic'
                      ? 'Dịch bệnh'
                      : 'Khác'}
              </Descriptions.Item>
              <Descriptions.Item label='Mô tả' span={3}>
                {selectedEvent.description}
              </Descriptions.Item>
              <Descriptions.Item label='Xử lý' span={3}>
                {selectedEvent.action === 'rest'
                  ? 'Cho nghỉ'
                  : selectedEvent.action === 'call_parent'
                    ? 'Gọi phụ huynh'
                    : 'Chuyển viện'}
              </Descriptions.Item>
              {selectedEvent.notes && (
                <Descriptions.Item label='Ghi chú' span={3}>
                  {selectedEvent.notes}
                </Descriptions.Item>
              )}
              <Descriptions.Item label='Người tạo' span={3}>
                {selectedEvent.createdBy}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MedicalEventParent
