import React, { useState } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Card,
  Typography,
  Space,
  Upload,
  message,
  Modal,
  Descriptions,
  Image,
  Row,
  Col,
  Tag
} from 'antd'
import { UploadOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

interface Student {
  id: string
  name: string
  class: string
  grade: string
}

interface MedicalEvent {
  id: string
  eventTime: string
  eventType: 'fever' | 'accident' | 'epidemic' | 'other'
  description: string
  action: 'rest' | 'call_parent' | 'hospital'
  notes?: string
  students: Student[]
  attachments?: string[]
  status: 'pending' | 'in_progress' | 'completed'
  createdBy: string
  createdAt: string
}

const MedicalReport: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Mock data - sau này sẽ lấy từ API
  const studentsList: Student[] = [
    { id: '1', name: 'Nguyễn Văn A', class: '5A', grade: '5' },
    { id: '2', name: 'Trần Thị B', class: '3B', grade: '3' },
    { id: '3', name: 'Lê Văn C', class: '2A', grade: '2' }
  ]

  const medicalEvents: MedicalEvent[] = [
    {
      id: '1',
      eventTime: '2024-03-20 10:30',
      eventType: 'fever',
      description: 'Học sinh sốt cao 39 độ',
      action: 'call_parent',
      notes: 'Đã cho uống hạ sốt và gọi phụ huynh',
      students: [studentsList[0]],
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
      students: [studentsList[1]],
      status: 'in_progress',
      createdBy: 'Y tá Nguyễn Thị H',
      createdAt: '2024-03-19 14:20'
    }
  ]

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
      title: 'Học sinh liên quan',
      dataIndex: 'students',
      key: 'students',
      render: (students: Student[]) => (
        <Space direction='vertical'>
          {students.map(student => (
            <div key={student.id}>
              {student.name} - Lớp {student.class}
            </div>
          ))}
        </Space>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Xử lý',
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
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type='link' onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      )
    }
  ]

  const handleViewDetails = (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsModalVisible(true)
  }

  const onFinish = (values: any) => {
    console.log('Form values:', values)
    message.success('Tạo báo cáo sự kiện y tế thành công!')
    form.resetFields()
    setFileList([])
  }

  const normFile = (e: { fileList: UploadFile[] }) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={4}>Báo cáo sự kiện y tế</Title>
            </Col>
            <Col>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => form.submit()}>
                Tạo báo cáo
              </Button>
            </Col>
          </Row>

          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            initialValues={{
              eventTime: dayjs()
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='eventTime'
                  label='Thời gian sự kiện'
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                >
                  <DatePicker showTime format='DD/MM/YYYY HH:mm' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='eventType'
                  label='Loại sự kiện'
                  rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
                >
                  <Select
                    options={[
                      { value: 'fever', label: 'Sốt' },
                      { value: 'accident', label: 'Tai nạn' },
                      { value: 'epidemic', label: 'Dịch bệnh' },
                      { value: 'other', label: 'Khác' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name='students'
              label='Học sinh liên quan'
              rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
            >
              <Select
                mode='multiple'
                placeholder='Chọn học sinh'
                options={studentsList.map(student => ({
                  value: student.id,
                  label: `${student.name} - Lớp ${student.class}`
                }))}
              />
            </Form.Item>

            <Form.Item
              name='description'
              label='Mô tả chi tiết'
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder='Nhập mô tả chi tiết về sự kiện...' />
            </Form.Item>

            <Form.Item
              name='action'
              label='Xử lý thực hiện'
              rules={[{ required: true, message: 'Vui lòng chọn cách xử lý!' }]}
            >
              <Select
                options={[
                  { value: 'rest', label: 'Cho nghỉ' },
                  { value: 'call_parent', label: 'Gọi phụ huynh' },
                  { value: 'hospital', label: 'Chuyển viện' }
                ]}
              />
            </Form.Item>

            <Form.Item name='notes' label='Ghi chú thêm'>
              <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' />
            </Form.Item>

            <Form.Item
              name='attachments'
              label='Đính kèm tài liệu'
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                listType='picture-card'
                maxCount={5}
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>

          <Title level={5}>Danh sách báo cáo</Title>
          <Table columns={columns} dataSource={medicalEvents} rowKey='id' />

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
                    {selectedEvent.eventTime}
                  </Descriptions.Item>
                  <Descriptions.Item label='Loại sự kiện'>
                    {selectedEvent.eventType === 'fever'
                      ? 'Sốt'
                      : selectedEvent.eventType === 'accident'
                        ? 'Tai nạn'
                        : selectedEvent.eventType === 'epidemic'
                          ? 'Dịch bệnh'
                          : 'Khác'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái'>
                    {selectedEvent.status === 'pending'
                      ? 'Chờ xử lý'
                      : selectedEvent.status === 'in_progress'
                        ? 'Đang xử lý'
                        : 'Đã hoàn thành'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Học sinh liên quan' span={2}>
                    {selectedEvent.students.map(student => (
                      <div key={student.id}>
                        {student.name} - Lớp {student.class}
                      </div>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label='Mô tả' span={2}>
                    {selectedEvent.description}
                  </Descriptions.Item>
                  <Descriptions.Item label='Xử lý'>
                    {selectedEvent.action === 'rest'
                      ? 'Cho nghỉ'
                      : selectedEvent.action === 'call_parent'
                        ? 'Gọi phụ huynh'
                        : 'Chuyển viện'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Người tạo'>
                    {selectedEvent.createdBy}
                  </Descriptions.Item>
                  {selectedEvent.notes && (
                    <Descriptions.Item label='Ghi chú' span={2}>
                      {selectedEvent.notes}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Title level={5}>Tài liệu đính kèm</Title>
                    <Image.PreviewGroup>
                      <Row gutter={[8, 8]}>
                        {selectedEvent.attachments.map((file, index) => (
                          <Col span={8} key={index}>
                            <Image src={file} alt={`Tài liệu ${index + 1}`} />
                          </Col>
                        ))}
                      </Row>
                    </Image.PreviewGroup>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </Space>
      </Card>
    </div>
  )
}

export default MedicalReport
