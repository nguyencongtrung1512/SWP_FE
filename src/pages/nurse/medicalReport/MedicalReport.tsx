import type React from 'react'
import { useState, useEffect } from 'react'
import {
  Button,
  Table,
  Card,
  Typography,
  Space,
  Modal,
  Descriptions,
  Tag,
  Tooltip,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Alert,
  Divider,
  Empty,
  Input,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  FileExcelOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import {
  getAllMedicalEvents,
  type MedicalEvent,
  deleteMedicalEvent,
  getMedicalEventById
} from '../../../apis/medicalEvent.api'
import CreateEvent from './CreateEvent'
import UpdateEvent from './UpdateEvent'

const { Title, Text } = Typography
const { Search } = Input

const MedicalReport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [detailEvent, setDetailEvent] = useState<MedicalEvent | null>(null)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [eventTypeFilter, setEventTypeFilter] = useState<string | undefined>(undefined)
  const [searchText, setSearchText] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [exportingExcel, setExportingExcel] = useState(false)

  useEffect(() => {
    fetchMedicalEvents()
  }, [])

  useEffect(() => {
    // Sắp xếp lại khi medicalEvents hoặc sortOrder thay đổi
    setMedicalEvents((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
    )
  }, [sortOrder])

  const fetchMedicalEvents = async () => {
    try {
      setLoading(true)
      const response = await getAllMedicalEvents()
      // Sắp xếp theo sortOrder khi fetch
      const sorted = [...response.data.$values].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })
      setMedicalEvents(sorted)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa sự kiện',
      content: 'Bạn có chắc chắn muốn xóa sự kiện y tế này? Hành động này không thể hoàn tác.',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteMedicalEvent(eventId)
          fetchMedicalEvents()
        } catch (error) {
          Modal.error({ title: 'Xóa thất bại', content: 'Đã có lỗi xảy ra khi xóa sự kiện.' })
        }
      }
    })
  }

  const handleViewDetails = async (record: MedicalEvent) => {
    setIsModalVisible(true)
    try {
      const res = await getMedicalEventById(record.medicalEventId)
      console.log(res)
      setDetailEvent(res.data)
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện y tế:', error)
      setDetailEvent(null)
    }
  }

  const handleEdit = (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsUpdateModalVisible(true)
  }

  // Hàm xuất Excel cho sự kiện chi tiết
  const handleExportEventToExcel = async () => {
    if (!detailEvent) {
      message.error('Không có dữ liệu để xuất')
      return
    }

    try {
      setExportingExcel(true)

      // Tạo workbook mới
      const wb = XLSX.utils.book_new()

      // Thông tin cơ bản của sự kiện
      const eventInfo = [
        ['BÁO CÁO CHI TIẾT SỰ KIỆN Y TẾ', ''],
        ['', ''],
        ['Mã sự kiện:', detailEvent.medicalEventId],
        ['Thời gian:', dayjs(detailEvent.date).format('DD/MM/YYYY HH:mm')],
        ['Loại sự kiện:', detailEvent.type],
        ['Học sinh:', detailEvent.studentName],
        ['Y tá phụ trách:', detailEvent.nurseName || 'Không có'],
        ['Mô tả:', detailEvent.description || 'Không có'],
        ['Ghi chú:', detailEvent.note || 'Không có'],
        ['', ''],
        ['Báo cáo được tạo lúc:', dayjs().format('DD/MM/YYYY HH:mm:ss')]
      ]

      // Tạo sheet thông tin cơ bản
      const wsInfo = XLSX.utils.aoa_to_sheet(eventInfo)

      // Định dạng cho sheet thông tin
      wsInfo['A1'] = { v: eventInfo[0][0], s: { font: { bold: true, sz: 16 }, alignment: { horizontal: 'center' } } }
      wsInfo['!cols'] = [{ width: 25 }, { width: 30 }]
      // Thêm sheet vào workbook
      XLSX.utils.book_append_sheet(wb, wsInfo, 'Thông tin sự kiện')

      // Tạo sheet thuốc sử dụng nếu có
      // eslint-disable-next-line prettier/prettier
      if (
        detailEvent.medications &&
        detailEvent.medications.$values &&
        detailEvent.medications.$values.length > 0) {
        const medicationData = [
          ['DANH SÁCH THUỐC SỬ DỤNG'],
          [''],
          ['STT', 'Tên thuốc', 'Số lượng sử dụng'],
          ...detailEvent.medications.$values.map((med: any, idx: number) => [
            idx + 1,
            med.name || 'Không rõ tên',
            med.quantityUsed || 0
          ])
        ]

        const wsMedications = XLSX.utils.aoa_to_sheet(medicationData)
        wsMedications['A1'] = { v: medicationData[0][0], s: { font: { bold: true, sz: 14 } } }
        XLSX.utils.book_append_sheet(wb, wsMedications, 'Thuốc sử dụng')
      }

      // Tạo sheet vật tư y tế nếu có
      if (
        detailEvent.medicalSupplies &&
        detailEvent.medicalSupplies.$values &&
        detailEvent.medicalSupplies.$values.length > 0
      ) {
        const suppliesData = [
          ['DANH SÁCH VẬT TƯ Y TẾ SỬ DỤNG'],
          [''],
          ['STT', 'Tên vật tư', 'Số lượng sử dụng'],
          ...detailEvent.medicalSupplies.$values.map((supply: any, index: number) => [
            index + 1,
            supply.name || 'Không rõ tên',
            supply.quantityUsed || 0
          ])
        ]

        const wsSupplies = XLSX.utils.aoa_to_sheet(suppliesData)
        wsSupplies['A1'] = { v: suppliesData[0][0], s: { font: { bold: true, sz: 14 } } }
        XLSX.utils.book_append_sheet(wb, wsSupplies, 'Vật tư y tế')
      }

      // Tạo tên file
      const fileName = `SuKienYTe_${detailEvent.studentName}_${dayjs(detailEvent.date).format('DDMMYYYY_HHmm')}.xlsx`

      // Xuất file
      XLSX.writeFile(wb, fileName)

      message.success('Xuất Excel thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      message.error('Có lỗi xảy ra khi xuất Excel')
    } finally {
      setExportingExcel(false)
    }
  }

  // Lọc dữ liệu theo search và filter
  const filteredData = medicalEvents.filter((event) => {
    const matchesSearch = searchText
      ? event.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      event.note?.toLowerCase().includes(searchText.toLowerCase())
      : true
    const matchesType = eventTypeFilter ? event.type === eventTypeFilter : true
    return matchesSearch && matchesType
  })

  // Thống kê
  const todayEvents = medicalEvents.filter((event) => dayjs(event.date).isSame(dayjs(), 'day')).length
  const thisWeekEvents = medicalEvents.filter((event) => dayjs(event.date).isSame(dayjs(), 'week')).length

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Sốt: 'volcano',
      'Tai nạn': 'red',
      'Dịch bệnh': 'orange',
      Khác: 'blue'
    }
    return colors[type] || 'default'
  }

  const columns: ColumnsType<MedicalEvent> = [
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Thời gian</span>
        </Space>
      ),
      dataIndex: 'date',
      key: 'date',
      width: 160,
      render: (date: string) => (
        <Space direction='vertical' size='small'>
          <Text strong>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type='secondary'>{dayjs(date).format('HH:mm')}</Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => <Tag color={getEventTypeColor(type)}>{type}</Tag>,
      filters: [
        { text: 'Sốt', value: 'Sốt' },
        { text: 'Tai nạn', value: 'Tai nạn' },
        { text: 'Dịch bệnh', value: 'Dịch bệnh' },
        { text: 'Khác', value: 'Khác' }
      ],
      onFilter: (value, record) => record.type === value
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Học sinh</span>
        </Space>
      ),
      dataIndex: 'studentName',
      key: 'studentName',
      width: 150,
      render: (name: string) => <Text strong>{name}</Text>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false
      },
      render: (description: string) => (
        <Tooltip placement='topLeft' title={description}>
          <Text>{description}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      ellipsis: {
        showTitle: false
      },
      render: (note: string) => (
        <Tooltip placement='topLeft' title={note}>
          <Text type='secondary'>{note}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title='Xem chi tiết'>
            <Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title='Xóa'>
            <Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.medicalEventId)} />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '2px', maxWidth: 1400, margin: '0 auto' }}>
      <Space direction='vertical' style={{ width: '100%' }} size='large'>
        {/* Header */}
        <Card style={{ background: 'linear-gradient(135deg, #06b6d4 100%)' }}>
          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                <MedicineBoxOutlined style={{ marginRight: 12 }} />
                Quản lý báo cáo sự kiện y tế
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Theo dõi và quản lý các sự kiện y tế của học sinh</Text>
            </Col>
            <Col>
              <Button
                type='primary'
                size='large'
                icon={<PlusOutlined />}
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {showCreateForm ? 'Ẩn form' : 'Tạo báo cáo mới'}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Thống kê */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title='Sự kiện hôm nay'
                value={todayEvents}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title='Sự kiện tuần này'
                value={thisWeekEvents}
                prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title='Tổng sự kiện'
                value={medicalEvents.length}
                prefix={<MedicineBoxOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Form tạo mới */}
        {showCreateForm && (
          <Card className='create-event-card'>
            <div className='flex justify-between items-center' style={{ marginBottom: 24 }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                <HeartOutlined style={{ marginRight: 8 }} />
                Tạo báo cáo sự kiện y tế
              </Title>
              <Button className='bg-gray-200' type='text' onClick={() => setShowCreateForm(false)}>
                Ẩn
              </Button>
            </div>
            <CreateEvent
              onSuccess={() => {
                fetchMedicalEvents()
                setShowCreateForm(false)
              }}
            />
          </Card>
        )}

        {/* Bảng dữ liệu */}
        <Card>
          <Space direction='vertical' style={{ width: '100%' }} size='middle'>
            <Row justify='space-between' align='middle'>
              <Col>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  <HeartOutlined style={{ marginRight: 8 }} />
                  Danh sách báo cáo sự kiện y tế
                </Title>
                <Text type='secondary'>Tổng cộng {filteredData.length} sự kiện</Text>
              </Col>
            </Row>

            {/* Bộ lọc và tìm kiếm */}
            <Card size='small' style={{ backgroundColor: '#fafafa' }}>
              <Row gutter={[16, 16]} align='middle'>
                <Col xs={24} sm={8}>
                  <Search
                    placeholder='Tìm kiếm theo tên học sinh, mô tả...'
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Select
                    value={sortOrder}
                    style={{ width: '100%' }}
                    onChange={(val) => setSortOrder(val)}
                    suffixIcon={sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
                    options={[
                      { value: 'desc', label: 'Thời gian: Mới nhất' },
                      { value: 'asc', label: 'Thời gian: Cũ nhất' }
                    ]}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Select
                    allowClear
                    placeholder='Lọc theo loại sự kiện'
                    style={{ width: '100%' }}
                    value={eventTypeFilter}
                    onChange={(val) => setEventTypeFilter(val)}
                    suffixIcon={<FilterOutlined />}
                    options={[
                      { value: 'Sốt', label: '🌡️ Sốt' },
                      { value: 'Tai nạn', label: '⚠️ Tai nạn' },
                      { value: 'Dịch bệnh', label: '🦠 Dịch bệnh' },
                      { value: 'Khác', label: '📋 Khác' }
                    ]}
                  />
                </Col>
                <Col xs={24} sm={4}>
                  <Text type='secondary'>
                    <FilterOutlined /> {filteredData.length} kết quả
                  </Text>
                </Col>
              </Row>
            </Card>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey='medicalEventId'
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sự kiện`
              }}
              locale={{
                emptyText: <Empty description='Không có sự kiện y tế nào' />
              }}
            />
          </Space>
        </Card>

        {/* Modal chi tiết */}
        <Modal
          title={
            <Space>
              <EyeOutlined />
              <span>Chi tiết sự kiện y tế</span>
            </Space>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={900}
          footer={[
            <Button
              key='export'
              type='primary'
              icon={<FileExcelOutlined />}
              loading={exportingExcel}
              onClick={handleExportEventToExcel}
              style={{ background: '#f40505' }}
            >
              <DownloadOutlined /> Xuất Excel
            </Button>,
            <Button key='close' onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>
          ]}
        >
          {detailEvent ? (
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <Alert
                message={`Sự kiện: ${detailEvent.type}`}
                description={`Thời gian: ${dayjs(detailEvent.date).format('DD/MM/YYYY HH:mm')}`}
                type='info'
                showIcon
              />

              <Descriptions title='Thông tin chi tiết' bordered column={2}>
                <Descriptions.Item label='Thời gian' span={2}>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>{dayjs(detailEvent.date).format('DD/MM/YYYY HH:mm')}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Loại sự kiện'>
                  <Tag color={getEventTypeColor(detailEvent.type)}>{detailEvent.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Học sinh'>
                  <Space>
                    <UserOutlined />
                    <Text strong>{detailEvent.studentName}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Y tá phụ trách' span={2}>
                  {detailEvent.nurseName}
                </Descriptions.Item>
                <Descriptions.Item label='Mô tả' span={2}>
                  <Card size='small' style={{ backgroundColor: '#fafafa' }}>
                    <Text>{detailEvent.description}</Text>
                  </Card>
                </Descriptions.Item>
                <Descriptions.Item label='Ghi chú' span={2}>
                  <Card size='small' style={{ backgroundColor: '#fafafa' }}>
                    <Text>{detailEvent.note}</Text>
                  </Card>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title='Thuốc sử dụng' size='small'>
                    {detailEvent.medications &&
                      detailEvent.medications.$values &&
                      detailEvent.medications.$values.length > 0 ? (
                      <Space direction='vertical' style={{ width: '100%' }}>
                        {detailEvent.medications.$values.map((med: any, idx: number) => (
                          <Card key={idx} size='small' style={{ backgroundColor: '#f6ffed' }}>
                            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <Text strong>{med.name || 'Tên thuốc'}</Text>
                              {med.quantityUsed && <Badge count={med.quantityUsed} showZero />}
                            </Space>
                          </Card>
                        ))}
                      </Space>
                    ) : (
                      <Empty description='Không sử dụng thuốc' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card title='Vật tư y tế sử dụng' size='small'>
                    {detailEvent.medicalSupplies &&
                      detailEvent.medicalSupplies.$values &&
                      detailEvent.medicalSupplies.$values.length > 0 ? (
                      <Space direction='vertical' style={{ width: '100%' }}>
                        {detailEvent.medicalSupplies.$values.map((sup: any, idx: number) => (
                          <Card key={idx} size='small' style={{ backgroundColor: '#fff7e6' }}>
                            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <Text strong>{sup.name || 'Tên vật tư'}</Text>
                              {sup.quantityUsed && <Badge count={sup.quantityUsed} showZero />}
                            </Space>
                          </Card>
                        ))}
                      </Space>
                    ) : (
                      <Empty description='Không sử dụng vật tư' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Card>
                </Col>
              </Row>
            </Space>
          ) : (
            <Empty description='Không có dữ liệu' />
          )}
        </Modal>

        {/* Modal cập nhật */}
        {selectedEvent && (
          <UpdateEvent
            eventId={selectedEvent.medicalEventId}
            visible={isUpdateModalVisible}
            onCancel={() => {
              setIsUpdateModalVisible(false)
              setSelectedEvent(null)
            }}
            onSuccess={() => {
              setIsUpdateModalVisible(false)
              setSelectedEvent(null)
              fetchMedicalEvents()
            }}
          />
        )}
      </Space>
    </div>
  )
}

export default MedicalReport
