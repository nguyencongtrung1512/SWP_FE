import React, { useState } from 'react'
import {
  Form,
  Select,
  DatePicker,
  Upload,
  Button,
  Table,
  Tag,
  Space,
  Card,
  Typography,
  Tabs,
  Input,
  Row,
  Col,
  Modal,
  Descriptions,
  List,
  Statistic
} from 'antd'
import { UploadOutlined, FileTextOutlined, SearchOutlined, FilterOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import type { TabsProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { Option } = Select
const { Search } = Input

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

const ScheduleVaccination: React.FC = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [activeTab, setActiveTab] = useState('1')
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({
    eventType: undefined,
    grade: undefined,
    status: undefined
  })
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Form values:', values)
    // Xử lý logic gửi thông báo
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleViewDetails = (record: ScheduleData) => {
    setSelectedSchedule(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.eventType.toLowerCase().includes(searchText.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchText.toLowerCase()) ||
      item.date.includes(searchText)

    const matchesFilters =
      (!filters.eventType || item.eventType === filters.eventType) &&
      (!filters.grade || item.grade === filters.grade) &&
      (!filters.status || item.status === filters.status)

    return matchesSearch && matchesFilters
  })

  const columns: ColumnsType<ScheduleData> = [
    {
      title: 'Loại sự kiện',
      dataIndex: 'eventType',
      key: 'eventType',
      filters: [
        { text: 'Tiêm chủng', value: 'Tiêm chủng' },
        { text: 'Khám tổng quát', value: 'Khám tổng quát' },
        { text: 'Khám mắt', value: 'Khám mắt' },
        { text: 'Khám răng', value: 'Khám răng' }
      ],
      onFilter: (value, record) => record.eventType === value
    },
    {
      title: 'Khối/Lớp',
      dataIndex: 'grade',
      key: 'grade',
      filters: Array.from({ length: 5 }, (_, i) => ({
        text: `Lớp ${i + 1}`,
        value: `Lớp ${i + 1}`
      })),
      onFilter: (value, record) => record.grade === value
    },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'))
        const dateB = new Date(b.date.split('/').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      }
    },
    {
      title: 'Tổng số học sinh',
      dataIndex: 'totalStudents',
      key: 'totalStudents',
      sorter: (a, b) => a.totalStudents - b.totalStudents
    },
    {
      title: 'Đã xác nhận',
      dataIndex: 'confirmed',
      key: 'confirmed',
      render: (confirmed: number, record: ScheduleData) => (
        <Tag color='green'>
          {confirmed}/{record.totalStudents}
        </Tag>
      ),
      sorter: (a, b) => a.confirmed - b.confirmed
    },
    {
      title: 'Từ chối',
      dataIndex: 'rejected',
      key: 'rejected',
      render: (rejected: number, record: ScheduleData) => (
        <Tag color='red'>
          {rejected}/{record.totalStudents}
        </Tag>
      ),
      sorter: (a, b) => a.rejected - b.rejected
    },
    {
      title: 'Chưa phản hồi',
      dataIndex: 'pending',
      key: 'pending',
      render: (pending: number, record: ScheduleData) => (
        <Tag color='orange'>
          {pending}/{record.totalStudents}
        </Tag>
      ),
      sorter: (a, b) => a.pending - b.pending
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang diễn ra', value: 'active' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value,
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
          <Button type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'active' && (
            <Button type='primary' danger>
              Hủy
            </Button>
          )}
        </Space>
      )
    }
  ]

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Lập kế hoạch mới',
      children: (
        <Card className='max-w-3xl'>
          <Form form={form} layout='vertical' onFinish={handleSubmit} className='space-y-4'>
            <Form.Item
              name='eventType'
              label='Loại sự kiện'
              rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện' }]}
            >
              <Select placeholder='Chọn loại sự kiện'>
                <Option value='vaccination'>Tiêm chủng</Option>
                <Option value='general'>Khám tổng quát</Option>
                <Option value='eye'>Khám mắt</Option>
                <Option value='dental'>Khám răng</Option>
              </Select>
            </Form.Item>

            <Form.Item name='grade' label='Khối/Lớp' rules={[{ required: true, message: 'Vui lòng chọn khối/lớp' }]}>
              <Select placeholder='Chọn khối/lớp'>
                {Array.from({ length: 5 }, (_, i) => (
                  <Option key={i + 1} value={`grade${i + 1}`}>
                    Lớp {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name='date' label='Ngày dự kiến' rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
              <DatePicker className='w-full' />
            </Form.Item>

            <Form.Item
              name='document'
              label='Tài liệu đính kèm'
              rules={[{ required: true, message: 'Vui lòng tải lên tài liệu' }]}
            >
              <Upload
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên PDF</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name='content'
              label='Nội dung thông báo'
              rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo' }]}
            >
              <Input.TextArea rows={4} placeholder='Nhập nội dung thông báo gửi đến phụ huynh' />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' className='bg-blue-500'>
                Gửi thông báo đến phụ huynh
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: '2',
      label: 'Danh sách kế hoạch',
      children: (
        <div>
          <div className='mb-4 flex justify-between items-center'>
            <Title level={4}>Danh sách kế hoạch</Title>
            <Button type='primary' onClick={() => setActiveTab('1')}>
              Lập kế hoạch mới
            </Button>
          </div>

          <Card className='mb-4'>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Search
                  placeholder='Tìm kiếm theo tên, lớp, ngày...'
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
              <Col span={16}>
                <Space>
                  <Select
                    placeholder='Loại sự kiện'
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => handleFilterChange('eventType', value)}
                  >
                    <Option value='Tiêm chủng'>Tiêm chủng</Option>
                    <Option value='Khám tổng quát'>Khám tổng quát</Option>
                    <Option value='Khám mắt'>Khám mắt</Option>
                    <Option value='Khám răng'>Khám răng</Option>
                  </Select>

                  <Select
                    placeholder='Khối/Lớp'
                    allowClear
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('grade', value)}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Option key={i + 1} value={`Lớp ${i + 1}`}>
                        Lớp {i + 1}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    placeholder='Trạng thái'
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => handleFilterChange('status', value)}
                  >
                    <Option value='active'>Đang diễn ra</Option>
                    <Option value='completed'>Hoàn thành</Option>
                    <Option value='cancelled'>Đã hủy</Option>
                  </Select>

                  <Button
                    icon={<FilterOutlined />}
                    onClick={() =>
                      setFilters({
                        eventType: undefined,
                        grade: undefined,
                        status: undefined
                      })
                    }
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} kế hoạch`
            }}
          />
        </div>
      )
    }
  ]

  return (
    <div>
      <Title level={3} className='mb-6'>
        Lập kế hoạch tiêm chủng / khám sức khỏe
      </Title>
      <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />

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
                <a href='#'>{selectedSchedule.document}</a>
              </Descriptions.Item>
              <Descriptions.Item label='Nội dung thông báo' span={3}>
                {selectedSchedule.content}
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={16} className='mb-6'>
              <Col span={8}>
                <Card>
                  <Statistic
                    title='Đã xác nhận'
                    value={selectedSchedule.confirmed}
                    suffix={`/ ${selectedSchedule.totalStudents}`}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title='Từ chối'
                    value={selectedSchedule.rejected}
                    suffix={`/ ${selectedSchedule.totalStudents}`}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title='Chưa phản hồi'
                    value={selectedSchedule.pending}
                    suffix={`/ ${selectedSchedule.totalStudents}`}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <Tabs
              items={[
                {
                  key: '1',
                  label: 'Đã xác nhận',
                  children: (
                    <List
                      dataSource={selectedSchedule.confirmedStudents}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UserOutlined />}
                            title={item.name}
                            description={
                              <div>
                                <div>Phụ huynh: {item.parentName}</div>
                                <div>SĐT: {item.phone}</div>
                                <div>Ngày xác nhận: {item.confirmDate}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                },
                {
                  key: '2',
                  label: 'Từ chối',
                  children: (
                    <List
                      dataSource={selectedSchedule.rejectedStudents}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UserOutlined />}
                            title={item.name}
                            description={
                              <div>
                                <div>Phụ huynh: {item.parentName}</div>
                                <div>SĐT: {item.phone}</div>
                                <div>Lý do: {item.reason}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                },
                {
                  key: '3',
                  label: 'Chưa phản hồi',
                  children: (
                    <List
                      dataSource={selectedSchedule.pendingStudents}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UserOutlined />}
                            title={item.name}
                            description={
                              <div>
                                <div>Phụ huynh: {item.parentName}</div>
                                <div>SĐT: {item.phone}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ScheduleVaccination
