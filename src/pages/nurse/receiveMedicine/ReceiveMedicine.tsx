import React, { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Typography,
  Space,
  Tag,
  Image,
  Descriptions,
  Row,
  Col,
  Statistic
} from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { TextArea } = Input

interface MedicineRequest {
  id: string
  studentName: string
  class: string
  medicineName: string
  medicineType: string
  dosage: string
  frequency: string
  timing: string
  duration: string
  storage: string
  senderName: string
  emergencyPhone: string
  sendDate: string
  status: 'pending' | 'received' | 'in_progress' | 'completed'
  reason: string
  specialNotes?: string
  images?: string[]
  nurseNotes?: string
}

const ReceiveMedicine: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicineRequest | null>(null)
  const [form] = Form.useForm()

  // Mock data - sau này sẽ lấy từ API
  const medicineRequests: MedicineRequest[] = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      class: '5A',
      medicineName: 'Paracetamol',
      medicineType: 'vien',
      dosage: '1 viên',
      frequency: '2 lần/ngày',
      timing: 'Sau bữa ăn',
      duration: '20/03/2024 - 22/03/2024',
      storage: 'normal',
      senderName: 'Nguyễn Văn Bố',
      emergencyPhone: '0123456789',
      sendDate: '20/03/2024',
      status: 'pending',
      reason: 'Hạ sốt',
      specialNotes: 'Uống với nước ấm',
      images: ['https://example.com/medicine1.jpg']
    },
    {
      id: '2',
      studentName: 'Trần Thị Bình',
      class: '3B',
      medicineName: 'Vitamin C',
      medicineType: 'siro',
      dosage: '5ml',
      frequency: '1 lần/ngày',
      timing: 'Buổi sáng',
      duration: '18/03/2024 - 25/03/2024',
      storage: 'normal',
      senderName: 'Trần Văn Mẹ',
      emergencyPhone: '0987654321',
      sendDate: '18/03/2024',
      status: 'in_progress',
      reason: 'Bổ sung vitamin',
      images: ['https://example.com/medicine2.jpg']
    }
  ]

  const columns: ColumnsType<MedicineRequest> = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type='secondary'>Lớp {record.class}</Text>
        </div>
      )
    },
    {
      title: 'Thuốc',
      dataIndex: 'medicineName',
      key: 'medicineName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type='secondary'>{record.medicineType}</Text>
        </div>
      )
    },
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      key: 'senderName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type='secondary'>{record.emergencyPhone}</Text>
        </div>
      )
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'sendDate',
      key: 'sendDate'
    },
    {
      title: 'Thời gian sử dụng',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue'
        let text = 'Chờ xác nhận'
        let icon = <ClockCircleOutlined />

        switch (status) {
          case 'received':
            color = 'cyan'
            text = 'Đã nhận thuốc'
            icon = <MedicineBoxOutlined />
            break
          case 'in_progress':
            color = 'orange'
            text = 'Đang thực hiện'
            icon = <ClockCircleOutlined />
            break
          case 'completed':
            color = 'green'
            text = 'Đã hoàn thành'
            icon = <CheckCircleOutlined />
            break
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='link' onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button type='primary' onClick={() => handleUpdateStatus(record.id, 'received')}>
              Nhận thuốc
            </Button>
          )}
          {record.status === 'received' && (
            <Button type='primary' onClick={() => handleUpdateStatus(record.id, 'in_progress')}>
              Bắt đầu thực hiện
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button type='primary' onClick={() => handleUpdateStatus(record.id, 'completed')}>
              Hoàn thành
            </Button>
          )}
        </Space>
      )
    }
  ]

  const handleViewDetails = (record: MedicineRequest) => {
    setSelectedRequest(record)
    setIsModalVisible(true)
  }

  const handleUpdateStatus = (id: string, newStatus: MedicineRequest['status']) => {
    // Sau này sẽ gọi API để cập nhật trạng thái
    message.success('Cập nhật trạng thái thành công!')
  }

  const handleAddNote = (values: { nurseNotes: string }) => {
    if (selectedRequest) {
      // Sau này sẽ gọi API để thêm ghi chú
      message.success('Thêm ghi chú thành công!')
      setIsModalVisible(false)
    }
  }

  // Thống kê
  const stats = {
    total: medicineRequests.length,
    pending: medicineRequests.filter((r) => r.status === 'pending').length,
    inProgress: medicineRequests.filter((r) => r.status === 'in_progress').length,
    completed: medicineRequests.filter((r) => r.status === 'completed').length
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={4}>Quản lý thuốc</Title>

          {/* Thống kê */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic title='Tổng số đơn' value={stats.total} prefix={<MedicineBoxOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Chờ xác nhận' value={stats.pending} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đang thực hiện' value={stats.inProgress} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đã hoàn thành' value={stats.completed} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
          </Row>

          {/* Bảng danh sách */}
          <Table columns={columns} dataSource={medicineRequests} rowKey='id' pagination={{ pageSize: 10 }} />

          {/* Modal chi tiết */}
          <Modal
            title='Chi tiết đơn thuốc'
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={800}
            footer={null}
          >
            {selectedRequest && (
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label='Học sinh' span={2}>
                    {selectedRequest.studentName} - Lớp {selectedRequest.class}
                  </Descriptions.Item>
                  <Descriptions.Item label='Tên thuốc'>{selectedRequest.medicineName}</Descriptions.Item>
                  <Descriptions.Item label='Dạng thuốc'>{selectedRequest.medicineType}</Descriptions.Item>
                  <Descriptions.Item label='Liều lượng'>{selectedRequest.dosage}</Descriptions.Item>
                  <Descriptions.Item label='Số lần uống'>{selectedRequest.frequency}</Descriptions.Item>
                  <Descriptions.Item label='Thời gian uống'>{selectedRequest.timing}</Descriptions.Item>
                  <Descriptions.Item label='Thời gian sử dụng'>{selectedRequest.duration}</Descriptions.Item>
                  <Descriptions.Item label='Cách bảo quản'>
                    {selectedRequest.storage === 'normal' ? 'Nhiệt độ thường' : 'Bảo quản lạnh'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Người gửi' span={2}>
                    {selectedRequest.senderName} - {selectedRequest.emergencyPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label='Lý do dùng thuốc' span={2}>
                    {selectedRequest.reason}
                  </Descriptions.Item>
                  {selectedRequest.specialNotes && (
                    <Descriptions.Item label='Ghi chú đặc biệt' span={2}>
                      {selectedRequest.specialNotes}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {selectedRequest.images && selectedRequest.images.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Title level={5}>Hình ảnh thuốc</Title>
                    <Image.PreviewGroup>
                      <Row gutter={[8, 8]}>
                        {selectedRequest.images.map((image, index) => (
                          <Col span={8} key={index}>
                            <Image src={image} alt={`Thuốc ${index + 1}`} />
                          </Col>
                        ))}
                      </Row>
                    </Image.PreviewGroup>
                  </div>
                )}

                <Form form={form} layout='vertical' onFinish={handleAddNote} style={{ marginTop: 16 }}>
                  <Form.Item name='nurseNotes' label='Ghi chú của y tá' initialValue={selectedRequest.nurseNotes}>
                    <TextArea rows={4} placeholder='Nhập ghi chú của y tá...' />
                  </Form.Item>
                  <Form.Item>
                    <Button type='primary' htmlType='submit'>
                      Lưu ghi chú
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Modal>
        </Space>
      </Card>
    </div>
  )
}

export default ReceiveMedicine
