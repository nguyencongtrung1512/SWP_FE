import type React from 'react'
import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Spin,
  Popconfirm,
  message,
  Modal,
  DatePicker,
  Tabs,
  Badge,
  Descriptions,
  Alert,
  Divider,
  Empty
} from 'antd'
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  FilterOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons'
import {
  cancelHealthConsultationBooking,
  confirmHealthConsultationBooking,
  doneHealthConsultationBooking,
  getHealthConsultationBookingById,
  getHealthConsultationBookingByNurse
} from '../../../apis/healthConsultationBooking.api'
import dayjs, { type Dayjs } from 'dayjs'
import { toast } from 'react-toastify'

const { Title, Text } = Typography
const { TabPane } = Tabs

interface ConsultationRequest {
  bookingId: string
  studentId: string
  studentName: string
  studentClass: string
  reason: string
  scheduledTime: string
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Done'
  notes?: string
  createdBy: string
  createdAt: string
  parentResponse?: string
  parentResponseTime?: string
}

interface HealthConsultationBookingDetail {
  studentName: string
  studentCode: string
  className: string
  nurseName: string
  parentName: string
  scheduledTime: string
  reason: string
  status: string
  notes?: string
}

const PrivateConsultation: React.FC = () => {
  const [parentRequests, setParentRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<HealthConsultationBookingDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null)

  useEffect(() => {
    fetchParentRequests()
  }, [])

  // Kiểm tra và tự động hủy các yêu cầu quá hạn
  useEffect(() => {
    const now = dayjs()
    parentRequests.forEach((r) => {
      if (r.status === 'Pending' && r.scheduledTime && dayjs(r.scheduledTime).isBefore(now)) {
        // Nếu đã quá hạn và chưa bị hủy, gọi API hủy
        cancelHealthConsultationBooking(Number(r.bookingId))
      }
    })
  }, [parentRequests])

  const fetchParentRequests = async () => {
    setLoading(true)
    try {
      const res = await getHealthConsultationBookingByNurse()
      setParentRequests(res.data?.$values || [])
    } catch {
      console.log('Không thể tải danh sách yêu cầu tư vấn từ phụ huynh!')
    } finally {
      setLoading(false)
    }
  }

  // Phân loại danh sách: đang xử lý và lịch sử
  const activeRequests = parentRequests.filter((r) => r.status !== 'Done')
  let historyRequests = parentRequests.filter((r) => r.status === 'Done')

  // Lọc theo ngày nếu có chọn
  if (filterDate) {
    historyRequests = historyRequests.filter((r) => dayjs(r.scheduledTime).isSame(filterDate, 'day'))
  }

  // Sắp xếp giảm dần theo ngày đề xuất
  historyRequests = historyRequests.sort((a, b) => dayjs(b.scheduledTime).valueOf() - dayjs(a.scheduledTime).valueOf())

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelHealthConsultationBooking(Number(bookingId))
      toast.success('Hủy lịch tư vấn thành công!')
      fetchParentRequests()
    } catch {
      toast.error('Hủy lịch tư vấn thất bại!')
    }
  }

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await confirmHealthConsultationBooking(Number(bookingId))
      toast.success('Xác nhận lịch tư vấn thành công!')
      fetchParentRequests()
    } catch {
      message.error('Xác nhận lịch tư vấn thất bại!')
    }
  }

  const handleDoneBooking = async (bookingId: string) => {
    try {
      await doneHealthConsultationBooking(Number(bookingId))
      toast.success('Đã hoàn thành lịch tư vấn!')
      fetchParentRequests()
    } catch {
      message.error('Cập nhật hoàn thành thất bại!')
    }
  }

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true)
    setDetailModalVisible(true)
    try {
      const res = await getHealthConsultationBookingById(Number(id))
      setDetailData(res.data)
    } catch {
      setDetailData(null)
      message.error('Không thể lấy chi tiết lịch tư vấn!')
    } finally {
      setDetailLoading(false)
    }
  }

  // Thêm hàm chuyển trạng thái sang tiếng Việt
  const getStatusText = (status: string, scheduledTime?: string) => {
    const now = dayjs()

    if (status === 'Pending' && scheduledTime && dayjs(scheduledTime).isBefore(now)) {
      return 'Quá hạn'
    }

    const map: Record<string, string> = {
      Pending: 'Chờ phản hồi',
      Confirmed: 'Đã xác nhận',
      Done: 'Đã hoàn thành',
      Cancelled: 'Bị hủy bỏ'
    }

    return map[status] || status
  }

  const getStatusColor = (status: string, scheduledTime?: string) => {
    const now = dayjs()

    if (status === 'Pending' && scheduledTime && dayjs(scheduledTime).isBefore(now)) {
      return 'error'
    }

    const colorMap: Record<string, string> = {
      Pending: 'processing',
      Confirmed: 'success',
      Done: 'default',
      Cancelled: 'error'
    }

    return colorMap[status] || 'default'
  }

  const columns = [
    {
      title: 'Thông tin học sinh',
      key: 'student',
      render: (record: ConsultationRequest) => (
        <Space direction='vertical' size='small'>
          <Text strong>{record.studentName}</Text>
          <Tag color='blue'>Lớp {record.studentClass}</Tag>
        </Space>
      )
    },
    {
      title: 'Lý do tư vấn',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => (
        <Text style={{ maxWidth: 200, display: 'block' }} ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Thời gian đề xuất',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (value: string) => (
        <Space direction='vertical' size='small'>
          <Text>{value ? dayjs(value).format('DD/MM/YYYY') : ''}</Text>
          <Text type='secondary'>{value ? dayjs(value).format('HH:mm') : ''}</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: ConsultationRequest) => {
        const now = dayjs()
        const isOverdue =
          record.status === 'Pending' && record.scheduledTime && dayjs(record.scheduledTime).isBefore(now)

        if (isOverdue) {
          return (
            <Badge
              status='error'
              text={
                <Tag color='red' icon={<ExclamationCircleOutlined />}>
                  Quá hạn
                </Tag>
              }
            />
          )
        }

        const statusConfig = {
          Pending: { color: 'blue', icon: <CalendarOutlined />, text: 'Chờ phản hồi' },
          Confirmed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' },
          Done: { color: 'default', icon: <CheckCircleOutlined />, text: 'Đã hoàn thành' },
          Cancelled: { color: 'red', icon: <CloseCircleOutlined />, text: 'Bị hủy bỏ' }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || {
          color: 'default',
          icon: null,
          text: status
        }

        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: ConsultationRequest) => {
        const now = dayjs()
        const isOverdue =
          record.status === 'Pending' && record.scheduledTime && dayjs(record.scheduledTime).isBefore(now)
        const isDone = record.status === 'Done'

        return (
          <Space wrap>
            <Button size='small' icon={<EyeOutlined />} onClick={() => handleViewDetail(record.bookingId)}>
              Chi tiết
            </Button>

            {isOverdue && (
              <Button
                type='default'
                size='small'
                icon={<CheckCircleOutlined />}
                onClick={() => handleDoneBooking(record.bookingId)}
              >
                Đã xử lí
              </Button>
            )}

            {record.status === 'Cancelled' && (
              <Button
                type='default'
                size='small'
                icon={<CheckCircleOutlined />}
                onClick={() => handleDoneBooking(record.bookingId)}
              >
                Đã xử lí
              </Button>
            )}

            {!isDone && !isOverdue && record.status === 'Pending' && (
              <Button
                type='primary'
                size='small'
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirmBooking(record.bookingId)}
              >
                Xác nhận
              </Button>
            )}

            {!isDone && !isOverdue && record.status === 'Confirmed' && (
              <Button
                type='primary'
                size='small'
                icon={<CheckCircleOutlined />}
                onClick={() => handleDoneBooking(record.bookingId)}
              >
                Hoàn thành
              </Button>
            )}

            {!isDone && !isOverdue && record.status !== 'Cancelled' && (
              <Popconfirm
                title='Xác nhận hủy lịch tư vấn'
                description='Bạn có chắc chắn muốn hủy lịch tư vấn này?'
                onConfirm={() => handleCancelBooking(record.bookingId)}
                okText='Đồng ý'
                cancelText='Hủy'
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              >
                <Button danger size='small' icon={<CloseCircleOutlined />}>
                  Hủy
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  // Thống kê nhanh
  // const pendingCount = activeRequests.filter((r) => r.status === 'Pending').length
  // const confirmedCount = activeRequests.filter((r) => r.status === 'Confirmed').length
  const overdueCount = activeRequests.filter((r) => {
    const now = dayjs()
    return r.status === 'Pending' && r.scheduledTime && dayjs(r.scheduledTime).isBefore(now)
  }).length

  return (
    <div style={{ padding: '2px', maxWidth: 1400, margin: '0 auto' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Header */}
        <Card style={{ background: 'linear-gradient(135deg, #7c91ef 0%, #2171cc 100%)' }}>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                <MedicineBoxOutlined style={{ marginRight: 12 }} />
                Quản lý tư vấn sức khỏe riêng
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Theo dõi và xử lý các yêu cầu tư vấn từ phụ huynh</Text>
            </Col>
          </Row>
        </Card>

        {/* Thống kê nhanh */}
        {/* <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Space>
                <Badge count={pendingCount} showZero color='#1890ff'>
                  <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </Badge>
                <div>
                  <Text type='secondary'>Chờ phản hồi</Text>
                  <br />
                  <Text strong style={{ fontSize: 18 }}>
                    {pendingCount}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Space>
                <Badge count={confirmedCount} showZero color='#52c41a'>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                </Badge>
                <div>
                  <Text type='secondary'>Đã xác nhận</Text>
                  <br />
                  <Text strong style={{ fontSize: 18 }}>
                    {confirmedCount}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Space>
                <Badge count={overdueCount} showZero color='#ff4d4f'>
                  <ExclamationCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                </Badge>
                <div>
                  <Text type='secondary'>Quá hạn</Text>
                  <br />
                  <Text strong style={{ fontSize: 18 }}>
                    {overdueCount}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row> */}

        {/* Tabs cho active và history */}
        <Card>
          <Tabs defaultActiveKey='active' size='large'>
            <TabPane
              tab={
                <Space>
                  <CalendarOutlined />
                  <span>Yêu cầu đang xử lý</span>
                  <Badge count={activeRequests.length} showZero />
                </Space>
              }
              key='active'
            >
              {overdueCount > 0 && (
                <Alert
                  message={`Có ${overdueCount} yêu cầu đã quá hạn cần xử lý`}
                  type='warning'
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={activeRequests}
                  rowKey='bookingId'
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`
                  }}
                  locale={{
                    emptyText: <Empty description='Không có yêu cầu nào đang xử lý' />
                  }}
                />
              </Spin>
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <HistoryOutlined />
                  <span>Lịch sử tư vấn</span>
                  {/* <Badge count={historyRequests.length} showZero /> */}
                </Space>
              }
              key='history'
            >
              <Space style={{ marginBottom: 16 }}>
                <FilterOutlined />
                <Text>Lọc theo ngày:</Text>
                <DatePicker
                  allowClear
                  placeholder='Chọn ngày đề xuất'
                  value={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  format='DD/MM/YYYY'
                />
              </Space>

              <Table
                columns={columns}
                dataSource={historyRequests}
                rowKey='bookingId'
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch sử`
                }}
                locale={{
                  emptyText: <Empty description='Không có lịch sử tư vấn' />
                }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* Modal chi tiết */}
        <Modal
          title={
            <Space>
              <EyeOutlined />
              <span>Chi tiết lịch tư vấn</span>
            </Space>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key='close' onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>
          ]}
          width={700}
        >
          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size='large' />
            </div>
          ) : detailData ? (
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <Descriptions title='Thông tin chi tiết' bordered column={2}>
                <Descriptions.Item label='Học sinh' span={2}>
                  <Space>
                    <UserOutlined />
                    <Text strong>{detailData.studentName}</Text>
                    <Tag color='blue'>{detailData.studentCode}</Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Lớp học'>
                  <Tag color='green'>{detailData.className}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Y tá phụ trách'>{detailData.nurseName}</Descriptions.Item>
                <Descriptions.Item label='Phụ huynh' span={2}>
                  {detailData.parentName}
                </Descriptions.Item>
                <Descriptions.Item label='Thời gian đề xuất' span={2}>
                  <Space>
                    <CalendarOutlined />
                    <Text>
                      {detailData.scheduledTime ? dayjs(detailData.scheduledTime).format('DD/MM/YYYY HH:mm') : ''}
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Trạng thái' span={2}>
                  <Tag color={getStatusColor(detailData.status, detailData.scheduledTime)}>
                    {getStatusText(detailData.status, detailData.scheduledTime)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div>
                <Title level={5}>Lý do tư vấn</Title>
                <Card size='small' style={{ backgroundColor: '#fafafa' }}>
                  <Text>{detailData.reason}</Text>
                </Card>
              </div>

              {detailData.notes && (
                <div>
                  <Title level={5}>Ghi chú</Title>
                  <Card size='small' style={{ backgroundColor: '#fafafa' }}>
                    <Text>{detailData.notes}</Text>
                  </Card>
                </div>
              )}
            </Space>
          ) : (
            <Empty description='Không có dữ liệu' />
          )}
        </Modal>
      </Space>
    </div>
  )
}

export default PrivateConsultation
