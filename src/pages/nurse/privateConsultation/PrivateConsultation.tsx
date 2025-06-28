import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Typography, Space, Tag, Row, Col, Spin, Popconfirm, message, Modal } from 'antd'
import {
  cancelHealthConsultationBooking,
  confirmHealthConsultationBooking,
  doneHealthConsultationBooking,
  getHealthConsultationBookingById,
  getHealthConsultationBookingByNurse
} from '../../../apis/healthConsultationBooking.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const { Title } = Typography

interface ConsultationRequest {
  bookingId: string
  studentId: string
  studentName: string
  studentClass: string
  reason: string
  suggestedTime: string
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

  useEffect(() => {
    fetchParentRequests()
  }, [])

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
  const activeRequests = parentRequests.filter((r) => r.status !== 'Done' && r.status !== 'Cancelled')
  const historyRequests = parentRequests.filter((r) => r.status === 'Done' || r.status === 'Cancelled')

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
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (value: string) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          Pending: { color: 'blue', text: 'Chờ phản hồi' },
          Confirmed: { color: 'green', text: 'Đã xác nhận' },
          Done: { color: 'gray', text: 'Đã hoàn thành' },
          Cancelled: { color: 'red', text: 'Bị hủy bỏ' }
        }
        const { color, text } = statuses[status as keyof typeof statuses] || { color: 'default', text: status }
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: ConsultationRequest) => {
        // Nếu đã hoàn thành hoặc đã hủy thì không hiển thị nút Hủy và Hoàn thành
        const isDoneOrCancelled = record.status === 'Done' || record.status === 'Cancelled'
        return (
          <Space>
            <Button size='small' onClick={() => handleViewDetail(record.bookingId)}>
              Xem chi tiết
            </Button>
            {!isDoneOrCancelled && record.status === 'Pending' && (
              <Button
                color='primary'
                variant='outlined'
                size='small'
                onClick={() => handleConfirmBooking(record.bookingId)}
              >
                Xác nhận
              </Button>
            )}
            {!isDoneOrCancelled && record.status === 'Confirmed' && (
              <Button color='cyan' variant='outlined' size='small' onClick={() => handleDoneBooking(record.bookingId)}>
                Hoàn thành
              </Button>
            )}
            {!isDoneOrCancelled && record.status === 'Confirmed' && (
              <Button 
                type='primary' 
                size='small' 
                onClick={() => window.location.href = `/nurse/private-consultation/video-call/${record.bookingId}`}
              >
                Tham gia cuộc gọi
              </Button>
            )}
            {!isDoneOrCancelled && (
              <Popconfirm
                title='Bạn có chắc chắn muốn hủy lịch tư vấn này?'
                onConfirm={() => handleCancelBooking(record.bookingId)}
                okText='Đồng ý'
                cancelText='Hủy'
              >
                <Button danger size='small'>
                  Hủy
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={4}>Yêu cầu tư vấn riêng từ phụ huynh</Title>
            </Col>
          </Row>
        </Card>

        <Card>
          <Spin spinning={loading}>
            <Table columns={columns} dataSource={activeRequests} rowKey='bookingId' pagination={{ pageSize: 10 }} />
          </Spin>
        </Card>

        {/* Lịch sử tư vấn */}
        <Card>
          <Title level={5} style={{ marginBottom: 16 }}>
            Lịch sử tư vấn
          </Title>
          <Table columns={columns} dataSource={historyRequests} rowKey='bookingId' pagination={{ pageSize: 10 }} />
        </Card>

        <Modal
          title='Chi tiết lịch tư vấn'
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={600}
        >
          {detailLoading ? (
            <Spin />
          ) : detailData ? (
            <div style={{ lineHeight: 2 }}>
              <b>Học sinh:</b> {detailData.studentName}
              <br />
              <b>Mã học sinh:</b> {detailData.studentCode}
              <br />
              <b>Lớp:</b> {detailData.className}
              <br />
              <b>Y tá:</b> {detailData.nurseName}
              <br />
              <b>Phụ huynh:</b> {detailData.parentName}
              <br />
              <b>Thời gian:</b>{' '}
              {detailData.scheduledTime ? dayjs(detailData.scheduledTime).format('DD/MM/YYYY HH:mm') : ''}
              <br />
              <b>Lý do:</b> {detailData.reason}
              <br />
              <b>Trạng thái:</b> {detailData.status}
              <br />
              <b>Ghi chú:</b> {detailData.notes || 'Không có'}
              <br />
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </Modal>
      </Space>
    </div>
  )
}

export default PrivateConsultation
