import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Table,
  Typography,
  Space,
  Statistic,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { RangePicker } = DatePicker

interface MedicalEvent {
  id: string
  date: string
  type: 'fever' | 'accident' | 'allergy' | 'medicine'
  studentName: string
  class: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

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
}

const MedicalPlan: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MedicalPlan | null>(null)
  const [medicalPlans, setMedicalPlans] = useState<MedicalPlan[]>([
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
  ])

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
          <Button type='link' onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'draft' && (
            <Button
              type='link'
              onClick={() => {
                setSelectedPlan(record)
                setIsConfirmModalVisible(true)
              }}
              style={{ color: 'blue' }}
            >
              Gửi duyệt
            </Button>
          )}
          {record.status === 'rejected' && (
            <Button type='link' onClick={() => handleResubmit(record)} style={{ color: 'blue' }}>
              Gửi lại
            </Button>
          )}
        </Space>
      )
    }
  ]

  const handleViewDetails = (plan: MedicalPlan) => {
    setSelectedPlan(plan)
    setIsModalVisible(true)
  }

  const handleCreatePlan = () => {
    form.validateFields().then((values) => {
      const newPlan: MedicalPlan = {
        id: Date.now().toString(),
        title: values.title,
        description: values.description,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        type: values.type,
        priority: values.priority,
        status: 'draft',
        createdBy: 'Y tá Nguyễn Thị H',
        createdAt: new Date().toLocaleString(),
        notes: values.notes
      }

      // Thêm kế hoạch mới vào danh sách
      setMedicalPlans([...medicalPlans, newPlan])
      setSelectedPlan(newPlan)
      setIsConfirmModalVisible(true)
      form.resetFields()
    })
  }

  const handleSubmitToAdmin = () => {
    if (selectedPlan) {
      // Cập nhật trạng thái kế hoạch thành pending
      const updatedPlans = medicalPlans.map((p) => {
        if (p.id === selectedPlan.id) {
          return {
            ...p,
            status: 'pending'
          }
        }
        return p
      })
      setMedicalPlans(updatedPlans)
      setIsConfirmModalVisible(false)
      message.success('Đã gửi kế hoạch cho admin kiểm duyệt!')
    }
  }

  const handleResubmit = (plan: MedicalPlan) => {
    Modal.confirm({
      title: 'Gửi lại kế hoạch',
      content: 'Bạn có chắc chắn muốn gửi lại kế hoạch này cho admin kiểm duyệt?',
      onOk: () => {
        // Cập nhật trạng thái kế hoạch
        const updatedPlans = medicalPlans.map((p) => {
          if (p.id === plan.id) {
            return {
              ...p,
              status: 'pending',
              rejectionReason: undefined
            }
          }
          return p
        })
        setMedicalPlans(updatedPlans)
        message.success('Đã gửi lại kế hoạch cho admin kiểm duyệt!')
      }
    })
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Row justify='space-between' align='middle'>
            <Col>
              <Typography.Title level={4}>Kế hoạch y tế</Typography.Title>
            </Col>
            <Col>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => form.submit()}>
                Tạo kế hoạch mới
              </Button>
            </Col>
          </Row>

          <Form form={form} layout='vertical' onFinish={handleCreatePlan} style={{ marginTop: '24px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='title'
                  label='Tiêu đề kế hoạch'
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                  <Input placeholder='Nhập tiêu đề kế hoạch' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='type'
                  label='Loại kế hoạch'
                  rules={[{ required: true, message: 'Vui lòng chọn loại kế hoạch!' }]}
                >
                  <Select
                    options={[
                      { value: 'equipment', label: 'Trang thiết bị' },
                      { value: 'training', label: 'Tập huấn' },
                      { value: 'medicine', label: 'Thuốc men' },
                      { value: 'other', label: 'Khác' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='dateRange'
                  label='Thời gian thực hiện'
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='priority'
                  label='Độ ưu tiên'
                  rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                >
                  <Select
                    options={[
                      { value: 'high', label: 'Cao' },
                      { value: 'medium', label: 'Trung bình' },
                      { value: 'low', label: 'Thấp' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name='description'
              label='Mô tả chi tiết'
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder='Nhập mô tả chi tiết về kế hoạch...' />
            </Form.Item>

            <Form.Item name='notes' label='Ghi chú thêm'>
              <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' />
            </Form.Item>
          </Form>
        </Card>

        <Card title='Danh sách kế hoạch'>
          <Table columns={columns} dataSource={medicalPlans} rowKey='id' pagination={{ pageSize: 10 }} />
        </Card>

        <Modal
          title='Xác nhận gửi kế hoạch'
          open={isConfirmModalVisible}
          onCancel={() => setIsConfirmModalVisible(false)}
          onOk={handleSubmitToAdmin}
          okText='Gửi duyệt'
          cancelText='Hủy'
        >
          <p>Bạn có chắc chắn muốn gửi kế hoạch này cho admin kiểm duyệt?</p>
          {selectedPlan && (
            <div style={{ marginTop: '16px' }}>
              <p>
                <strong>Tiêu đề:</strong> {selectedPlan.title}
              </p>
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
                {selectedPlan.priority === 'high' ? 'Cao' : selectedPlan.priority === 'medium' ? 'Trung bình' : 'Thấp'}
              </p>
            </div>
          )}
        </Modal>

        <Modal
          title='Chi tiết kế hoạch'
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={null}
        >
          {selectedPlan && (
            <div>
              <Typography.Title level={5}>{selectedPlan.title}</Typography.Title>
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
      </Space>
    </div>
  )
}

export default MedicalPlan
