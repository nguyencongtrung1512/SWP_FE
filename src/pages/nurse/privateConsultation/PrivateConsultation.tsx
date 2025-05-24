import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Typography,
  Space,
  Tag,
  Radio,
  message,
  Row,
  Col,
  Modal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography

interface Student {
  id: string
  name: string
  class: string
  grade: string
}

interface ConsultationRequest {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  reason: string
  suggestedTime: string
  consultationMethod: 'in_person' | 'phone' | 'online'
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  notes?: string
  createdBy: string
  createdAt: string
  parentResponse?: string
  parentResponseTime?: string
}

const PrivateConsultation: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)

  // Mock data - sau này sẽ lấy từ API
  const students: Student[] = [
    { id: '1', name: 'Nguyễn Văn A', class: '5A', grade: '5' },
    { id: '2', name: 'Trần Thị B', class: '3B', grade: '3' },
    { id: '3', name: 'Lê Văn C', class: '2A', grade: '2' }
  ]

  const consultationRequests: ConsultationRequest[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Nguyễn Văn A',
      studentClass: '5A',
      reason: 'Thị lực yếu, cần kiểm tra mắt',
      suggestedTime: '2024-03-25 14:00',
      consultationMethod: 'in_person',
      status: 'pending',
      createdBy: 'Y tá Nguyễn Thị H',
      createdAt: '2024-03-20 10:00'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Trần Thị B',
      studentClass: '3B',
      reason: 'Chỉ số BMI bất thường',
      suggestedTime: '2024-03-26 15:30',
      consultationMethod: 'online',
      status: 'accepted',
      createdBy: 'Y tá Nguyễn Thị H',
      createdAt: '2024-03-19 14:00',
      parentResponse: 'Đồng ý tham gia tư vấn',
      parentResponseTime: '2024-03-20 09:00'
    }
  ]

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      render: (record: ConsultationRequest) => (
        <div>
          {record.studentName}
          <br />
          <small>Lớp {record.studentClass}</small>
        </div>
      )
    },
    {
      title: 'Lý do tư vấn',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Thời gian đề xuất',
      dataIndex: 'suggestedTime',
      key: 'suggestedTime'
    },
    {
      title: 'Phương thức',
      dataIndex: 'consultationMethod',
      key: 'consultationMethod',
      render: (method: string) => {
        const methods = {
          in_person: { color: 'blue', text: 'Gặp trực tiếp' },
          phone: { color: 'green', text: 'Qua điện thoại' },
          online: { color: 'purple', text: 'Online' }
        }
        const { color, text } = methods[method as keyof typeof methods]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          pending: { color: 'blue', text: 'Chờ phản hồi' },
          accepted: { color: 'green', text: 'Đã chấp nhận' },
          rejected: { color: 'red', text: 'Từ chối' },
          completed: { color: 'gray', text: 'Đã hoàn thành' }
        }
        const { color, text } = statuses[status as keyof typeof statuses]
        return <Tag color={color}>{text}</Tag>
      }
    }
  ]

  const handleCreateRequest = () => {
    form.validateFields().then((values) => {
      const newRequest: ConsultationRequest = {
        id: Date.now().toString(),
        studentId: values.studentId,
        studentName: students.find((s) => s.id === values.studentId)?.name || '',
        studentClass: students.find((s) => s.id === values.studentId)?.class || '',
        reason: values.reason,
        suggestedTime: values.suggestedTime.format('YYYY-MM-DD HH:mm'),
        consultationMethod: values.consultationMethod,
        status: 'pending',
        notes: values.notes,
        createdBy: 'Y tá Nguyễn Thị H',
        createdAt: new Date().toLocaleString()
      }

      console.log('New consultation request:', newRequest)
      message.success('Gửi lời mời tư vấn thành công!')
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={4}>Tư vấn riêng</Title>
            </Col>
            <Col>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Gửi lời mời tư vấn
              </Button>
            </Col>
          </Row>
        </Card>

        <Card title='Danh sách lời mời tư vấn'>
          <Table columns={columns} dataSource={consultationRequests} rowKey='id' pagination={{ pageSize: 10 }} />
        </Card>

        <Modal
          title='Tạo lời mời tư vấn'
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          footer={[
            <Button
              key='cancel'
              onClick={() => {
                setIsModalVisible(false)
                form.resetFields()
              }}
            >
              Hủy
            </Button>,
            <Button key='submit' type='primary' onClick={() => form.submit()}>
              Gửi lời mời
            </Button>
          ]}
          width={800}
        >
          <Form form={form} layout='vertical' onFinish={handleCreateRequest}>
            <Form.Item
              name='studentId'
              label='Học sinh'
              rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
            >
              <Select
                placeholder='Chọn học sinh'
                options={students.map((student) => ({
                  value: student.id,
                  label: `${student.name} - Lớp ${student.class}`
                }))}
              />
            </Form.Item>

            <Form.Item
              name='reason'
              label='Lý do mời tư vấn'
              rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
            >
              <TextArea rows={4} placeholder='Nhập lý do mời tư vấn...' />
            </Form.Item>

            <Form.Item
              name='suggestedTime'
              label='Thời gian gợi ý'
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime format='DD/MM/YYYY HH:mm' style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='consultationMethod'
              label='Phương thức tư vấn'
              rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
            >
              <Radio.Group>
                <Radio value='in_person'>Gặp trực tiếp</Radio>
                <Radio value='phone'>Qua điện thoại</Radio>
                <Radio value='online'>Online (Zoom/Meet)</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name='notes' label='Ghi chú thêm'>
              <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default PrivateConsultation
