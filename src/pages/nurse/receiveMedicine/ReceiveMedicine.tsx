import type React from 'react'
import { useEffect, useState } from 'react'
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
  Statistic,
  Badge,
  Alert,
  Divider,
  Empty,
  Tooltip,
  List
} from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  StopOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import {
  getAllRequests,
  type MedicationRequestHistory,
  type Medication,
  processRequest
} from '../../../apis/parentMedicationRequest.api'
import { toast } from 'react-toastify'

const { Title, Text } = Typography
const { TextArea } = Input

const ReceiveMedicine: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequestHistory | null>(null)
  // const [form] = Form.useForm()
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

  const handleViewDetails = (record: MedicationRequestHistory) => {
    setSelectedRequest(record)
    setIsModalVisible(true)
  }

  // Hàm xuất Excel cho đơn thuốc chi tiết
  const handleExportExcel = () => {
    if (!selectedRequest) return

    try {
      // Tạo workbook mới
      const wb = XLSX.utils.book_new()
      type Cell = string | number
      // Sheet 1: Thông tin đơn thuốc
      const requestInfo: Cell[][] = [
        ['THÔNG TIN ĐÔN THUỐC'],
        [''],
        ['Mã đơn thuốc:', selectedRequest.requestId],
        ['Học sinh:', selectedRequest.studentName],
        ['Mã học sinh:', selectedRequest.studentCode],
        ['Lớp học:', selectedRequest.className],
        ['Ngày gửi:', dayjs(selectedRequest.dateCreated).format('DD/MM/YYYY HH:mm')],
        ['Trạng thái:', getStatusConfig(selectedRequest.status).text],
        [''],
        ['Ghi chú từ phụ huynh:'],
        [selectedRequest.parentNote || 'Không có ghi chú'],
        ['']
      ]

      // Thêm ghi chú từ y tá nếu có
      if (selectedRequest.status === 'Rejected' && selectedRequest.nurseNote) {
        requestInfo.push(['Lý do từ chối:'])
        requestInfo.push([selectedRequest.nurseNote])
        requestInfo.push([''])
      }

      const ws1 = XLSX.utils.aoa_to_sheet(requestInfo)
      XLSX.utils.book_append_sheet(wb, ws1, 'Thông tin đơn thuốc')

      // Sheet 2: Danh sách thuốc
      const medications = selectedRequest.medications?.$values || []
      const medicationData: Cell[][] = [
        ['DANH SÁCH THUỐC'],
        [''],
        ['STT', 'Tên thuốc', 'Loại thuốc', 'Liều lượng', 'Cách sử dụng', 'Hạn sử dụng', 'Ghi chú']
      ]

      medications.forEach((med: Medication, index: number) => {
        medicationData.push([
          index + 1,
          med.name,
          med.type,
          med.dosage,
          med.usage,
          dayjs(med.expiredDate).format('DD/MM/YYYY'),
          med.note || 'Không có'
        ])
      })

      const ws2 = XLSX.utils.aoa_to_sheet(medicationData)
      XLSX.utils.book_append_sheet(wb, ws2, 'Danh sách thuốc')

      // Tạo file và tải xuống
      const fileName = `Don_thuoc_${selectedRequest.studentName}_${selectedRequest.requestId}_${dayjs().format('DDMMYYYY_HHmm')}.xlsx`
      XLSX.writeFile(wb, fileName)

      toast.success('Xuất file Excel thành công!')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất file Excel!')
    }
  }

  // const handleAddNote = (values: { nurseNotes: string }) => {
  //   if (selectedRequest) {
  //     toast.success(`Thêm ghi chú thành công!${values.nurseNotes ? ' Nội dung: ' + values.nurseNotes : ''}`)
  //     setIsModalVisible(false)
  //   }
  //   form.resetFields()
  // }

  const getStatusConfig = (status: string) => {
    const configs = {
      Pending: {
        color: 'gold',
        text: 'Chờ duyệt',
        icon: <ClockCircleOutlined />,
        bgColor: '#fff7e6',
        borderColor: '#ffd666'
      },
      Approved: {
        color: 'green',
        text: 'Đã duyệt',
        icon: <CheckCircleOutlined />,
        bgColor: '#f6ffed',
        borderColor: '#b7eb8f'
      },
      Rejected: {
        color: 'red',
        text: 'Đã từ chối',
        icon: <StopOutlined />,
        bgColor: '#fff2f0',
        borderColor: '#ffccc7'
      }
    }
    return configs[status as keyof typeof configs] || configs.Pending
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    rejected: requests.filter((r) => r.status === 'Rejected').length
  }

  const columns: ColumnsType<MedicationRequestHistory> = [
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Thông tin học sinh</span>
        </Space>
      ),
      key: 'student',
      width: 200,
      render: (_, record) => (
        <Space direction='vertical' size='small'>
          <Text strong>{record.studentName}</Text>
          <Tag color='blue'>{record.className}</Tag>
        </Space>
      )
    },
    {
      title: 'Danh sách thuốc',
      key: 'medications',
      render: (_, record) => {
        const meds = record.medications?.$values || []
        return (
          <div style={{ maxHeight: 120, overflowY: 'auto' }}>
            {meds.length > 0 ? (
              <List
                size='small'
                dataSource={meds.slice(0, 2)}
                renderItem={(med: Medication, index) => (
                  <List.Item key={index} style={{ padding: '4px 0', border: 'none' }}>
                    <Card size='small' style={{ width: '100%', marginBottom: 4 }}>
                      <Space direction='vertical' size='small' style={{ width: '100%' }}>
                        <Text strong>{med.name}</Text>
                        <Space wrap>
                          <Tag color='cyan'>{med.type}</Tag>
                          <Text type='secondary'>{med.dosage}</Text>
                        </Space>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description='Không có thuốc' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {meds.length > 2 && (
              <Text type='secondary' style={{ fontSize: 12 }}>
                +{meds.length - 2} thuốc khác...
              </Text>
            )}
          </div>
        )
      }
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Ngày gửi</span>
        </Space>
      ),
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: 150,
      render: (text) => (
        <Space direction='vertical' size='small'>
          <Text>{dayjs(text).format('DD/MM/YYYY')}</Text>
          <Text type='secondary'>{dayjs(text).format('HH:mm')}</Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.dateCreated).valueOf() - dayjs(b.dateCreated).valueOf()
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config = getStatusConfig(status)
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      },
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Đã từ chối', value: 'Rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Tooltip title='Xem chi tiết'>
            <Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
              Chi tiết
            </Button>
          </Tooltip>
          {record.status === 'Pending' && (
            <>
              <Tooltip title='Duyệt đơn thuốc'>
                <Button
                  type='primary'
                  size='small'
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record.requestId)}
                >
                  Duyệt
                </Button>
              </Tooltip>
              <Tooltip title='Từ chối đơn thuốc'>
                <Button danger size='small' icon={<CloseOutlined />} onClick={() => handleOpenRejectModal(record)}>
                  Từ chối
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        {/* Header */}
        <Card style={{ background: 'linear-gradient(135deg, #06b6d4 100%)' }}>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                <MedicineBoxOutlined style={{ marginRight: 12 }} />
                Quản lý đơn thuốc từ phụ huynh
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                Xem xét và xử lý các yêu cầu cung cấp thuốc từ phụ huynh
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Thống kê */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title='Tổng số đơn'
                value={stats.total}
                prefix={<MedicineBoxOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Badge count={stats.pending} showZero>
                <Statistic
                  title='Chờ duyệt'
                  value={stats.pending}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Badge>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title='Đã duyệt'
                value={stats.approved}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title='Đã từ chối'
                value={stats.rejected}
                prefix={<StopOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Alert cho pending requests */}
        {stats.pending > 0 && (
          <Alert
            message={`Có ${stats.pending} đơn thuốc đang chờ duyệt`}
            description='Vui lòng xem xét và xử lý các đơn thuốc chờ duyệt để đảm bảo sức khỏe học sinh.'
            type='warning'
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        )}

        {/* Bảng danh sách */}
        <Card>
          <Space direction='vertical' style={{ width: '100%' }} size='middle'>
            <Row justify='space-between' align='middle'>
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  Danh sách đơn thuốc
                </Title>
                <Text type='secondary'>Tổng cộng {requests.length} đơn thuốc</Text>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={requests}
              rowKey='requestId'
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn thuốc`
              }}
              loading={loading}
              scroll={{ x: 1000 }}
              locale={{
                emptyText: <Empty description='Không có đơn thuốc nào' />
              }}
            />
          </Space>
        </Card>

        {/* Modal chi tiết */}
        <Modal
          title={
            <Space>
              <EyeOutlined />
              <span>Chi tiết đơn thuốc</span>
            </Space>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={900}
          footer={[
            <Button
              key='export'
              type='primary'
              style={{ background: '#f40505' }}
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>,
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>
          ]}
        >
          {selectedRequest ? (
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <Alert
                message={`Đơn thuốc từ phụ huynh - ${getStatusConfig(selectedRequest.status).text}`}
                description={`Ngày gửi: ${dayjs(selectedRequest.dateCreated).format('DD/MM/YYYY HH:mm')}`}
                type='info'
                showIcon
                icon={<InfoCircleOutlined />}
              />

              <Descriptions title='Thông tin học sinh' bordered column={2}>
                <Descriptions.Item label='Học sinh' span={2}>
                  <Space>
                    <UserOutlined />
                    <Text strong>{selectedRequest.studentName}</Text>
                    <Tag color='blue'>{selectedRequest.studentCode}</Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Lớp học' span={2}>
                  <Tag color='green'>{selectedRequest.className}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Ngày gửi' span={2}>
                  <Space>
                    <CalendarOutlined />
                    <Text>{dayjs(selectedRequest.dateCreated).format('DD/MM/YYYY HH:mm')}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Trạng thái' span={2}>
                  <Tag
                    color={getStatusConfig(selectedRequest.status).color}
                    icon={getStatusConfig(selectedRequest.status).icon}
                  >
                    {getStatusConfig(selectedRequest.status).text}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div>
                <Title level={5}>
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  Ghi chú từ phụ huynh
                </Title>
                <Card size='small' style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedRequest.parentNote || 'Không có ghi chú từ phụ huynh'}</Text>
                </Card>
              </div>

              {/* Hiển thị ghi chú của y tá nếu bị từ chối */}
              {selectedRequest.status === 'Rejected' && (
                <div>
                  <Title level={5}>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    Lý do từ chối của y tá
                  </Title>
                  <Card size='small' style={{ backgroundColor: '#fff1f0' }}>
                    <Text type='danger'>{selectedRequest.nurseNote || 'Không có ghi chú từ y tá'}</Text>
                  </Card>
                </div>
              )}

              <div>
                <Title level={5}>
                  <MedicineBoxOutlined style={{ marginRight: 8 }} />
                  Danh sách thuốc ({(selectedRequest.medications?.$values || []).length} loại)
                </Title>
                <List
                  dataSource={selectedRequest.medications?.$values || []}
                  renderItem={(med: Medication, index) => (
                    <List.Item key={index}>
                      <Card style={{ width: '100%', marginBottom: 8 }}>
                        <Row gutter={[16, 8]}>
                          <Col xs={24} sm={12}>
                            <Space direction='vertical' size='small'>
                              <Text strong style={{ fontSize: 16 }}>
                                {med.name}
                              </Text>
                              <Space wrap>
                                <Tag color='blue'>{med.type}</Tag>
                                <Tag color='green'>{med.dosage}</Tag>
                              </Space>
                            </Space>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Descriptions size='small' column={1}>
                              <Descriptions.Item label='Cách dùng'>{med.usage}</Descriptions.Item>
                              <Descriptions.Item label='Hạn sử dụng'>
                                <Text type={dayjs(med.expiredDate).isBefore(dayjs()) ? 'danger' : 'success'}>
                                  {dayjs(med.expiredDate).format('DD/MM/YYYY')}
                                </Text>
                              </Descriptions.Item>
                              {med.note && <Descriptions.Item label='Ghi chú'>{med.note}</Descriptions.Item>}
                            </Descriptions>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                  locale={{
                    emptyText: <Empty description='Không có thuốc nào' />
                  }}
                />
              </div>
            </Space>
          ) : (
            <Empty description='Không có dữ liệu' />
          )}
        </Modal>

        {/* Modal từ chối */}
        <Modal
          title={
            <Space>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              <span>Từ chối đơn thuốc</span>
            </Space>
          }
          open={isRejectModalVisible}
          onCancel={() => setIsRejectModalVisible(false)}
          onOk={() => rejectForm.submit()}
          confirmLoading={loading}
          okText='Xác nhận từ chối'
          cancelText='Hủy'
          okButtonProps={{ danger: true }}
        >
          {rejectingRequest && (
            <Space direction='vertical' style={{ width: '100%' }} size='middle'>
              <Alert
                message={`Từ chối đơn thuốc của học sinh: ${rejectingRequest.studentName}`}
                type='warning'
                showIcon
              />
              <Form form={rejectForm} onFinish={handleRejectSubmit} layout='vertical'>
                <Form.Item
                  name='nurseNote'
                  label='Lý do từ chối'
                  rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
                >
                  <TextArea rows={4} placeholder='Nhập lý do từ chối đơn thuốc này...' showCount maxLength={500} />
                </Form.Item>
              </Form>
            </Space>
          )}
        </Modal>
      </Space>
    </div>
  )
}

export default ReceiveMedicine
