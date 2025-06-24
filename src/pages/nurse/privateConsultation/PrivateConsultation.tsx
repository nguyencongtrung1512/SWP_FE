import React, { useState, useEffect } from 'react'
import { Card, Button, Table, Typography, Space, Tag, Row, Col, Tabs, Spin, Popconfirm, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CreateConsultation from './CreateConsultation'
import {
  getHealthConsultationBookingByNurse,
  getHealthConsultationBookingByParent,
  cancelHealthConsultationBooking,
  confirmHealthConsultationBooking,
  doneHealthConsultationBooking,
  getHealthConsultationBookingById
} from '../../../apis/healthConsultationBooking.api'
import { getAllStudents, Student as ApiStudent } from '../../../apis/student'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const { Title } = Typography

interface LocalStudent {
  id: string
  name: string
  class: string
  studentCode?: string
}

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
  studentName: string;
  studentCode: string;
  studentClass: string;
  nurseName: string;
  parentName: string;
  scheduledTime: string;
  reason: string;
  status: string;
  notes?: string;
}

const PrivateConsultation: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('invite')
  const [students, setStudents] = useState<LocalStudent[]>([])
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([])
  const [parentRequests, setParentRequests] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<HealthConsultationBookingDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchConsultationRequests()
    fetchParentRequests()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents()
      setStudents(
        (res.data.$values as ApiStudent[]).map((s) => ({
          id: s.studentId ? s.studentId.toString() : '',
          name: s.fullname,
          class: s.className,
          studentCode: s.studentCode
        }))
      )
    } catch {
      console.log('Không thể tải danh sách học sinh!')
    }
  }

  const fetchConsultationRequests = async () => {
    setLoading(true)
    try {
      const res = await getHealthConsultationBookingByNurse()
      setConsultationRequests(res.data?.$values || [])
    } catch {
      console.log('Không thể tải danh sách lịch hẹn!')
    } finally {
      setLoading(false)
    }
  }

  const fetchParentRequests = async () => {
    try {
      const res = await getHealthConsultationBookingByParent()
      setParentRequests(res.data?.$values || [])
    } catch {
      console.log('Không thể tải danh sách yêu cầu tư vấn từ phụ huynh!')
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelHealthConsultationBooking(Number(bookingId))
      toast.success('Hủy lịch tư vấn thành công!')
      fetchConsultationRequests()
      fetchParentRequests()
    } catch {
      toast.error('Hủy lịch tư vấn thất bại!')
    }
  }

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await confirmHealthConsultationBooking(Number(bookingId))
      toast.success('Xác nhận lịch tư vấn thành công!')
      fetchConsultationRequests()
      fetchParentRequests()
    } catch {
      message.error('Xác nhận lịch tư vấn thất bại!')
    }
  }

  const handleDoneBooking = async (bookingId: string) => {
    try {
      await doneHealthConsultationBooking(Number(bookingId))
      toast.success('Đã hoàn thành lịch tư vấn!')
      fetchConsultationRequests()
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
      console.log(res.data)
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
      render: (_: unknown, record: ConsultationRequest) => (
        <Space>
          <Button size='small' onClick={() => handleViewDetail(record.bookingId)}>
            Xem chi tiết
          </Button>
          {record.status === 'Pending' && (
            <Button type='primary' size='small' onClick={() => handleConfirmBooking(record.bookingId)}>
              Xác nhận
            </Button>
          )}
          <Button
            type='dashed'
            size='small'
            onClick={() => handleDoneBooking(record.bookingId)}
            disabled={record.status !== 'Confirmed'}
          >
            Hoàn thành
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn hủy lịch tư vấn này?'
            onConfirm={() => handleCancelBooking(record.bookingId)}
            okText='Đồng ý'
            cancelText='Hủy'
          >
            <Button danger size='small'>Hủy</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

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

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab='Lời mời tư vấn' key='invite'>
              <Spin spinning={loading}>
                <Table columns={columns} dataSource={consultationRequests} rowKey='bookingId' pagination={{ pageSize: 10 }} />
              </Spin>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Yêu cầu tư vấn từ phụ huynh' key='parent'>
              <Spin spinning={loading}>
                <Table columns={columns} dataSource={parentRequests} rowKey='bookingId' pagination={{ pageSize: 10 }} />
              </Spin>
            </Tabs.TabPane>
          </Tabs>
        </Card>

        <CreateConsultation
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false)
            fetchConsultationRequests()
            fetchParentRequests()
          }}
          students={students}
        />

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
              <b>Học sinh:</b> {detailData.studentName}<br />
              <b>Mã học sinh:</b> {detailData.studentCode}<br />
              <b>Lớp:</b> {detailData.studentClass}<br />
              <b>Y tá:</b> {detailData.nurseName}<br />
              <b>Phụ huynh:</b> {detailData.parentName}<br />
              <b>Thời gian:</b> {detailData.scheduledTime ? dayjs(detailData.scheduledTime).format('DD/MM/YYYY HH:mm') : ''}<br />
              <b>Lý do:</b> {detailData.reason}<br />
              <b>Trạng thái:</b> {detailData.status}<br />
              <b>Ghi chú:</b> {detailData.notes || 'Không có'}<br />
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
