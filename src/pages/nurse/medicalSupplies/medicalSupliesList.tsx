import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
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
  MedicineBoxOutlined,
  DownloadOutlined,
  FilterOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import medicalSupplyApi from '../../../apis/medicalSupply.api'
import type { MedicalSupply } from '../../../apis/medicalSupply.api'
import CreateMedicalSupply from './Create'
import UpdateMedicalSupply from './Update'
import MedicalSupplyDetail from './Detail'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

const { Search } = Input
const { Title, Text } = Typography

const MedicalSuppliesList: React.FC = () => {
  const [medicalSupplies, setMedicalSupplies] = useState<MedicalSupply[]>([])
  const [filteredMedicalSupplies, setFilteredMedicalSupplies] = useState<MedicalSupply[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedMedicalSupply, setSelectedMedicalSupply] = useState<MedicalSupply | null>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const fetchMedicalSupplies = async () => {
    try {
      setLoading(true)
      const response = await medicalSupplyApi.getAll()
      setMedicalSupplies((response.data as { $values: MedicalSupply[] }).$values)
      setFilteredMedicalSupplies((response.data as { $values: MedicalSupply[] }).$values)
    } catch (error) {
      console.error('Error fetching medical supplies:', error)
      message.error('Có lỗi xảy ra khi tải danh sách vật tư y tế!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicalSupplies()
  }, [])

  useEffect(() => {
    let result = [...medicalSupplies]

    if (searchText) {
      result = result.filter(
        (supply) =>
          supply.name.toLowerCase().includes(searchText.toLowerCase()) ||
          supply.description.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (selectedType) {
      result = result.filter((supply) => supply.type === selectedType)
    }

    if (selectedDate) {
      result = result.filter((supply) => dayjs(supply.expiredDate).isSame(selectedDate, 'day'))
    }

    result = result.sort((a, b) => {
      const dateA = new Date(a.expiredDate).getTime()
      const dateB = new Date(b.expiredDate).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    setFilteredMedicalSupplies(result)
  }, [medicalSupplies, searchText, selectedType, selectedDate, sortOrder])

  const handleDelete = async (id: number) => {
    try {
      await medicalSupplyApi.delete(id)
      toast.success('Xóa vật tư y tế thành công!')
      fetchMedicalSupplies()
    } catch (error) {
      console.error('Error deleting medical supply:', error)
      message.error('Có lỗi xảy ra khi xóa vật tư y tế!')
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }

  // const handleDateChange = (date: dayjs.Dayjs | null) => {
  //   setSelectedDate(date)
  // }

  const handleResetFilters = () => {
    setSearchText('')
    setSelectedType('')
    setSelectedDate(null)
  }

  // Hàm xuất Excel
  const exportToExcel = () => {
    try {
      const dataToExport = filteredMedicalSupplies.map((supply, index) => ({
        STT: index + 1,
        'Tên vật tư': supply.name,
        'Loại vật tư': supply.type,
        'Số lượng': supply.quantity,
        'Mô tả': supply.description || 'N/A',
        'Ngày hết hạn': supply.expiredDate ? dayjs(supply.expiredDate).format('DD/MM/YYYY') : ' - '
      }))

      const ws = XLSX.utils.json_to_sheet(dataToExport)

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 15 }]
      ws['!cols'] = colWidths

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách vật tư y tế')

      const fileName = `Danh_sach_vat_tu_y_te_${dayjs().format('DD-MM-YYYY_HH-mm-ss')}.xlsx`
      XLSX.writeFile(wb, fileName)

      toast.success('Xuất file Excel thành công!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất file Excel!')
    }
  }

  // Kiểm tra vật tư sắp hết hạn (dưới 30 ngày)
  const isExpiringSoon = (expiredDate: string) => {
    if (!expiredDate) return false
    const daysUntilExpiry = dayjs(expiredDate).diff(dayjs(), 'day')
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  // Kiểm tra vật tư đã hết hạn
  const isExpired = (expiredDate: string) => {
    if (!expiredDate) return false
    return dayjs(expiredDate).isBefore(dayjs(), 'day')
  }

  // Tính toán thống kê
  const totalSupplies = medicalSupplies.length
  const validSupplies = medicalSupplies.filter(
    (s) => !isExpired(s.expiredDate) && !isExpiringSoon(s.expiredDate)
  ).length
  const expiringSoonSupplies = medicalSupplies.filter((s) => isExpiringSoon(s.expiredDate)).length
  const expiredSupplies = medicalSupplies.filter((s) => isExpired(s.expiredDate)).length

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, __: MedicalSupply, index: number) => (
        <span className='font-semibold text-gray-600'>{index + 1}</span>
      )
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => <span className='font-semibold text-gray-800'>{name}</span>
    },
    {
      title: 'Loại vật tư',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <Tag color='cyan' className='rounded-lg font-medium'>
          {type}
        </Tag>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center' as const,
      render: (quantity: number) => <span className='font-bold text-cyan-600 text-lg'>{quantity}</span>
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 150,
      render: (date: string) => {
        if (!date) {
          return (
            <Tag color='default' className='rounded-lg font-medium'>
              Không có
            </Tag>
          )
        }
        const parsedDate = dayjs(date)
        if (!parsedDate.isValid()) {
          return (
            <Tag color='default' className='rounded-lg font-medium'>
              Không hợp lệ
            </Tag>
          )
        }

        const formattedDate = parsedDate.format('DD/MM/YYYY')

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
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 280,
      render: (_: unknown, record: MedicalSupply) => (
        <Space size='small' className='flex flex-wrap'>
          <Tooltip title='Xem chi tiết'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              size='small'
              onClick={() => {
                setSelectedMedicalSupply(record)
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
                setSelectedMedicalSupply(record)
                setIsUpdateModalVisible(true)
              }}
              className='rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600'
            >
              Sửa
            </Button>
          </Tooltip>
          <Popconfirm
            title='Xóa vật tư y tế'
            description='Bạn có chắc chắn muốn xóa vật tư này?'
            onConfirm={() => handleDelete(record.medicalSupplyId)}
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

  const uniqueTypes = Array.from(new Set(medicalSupplies.map((supply) => supply.type)))

  return (
    <div style={{ padding: '2px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ background: 'linear-gradient(135deg, #06b6d4 100%)' }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              <MedicineBoxOutlined style={{ marginRight: 12 }} />
              Quản lý vật tư y tế
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
              title={<span className='text-gray-600 font-medium'>Tổng số vật tư</span>}
              value={totalSupplies}
              valueStyle={{ color: '#06b6d4', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Còn hạn sử dụng</span>}
              value={validSupplies}
              valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Sắp hết hạn</span>}
              value={expiringSoonSupplies}
              valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className='rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
            <Statistic
              title={<span className='text-gray-600 font-medium'>Đã hết hạn</span>}
              value={expiredSupplies}
              valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className='rounded-xl shadow-lg border-0 mb-6'>
        <div className='flex items-center mb-4'>
          <FilterOutlined className='text-cyan-600 mr-2' />
          <Title level={4} className='!mb-0 text-gray-800'>
            Bộ lọc tìm kiếm
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='Tìm kiếm theo tên hoặc mô tả'
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
              placeholder='Lọc theo loại vật tư'
              allowClear
              onChange={handleTypeChange}
              value={selectedType || undefined}
              options={uniqueTypes.map((type) => ({ label: type, value: type }))}
            />
          </Col>
          {/* <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              className='w-full rounded-lg'
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
              className='w-full rounded-lg hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300'
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
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              // className='bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-lg font-semibold px-6 py-2 h-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
              size='large'
            >
              Thêm vật tư mới
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              // className='bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 rounded-lg font-semibold px-6 py-2 h-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5'
              size='large'
              disabled={filteredMedicalSupplies.length === 0}
            >
              Xuất Excel ({filteredMedicalSupplies.length})
            </Button>
          </Space>
          <div className='text-gray-600 font-medium'>
            Hiển thị <span className='text-cyan-600 font-bold'>{filteredMedicalSupplies.length}</span> /{' '}
            <span className='text-cyan-600 font-bold'>{medicalSupplies.length}</span> vật tư
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className='rounded-xl shadow-lg border-0'>
        <Table
          columns={columns}
          dataSource={filteredMedicalSupplies}
          rowKey='medicalSupplyId'
          loading={loading}
          className='rounded-lg overflow-hidden'
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className='text-gray-600'>
                <span className='font-semibold text-cyan-600'>
                  {range[0]}-{range[1]}
                </span>{' '}
                của <span className='font-semibold text-cyan-600'>{total}</span> vật tư
              </span>
            ),
            pageSizeOptions: ['10', '20', '50', '100'],
            className: 'px-4 py-4'
          }}
          scroll={{ x: 1000 }}
          rowClassName='hover:bg-cyan-50 transition-colors duration-200'
        />
      </Card>

      {/* Modals */}
      <CreateMedicalSupply
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false)
          fetchMedicalSupplies()
        }}
      />

      <UpdateMedicalSupply
        isModalVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setSelectedMedicalSupply(null)
        }}
        onSuccess={() => {
          setIsUpdateModalVisible(false)
          setSelectedMedicalSupply(null)
          fetchMedicalSupplies()
        }}
        selectedMedicalSupply={selectedMedicalSupply}
      />

      <MedicalSupplyDetail
        isModalVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedMedicalSupply(null)
        }}
        medicalSupply={selectedMedicalSupply}
      />
    </div>
  )
}

export default MedicalSuppliesList
