import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Statistic
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  ClearOutlined,
  MedicineBoxOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { getAllMedications, deleteMedication } from '../../../apis/medication.api'
import type { Medication } from '../../../apis/medication.api'
import CreateMedication from './Create'
import UpdateMedication from './Update'
import MedicationDetail from './Detail'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

const { Search } = Input
const { Title, Text } = Typography

const medicationTypes = [
  { label: 'Viên nén', value: 'Tablet' },
  { label: 'Viên nang', value: 'Capsule' },
  { label: 'Dung dịch', value: 'Solution' },
  { label: 'Bột', value: 'Powder' },
  { label: 'Siro', value: 'Syrup' },
  { label: 'Kem', value: 'Cream' },
  { label: 'Thuốc mỡ', value: 'Ointment' },
  { label: 'Thuốc tiêm', value: 'Injection' },
  { label: 'Nhỏ mắt', value: 'Eye drops' },
  { label: 'Khác', value: 'Other' }
]

const MedicationList: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([])
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const fetchMedications = async () => {
    try {
      setLoading(true)
      const response = await getAllMedications()
      setMedications(response.data.$values)
      setFilteredMedications(response.data.$values)
    } catch (error) {
      console.error('Error fetching medications:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách thuốc!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  useEffect(() => {
    let result = [...medications]

    if (searchText) {
      result = result.filter(
        (medication) =>
          medication.name.toLowerCase().includes(searchText.toLowerCase()) ||
          medication.usage.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (selectedType) {
      result = result.filter((medication) => medication.type === selectedType)
    }

    if (selectedDate) {
      result = result.filter((medication) => dayjs(medication.expiredDate).isSame(selectedDate, 'day'))
    }

    result = result.sort((a, b) => {
      const dateA = new Date(a.expiredDate).getTime()
      const dateB = new Date(b.expiredDate).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    setFilteredMedications(result)
  }, [medications, searchText, selectedType, selectedDate, sortOrder])

  const handleDelete = async (id: number) => {
    try {
      await deleteMedication(id)
      toast.success('Xóa thuốc thành công!')
      fetchMedications()
    } catch (error) {
      console.error('Error deleting medication:', error)
      toast.error('Có lỗi xảy ra khi xóa thuốc!')
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }

  const handleResetFilters = () => {
    setSearchText('')
    setSelectedType('')
    setSelectedDate(null)
  }

  // Hàm xuất Excel
  const exportToExcel = () => {
    try {
      const medicationTypeMap = medicationTypes.reduce(
        (acc, curr) => {
          acc[curr.value] = curr.label
          return acc
        },
        {} as Record<string, string>
      )

      const dataToExport = filteredMedications.map((medication, index) => ({
        STT: index + 1,
        'Tên thuốc': medication.name,
        'Loại thuốc': medicationTypeMap[medication.type] || medication.type,
        'Số lượng': medication.quantity,

        'Hướng dẫn sử dụng': medication.usage,
        'Ngày hết hạn': dayjs(medication.expiredDate).format('DD/MM/YYYY')
      }))

      const ws = XLSX.utils.json_to_sheet(dataToExport)

      const colWidths = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 15 }]
      ws['!cols'] = colWidths

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách thuốc')

      const fileName = `Danh_sach_thuoc_${dayjs().format('DD-MM-YYYY_HH-mm-ss')}.xlsx`
      XLSX.writeFile(wb, fileName)

      toast.success('Xuất file Excel thành công!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất file Excel!')
    }
  }

  const medicationTypeMap = medicationTypes.reduce(
    (acc, curr) => {
      acc[curr.value] = curr.label
      return acc
    },
    {} as Record<string, string>
  )

  const isExpiringSoon = (expiredDate: string) => {
    const daysUntilExpiry = dayjs(expiredDate).diff(dayjs(), 'day')
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  const isExpired = (expiredDate: string) => {
    return dayjs(expiredDate).isBefore(dayjs(), 'day')
  }

  // Tính toán thống kê
  const totalMedications = medications.length
  const validMedications = medications.filter((m) => !isExpired(m.expiredDate) && !isExpiringSoon(m.expiredDate)).length
  const expiringSoonMedications = medications.filter((m) => isExpiringSoon(m.expiredDate)).length
  const expiredMedications = medications.filter((m) => isExpired(m.expiredDate)).length

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, __: Medication, index: number) => (
        <span className='font-semibold text-gray-600'>{index + 1}</span>
      )
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => <span className='font-semibold text-gray-800'>{name}</span>
    },
    {
      title: 'Loại thuốc',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color='blue' className='rounded-lg font-medium'>
          {medicationTypeMap[type] || type}
        </Tag>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center' as const,
      render: (quantity: number) => <span className='font-bold text-blue-600 text-lg'>{quantity}</span>
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 150,
      render: (date: string) => {
        const formattedDate = dayjs(date).format('DD/MM/YYYY')

        if (isExpired(date)) {
          return (
            <Tag color='red' className='rounded-lg font-medium animate-pulse'>
              <ExclamationCircleOutlined className='mr-1' />
              {formattedDate}
            </Tag>
          )
        } else if (isExpiringSoon(date)) {
          return (
            <Tag color='orange' className='rounded-lg font-medium'>
              <ClockCircleOutlined className='mr-1' />
              {formattedDate}
            </Tag>
          )
        } else {
          return (
            <Tag color='green' className='rounded-lg font-medium'>
              <CheckCircleOutlined className='mr-1' />
              {formattedDate}
            </Tag>
          )
        }
      },
      sorter: (a: Medication, b: Medication) => a.expiredDate.localeCompare(b.expiredDate)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 280,
      render: (_: unknown, record: Medication) => (
        <Space size='small' className='flex flex-wrap'>
          <Tooltip title='Xem chi tiết'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              size='small'
              onClick={() => {
                setSelectedMedication(record)
                setIsDetailModalVisible(true)
              }}
              className='rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
            >
              Chi tiết
            </Button>
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='default'
              icon={<EditOutlined />}
              size='small'
              onClick={() => {
                setSelectedMedication(record)
                setIsUpdateModalVisible(true)
              }}
              className='rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600'
            >
              Sửa
            </Button>
          </Tooltip>
          <Popconfirm
            title='Xóa thuốc'
            description='Bạn có chắc chắn muốn xóa thuốc này?'
            onConfirm={() => handleDelete(record.medicationId)}
            okText='Có'
            cancelText='Không'
          >
            <Tooltip title='Xóa'>
              <Button
                type='primary'
                danger
                icon={<DeleteOutlined />}
                size='small'
                className='rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
              >
                Xóa
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '2px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ background: 'linear-gradient(135deg,#06b6d4 100%)' }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              <MedicineBoxOutlined style={{ marginRight: 12 }} />
              Quản lý thuốc
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Sử dụng cho học sinh trong nhà trường</Text>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className='mb-6 pt-5'>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Tổng số thuốc</span>}
              value={totalMedications}
              valueStyle={{ color: '#06b6d4', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Còn hạn sử dụng</span>}
              value={validMedications}
              valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Sắp hết hạn</span>}
              value={expiringSoonMedications}
              valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Đã hết hạn</span>}
              value={expiredMedications}
              valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className='rounded-xl shadow-lg border-0 mb-6'>
        <div className='flex items-center mb-4'>
          <FilterOutlined className='text-blue-600 mr-2' />
          <Title level={4} className='!mb-0 text-gray-800'>
            Bộ lọc tìm kiếm
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='Tìm kiếm theo tên hoặc hướng dẫn sử dụng'
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              className='rounded-lg'
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              className='w-full rounded-lg'
              placeholder='Lọc theo loại thuốc'
              allowClear
              onChange={handleTypeChange}
              value={selectedType || undefined}
              options={medicationTypes}
            />
          </Col>
          {/* <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              className="w-full rounded-lg"
              placeholder='Lọc theo ngày hết hạn'
              onChange={handleDateChange}
              value={selectedDate}
              format='DD/MM/YYYY'
            />
          </Col> */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              className='w-full rounded-lg'
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { value: 'desc', label: 'Ngày hết hạn: Gần nhất' },
                { value: 'asc', label: 'Ngày hết hạn: Xa nhất' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              onClick={handleResetFilters}
              className='w-full rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300'
              icon={<ClearOutlined />}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Action Buttons */}
      <Card className='rounded-xl shadow-lg border-0 mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <Space size='middle' className='flex-wrap'>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} size='large'>
              Thêm thuốc mới
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              size='large'
              disabled={filteredMedications.length === 0}
            >
              Xuất Excel ({filteredMedications.length})
            </Button>
          </Space>
          <div className='text-gray-600 font-medium'>
            Hiển thị <span className='text-blue-600 font-bold'>{filteredMedications.length}</span> /{' '}
            <span className='text-blue-600 font-bold'>{medications.length}</span> thuốc
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className='rounded-xl shadow-lg border-0'>
        <Table
          columns={columns}
          dataSource={filteredMedications}
          rowKey='medicationId'
          loading={loading}
          className='rounded-lg overflow-hidden'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className='text-gray-600'>
                <span className='font-semibold text-blue-600'>
                  {range[0]}-{range[1]}
                </span>{' '}
                của <span className='font-semibold text-blue-600'>{total}</span> thuốc
              </span>
            ),
            pageSizeOptions: ['10', '20', '50', '100'],
            className: 'px-4 py-4'
          }}
          scroll={{ x: 1000 }}
          rowClassName='hover:bg-blue-50 transition-colors duration-200'
        />
      </Card>

      {/* Modals */}
      <CreateMedication
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false)
          fetchMedications()
        }}
      />

      <UpdateMedication
        isModalVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setSelectedMedication(null)
        }}
        onSuccess={() => {
          setIsUpdateModalVisible(false)
          setSelectedMedication(null)
          fetchMedications()
        }}
        selectedMedication={selectedMedication}
      />

      <MedicationDetail
        isModalVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedMedication(null)
        }}
        medication={selectedMedication}
      />
    </div>
  )
}

export default MedicationList
