import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Typography,
  Space,
  Tag,
  Descriptions,
  Row,
  Col,
  Statistic
} from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, MedicineBoxOutlined, StopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import {
  getAllRequests,
  MedicationRequestHistory,
  Medication,
  processRequest
} from '../../../apis/parentMedicationRequest'
import { toast } from 'react-toastify'

const { Title } = Typography
const { TextArea } = Input

const ReceiveMedicine: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequestHistory | null>(null)
  const [form] = Form.useForm()
  const [requests, setRequests] = useState<MedicationRequestHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false)
  const [rejectingRequest, setRejectingRequest] = useState<MedicationRequestHistory | null>(null)
  const [rejectForm] = Form.useForm()

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await getAllRequests()
      const sorted = (res.$values || []).sort(
        (a: MedicationRequestHistory, b: MedicationRequestHistory) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      )
      setRequests(sorted)
      console.log('Fetched requests:', sorted)
    } catch (e) {
      console.error(e)
      toast.error('Lấy danh sách đơn thuốc thất bại')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      setLoading(true)
      await processRequest(id, { status: 'Approved' })
      toast.success('Đã duyệt đơn thuốc.')
      fetchRequests()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi duyệt đơn thuốc.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleOpenRejectModal = (record: MedicationRequestHistory) => {
    setRejectingRequest(record)
    setIsRejectModalVisible(true)
    rejectForm.resetFields()
  }

  const handleRejectSubmit = async (values: { nurseNote: string }) => {
    if (!rejectingRequest) return
    try {
      setLoading(true)
      await processRequest(rejectingRequest.requestId, { status: 'Rejected', nurseNote: values.nurseNote })
      toast.success('Đã từ chối đơn thuốc.')
      setIsRejectModalVisible(false)
      fetchRequests()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi từ chối đơn thuốc.')
      console.error(error)
    } finally {
      setLoading(false)
      setRejectingRequest(null)
    }
  }

  const columns: ColumnsType<MedicationRequestHistory> = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Thuốc',
      key: 'medications',
      render: (_, record) => {
        const meds = record.medications?.$values || []
        return meds.map((m: Medication, index) => (
          <li key={index} className='mb-2'>
            <div>
              <strong>Tên thuốc:</strong> {m.name}
            </div>
            <div>
              <strong>Dạng:</strong> {m.type}
            </div>
            <div>
              <strong>Liều lượng:</strong> {m.dosage}
            </div>
            <div>
              <strong>Cách dùng:</strong> {m.usage}
            </div>
            <div>
              <strong>Hạn sử dụng:</strong> {dayjs(m.expiredDate).format('DD/MM/YYYY')}
            </div>
            {m.note && (
              <div>
                <strong>Ghi chú:</strong> {m.note}
              </div>
            )}
          </li>
        ))
      }
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue'
        let text = status
        let icon = <ClockCircleOutlined />

        switch (status) {
          case 'Pending':
            color = 'gold'
            text = 'Chờ duyệt'
            icon = <ClockCircleOutlined />
            break
          case 'Approved':
            color = 'green'
            text = 'Đã duyệt'
            icon = <CheckCircleOutlined />
            break
          case 'Rejected':
            color = 'red'
            text = 'Đã từ chối'
            icon = <StopOutlined />
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
          {record.status === 'Pending' && (
            <>
              <Button color='cyan' variant='solid' onClick={() => handleApprove(record.requestId)}>
                Duyệt
              </Button>
              <Button danger onClick={() => handleOpenRejectModal(record)}>
                Từ chối
              </Button>
            </>
          )}
        </Space>
      )
    }
  ]

  const handleViewDetails = (record: MedicationRequestHistory) => {
    setSelectedRequest(record)
    setIsModalVisible(true)
  }

  const handleAddNote = (values: { nurseNotes: string }) => {
    if (selectedRequest) {
      toast.success(`Thêm ghi chú thành công!${values.nurseNotes ? ' Nội dung: ' + values.nurseNotes : ''}`)
      setIsModalVisible(false)
    }
    form.resetFields()
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    rejected: requests.filter((r) => r.status === 'Rejected').length
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={4}>Quản lý nhận thuốc</Title>

          {/* Thống kê */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic title='Tổng số đơn' value={stats.total} prefix={<MedicineBoxOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Chờ duyệt' value={stats.pending} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đã duyệt' value={stats.approved} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title='Đã từ chối' value={stats.rejected} valueStyle={{ color: '#f5222d' }} />
              </Card>
            </Col>
          </Row>

          {/* Bảng danh sách */}
          <Table
            columns={columns}
            dataSource={requests}
            rowKey='requestId'
            pagination={{ pageSize: 10 }}
            loading={loading}
          />

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
                    {selectedRequest.studentName} (Mã HS: {selectedRequest.studentCode})
                  </Descriptions.Item>
                  <Descriptions.Item label='Lớp' span={2}>
                    {selectedRequest.className}
                  </Descriptions.Item>
                  <Descriptions.Item label='Ngày gửi' span={2}>
                    {dayjs(selectedRequest.dateCreated).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái' span={2}>
                    {
                      <Tag
                        color={
                          selectedRequest.status === 'Pending'
                            ? 'gold'
                            : selectedRequest.status === 'Approved'
                              ? 'green'
                              : 'red'
                        }
                      >
                        {selectedRequest.status === 'Pending'
                          ? 'Chờ duyệt'
                          : selectedRequest.status === 'Approved'
                            ? 'Đã duyệt'
                            : 'Đã từ chối'}
                      </Tag>
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label='Ghi chú của phụ huynh' span={2}>
                    {selectedRequest.parentNote ? selectedRequest.parentNote : 'Không có ghi chú'}
                  </Descriptions.Item>

                  <Descriptions.Item label='Danh sách thuốc' span={2}>
                    <ul>
                      {(selectedRequest.medications?.$values || []).map((med, index) => (
                        <li key={index} className='mb-2'>
                          <div>
                            <strong>Tên thuốc:</strong> {med.name}
                          </div>
                          <div>
                            <strong>Dạng:</strong> {med.type}
                          </div>
                          <div>
                            <strong>Liều lượng:</strong> {med.dosage}
                          </div>
                          <div>
                            <strong>Cách dùng:</strong> {med.usage}
                          </div>
                          <div>
                            <strong>Hạn sử dụng:</strong> {dayjs(med.expiredDate).format('DD/MM/YYYY')}
                          </div>
                          {med.note && (
                            <div>
                              <strong>Ghi chú:</strong> {med.note}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Descriptions.Item>
                </Descriptions>

                {/* <Form form={form} layout='vertical' onFinish={handleAddNote} style={{ marginTop: 16 }}>
                  <Form.Item name='nurseNotes' label='Ghi chú của y tá'>
                    <TextArea rows={4} placeholder='Nhập ghi chú của y tá...' />
                  </Form.Item>
                  <Form.Item className='flex justify-end'>
                    <Button type='primary' htmlType='submit'>
                      Lưu ghi chú
                    </Button>
                  </Form.Item>
                </Form> */}
              </div>
            )}
          </Modal>

          <Modal
            title='Lý do từ chối'
            open={isRejectModalVisible}
            onCancel={() => setIsRejectModalVisible(false)}
            onOk={() => rejectForm.submit()}
            confirmLoading={loading}
            okText='Xác nhận từ chối'
            cancelText='Hủy'
          >
            <Form form={rejectForm} onFinish={handleRejectSubmit} layout='vertical'>
              <Form.Item
                name='nurseNote'
                label='Lý do'
                rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
              >
                <Input.TextArea rows={4} placeholder='Nhập lý do...' />
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </Card>
    </div>
  )
}

export default ReceiveMedicine
