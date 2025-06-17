import React, { useState, useEffect } from 'react'
import { Button, Table, Card, Typography, Space, Modal, Descriptions, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getAllMedicalEvents, MedicalEvent } from '../../../apis/medicalEvent'
import CreateEvent from './CreateEvent'
import UpdateEvent from './UpdateEvent'

const { Title } = Typography

const MedicalReport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMedicalEvents()
  }, [])

  const fetchMedicalEvents = async () => {
    try {
      setLoading(true)
      const response = await getAllMedicalEvents()
      setMedicalEvents(response.data.$values)
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<MedicalEvent> = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color='red'>{type}</Tag>
    },
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          <Button type='link' onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>
        </Space>
      )
    }
  ]

  const handleViewDetails = (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsModalVisible(true)
  }

  const handleEdit = (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsUpdateModalVisible(true)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        <CreateEvent onSuccess={fetchMedicalEvents} />

        <Card>
          <Title level={5}>Danh sách báo cáo</Title>
          <Table columns={columns} dataSource={medicalEvents} rowKey='medicalEventId' loading={loading} />
        </Card>

        <Modal
          title='Chi tiết sự kiện y tế'
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={null}
        >
          {selectedEvent && (
            <div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label='Thời gian' span={2}>
                  {dayjs(selectedEvent.date).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label='Loại sự kiện'>{selectedEvent.type}</Descriptions.Item>
                <Descriptions.Item label='Học sinh'>{selectedEvent.studentName}</Descriptions.Item>
                <Descriptions.Item label='Mô tả' span={2}>
                  {selectedEvent.description}
                </Descriptions.Item>
                <Descriptions.Item label='Ghi chú' span={2}>
                  {selectedEvent.note}
                </Descriptions.Item>
                <Descriptions.Item label='Y tá phụ trách'>{selectedEvent.nurseName}</Descriptions.Item>
                <Descriptions.Item label='Thuốc sử dụng'>
                  {selectedEvent.medicationNames.$values.join(', ')}
                </Descriptions.Item>
                <Descriptions.Item label='Vật tư y tế sử dụng'>
                  {selectedEvent.medicalSupplyNames.$values.join(', ')}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>

        {selectedEvent && (
          <UpdateEvent
            eventId={selectedEvent.medicalEventId}
            visible={isUpdateModalVisible}
            onCancel={() => {
              setIsUpdateModalVisible(false)
              setSelectedEvent(null)
            }}
            onSuccess={() => {
              setIsUpdateModalVisible(false)
              setSelectedEvent(null)
              fetchMedicalEvents()
            }}
          />
        )}
      </Space>
    </div>
  )
}

export default MedicalReport
