import React, { useState, useEffect } from 'react'
import { Button, Table, Card, Typography, Space, Modal, Descriptions, Tag, Tooltip, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getAllMedicalEvents, MedicalEvent, deleteMedicalEvent, getMedicalEventById } from '../../../apis/medicalEvent'
import CreateEvent from './CreateEvent'
import UpdateEvent from './UpdateEvent'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'

const { Title } = Typography

const MedicalReport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [detailEvent, setDetailEvent] = useState<MedicalEvent | null>(null)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [eventTypeFilter, setEventTypeFilter] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchMedicalEvents()
  }, [])

  useEffect(() => {
    // Sắp xếp lại khi medicalEvents hoặc sortOrder thay đổi
    setMedicalEvents((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
    )
  }, [sortOrder])

  const fetchMedicalEvents = async () => {
    try {
      setLoading(true)
      const response = await getAllMedicalEvents()
      // Sắp xếp theo sortOrder khi fetch
      const sorted = [...response.data.$values].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
      setMedicalEvents(sorted)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: number) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteMedicalEvent(eventId)
          fetchMedicalEvents()
        } catch (error) {
          Modal.error({ title: 'Xóa thất bại', content: 'Đã có lỗi xảy ra khi xóa sự kiện.' })
        }
      }
    })
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
          <Tooltip title='Xem chi tiết'>
            <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>

          <Tooltip title='Chỉnh sửa'>
            <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>

          <Tooltip title='Xóa'>
            <Button type='link' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.medicalEventId)} />
          </Tooltip>
        </Space>
      )
    }
  ]

  const handleViewDetails = async (record: MedicalEvent) => {
    setIsModalVisible(true)
    try {
      const res = await getMedicalEventById(record.medicalEventId)
      setDetailEvent(res.data)
      console.log("trung", res.data)
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện y tế:', error)
      setDetailEvent(null)
    }
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
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Select
                value={sortOrder}
                style={{ width: 200 }}
                onChange={(val) => setSortOrder(val)}
                options={[
                  { value: 'desc', label: 'Thời gian: Gần nhất' },
                  { value: 'asc', label: 'Thời gian: Xa nhất' }
                ]}
              />
              <Select
                allowClear
                placeholder='Lọc theo loại sự kiện'
                style={{ width: 200 }}
                value={eventTypeFilter}
                onChange={val => setEventTypeFilter(val)}
                options={[
                  { value: 'Sốt', label: 'Sốt' },
                  { value: 'Tai nạn', label: 'Tai nạn' },
                  { value: 'Dịch bệnh', label: 'Dịch bệnh' },
                  { value: 'Khác', label: 'Khác' }
                ]}
              />
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={eventTypeFilter ? medicalEvents.filter(ev => ev.type === eventTypeFilter) : medicalEvents}
            rowKey='medicalEventId'
            loading={loading}
          />
        </Card>

        <Modal
          title='Chi tiết sự kiện y tế'
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={null}
        >
          {detailEvent && (
            <div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label='Thời gian' span={2}>
                  {dayjs(detailEvent.date).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label='Loại sự kiện'>{detailEvent.type}</Descriptions.Item>
                <Descriptions.Item label='Học sinh'>{detailEvent.studentName}</Descriptions.Item>
                <Descriptions.Item label='Mô tả' span={2}>
                  {detailEvent.description}
                </Descriptions.Item>
                <Descriptions.Item label='Ghi chú' span={2}>
                  {detailEvent.note}
                </Descriptions.Item>
                <Descriptions.Item label='Y tá phụ trách'>{detailEvent.nurseName}</Descriptions.Item>
                <Descriptions.Item label='Thuốc sử dụng'>
                  {detailEvent.medications && detailEvent.medications.$values && detailEvent.medications.$values.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {detailEvent.medications.$values.map((med: any, idx: number) => (
                        <li key={idx}>
                          {med.name || 'Tên thuốc'}{med.quantityUsed ? ` (SL: ${med.quantityUsed})` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label='Vật tư y tế sử dụng'>
                  {detailEvent.medicalSupplies && detailEvent.medicalSupplies.$values && detailEvent.medicalSupplies.$values.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {detailEvent.medicalSupplies.$values.map((sup: any, idx: number) => (
                        <li key={idx}>
                          {sup.name || 'Tên vật tư'}{sup.quantityUsed ? ` (SL: ${sup.quantityUsed})` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : 'Không có'}
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
