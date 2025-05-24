import React, { useState } from 'react'
import { Card, Table, Typography, Space, Tag, Button, Modal, Form, Input, Row, Col, message, Statistic } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography

interface MedicalPlan {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: 'equipment' | 'training' | 'medicine' | 'other'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
  notes?: string
  rejectionReason?: string
}

const CensorList: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<MedicalPlan | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock data - sau này sẽ lấy từ API
  const medicalPlans: MedicalPlan[] = [
    {
      id: '1',
      title: 'Bổ sung thuốc hạ sốt',
      description: 'Cần bổ sung thêm thuốc hạ sốt do số lượng học sinh bị sốt tăng cao',
      startDate: '2024-03-25',
      endDate: '2024-03-30',
      type: 'medicine',
      priority: 'high',
      status: 'pending',
      createdBy: 'Y tá Nguyễn Thị H',
      createdAt: '2024-03-20 10:00'
    },
    {
      id: '2',
      title: 'Tập huấn phòng dịch',
      description: 'Tổ chức buổi tập huấn về phòng chống dịch bệnh cho giáo viên',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      type: 'training',
      priority: 'medium',
      status: 'approved',
      createdBy: 'Y tá Nguyễn Thị H',
      createdAt: '2024-03-19 14:00',
      approvedBy: 'Admin',
      approvedAt: '2024-03-20 09:00'
    }
  ]

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Loại kế hoạch',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const types = {
          equipment: { color: 'blue', text: 'Trang thiết bị' },
          training: { color: 'green', text: 'Tập huấn' },
          medicine: { color: 'purple', text: 'Thuốc men' },
          other: { color: 'gray', text: 'Khác' }
        }
        const { color, text } = types[type as keyof typeof types]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (record: MedicalPlan) => (
        <div>
          <div>Từ: {record.startDate}</div>
          <div>Đến: {record.endDate}</div>
        </div>
      )
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorities = {
          high: { color: 'red', text: 'Cao' },
          medium: { color: 'orange', text: 'Trung bình' },
          low: { color: 'green', text: 'Thấp' }
        }
        const { color, text } = priorities[priority as keyof typeof priorities]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          pending: { color: 'blue', text: 'Chờ duyệt' },
          approved: { color: 'green', text: 'Đã duyệt' },
          rejected: { color: 'red', text: 'Từ chối' }
        }
        const { color, text } = statuses[status as keyof typeof statuses]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: MedicalPlan) => (
        <Space>
          <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type='link'
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record)}
                style={{ color: 'green' }}
              >
                Duyệt
              </Button>
              <Button
                type='link'
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
                style={{ color: 'red' }}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      )
    }
  ]

  const handleViewDetails = (plan: MedicalPlan) => {
    setSelectedPlan(plan)
    setIsModalVisible(true)
  }

  const handleApprove = (plan: MedicalPlan) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: 'Bạn có chắc chắn muốn duyệt kế hoạch này?',
      onOk: () => {
        // Gọi API duyệt kế hoạch
        message.success('Đã duyệt kế hoạch thành công!')
      }
    })
  }

  const handleReject = (plan: MedicalPlan) => {
    setSelectedPlan(plan)
    setIsRejectModalVisible(true)
  }

  const handleRejectSubmit = () => {
    form.validateFields().then((values) => {
      // Gọi API từ chối kế hoạch với lý do
      console.log('Rejection reason:', values.reason)
      message.success('Đã từ chối kế hoạch!')
      setIsRejectModalVisible(false)
      form.resetFields()
    })
  }

  const stats = {
    total: medicalPlans.length,
    pending: medicalPlans.filter((p) => p.status === 'pending').length,
    approved: medicalPlans.filter((p) => p.status === 'approved').length,
    rejected: medicalPlans.filter((p) => p.status === 'rejected').length
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Title level={4}>Kiểm duyệt kế hoạch y tế</Title>
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col span={6}>
              <Card>
                <Statistic title='Tổng số kế hoạch' value={stats.total} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Chờ duyệt' value={stats.pending} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đã duyệt' value={stats.approved} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Từ chối' value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title='Danh sách kế hoạch'>
          <Table columns={columns} dataSource={medicalPlans} rowKey='id' pagination={{ pageSize: 10 }} />
        </Card>

        <Modal
          title='Chi tiết kế hoạch'
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={null}
        >
          {selectedPlan && (
            <div>
              <Title level={5}>{selectedPlan.title}</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <p>
                    <strong>Loại kế hoạch:</strong>{' '}
                    {selectedPlan.type === 'equipment'
                      ? 'Trang thiết bị'
                      : selectedPlan.type === 'training'
                        ? 'Tập huấn'
                        : selectedPlan.type === 'medicine'
                          ? 'Thuốc men'
                          : 'Khác'}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {selectedPlan.startDate} - {selectedPlan.endDate}
                  </p>
                  <p>
                    <strong>Độ ưu tiên:</strong>{' '}
                    {selectedPlan.priority === 'high'
                      ? 'Cao'
                      : selectedPlan.priority === 'medium'
                        ? 'Trung bình'
                        : 'Thấp'}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    {selectedPlan.status === 'pending'
                      ? 'Chờ duyệt'
                      : selectedPlan.status === 'approved'
                        ? 'Đã duyệt'
                        : 'Từ chối'}
                  </p>
                  <p>
                    <strong>Người tạo:</strong> {selectedPlan.createdBy}
                  </p>
                  <p>
                    <strong>Thời gian tạo:</strong> {selectedPlan.createdAt}
                  </p>
                  {selectedPlan.approvedBy && (
                    <>
                      <p>
                        <strong>Người duyệt:</strong> {selectedPlan.approvedBy}
                      </p>
                      <p>
                        <strong>Thời gian duyệt:</strong> {selectedPlan.approvedAt}
                      </p>
                    </>
                  )}
                  {selectedPlan.rejectionReason && (
                    <p>
                      <strong>Lý do từ chối:</strong> {selectedPlan.rejectionReason}
                    </p>
                  )}
                </Col>
              </Row>
              <div style={{ marginTop: '16px' }}>
                <strong>Mô tả chi tiết:</strong>
                <p>{selectedPlan.description}</p>
              </div>
              {selectedPlan.notes && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Ghi chú:</strong>
                  <p>{selectedPlan.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal
          title='Từ chối kế hoạch'
          open={isRejectModalVisible}
          onCancel={() => {
            setIsRejectModalVisible(false)
            form.resetFields()
          }}
          onOk={handleRejectSubmit}
        >
          <Form form={form} layout='vertical'>
            <Form.Item
              name='reason'
              label='Lý do từ chối'
              rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
            >
              <TextArea rows={4} placeholder='Nhập lý do từ chối kế hoạch...' />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default CensorList
