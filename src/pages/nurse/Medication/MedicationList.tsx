import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm, Input, Select, DatePicker, Card, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { getAllMedications, deleteMedication } from '../../../apis/medication.api'
import type { Medication } from '../../../apis/medication.api'
import CreateMedication from './Create'
import UpdateMedication from './Update'
import MedicationDetail from './Detail'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const { Search } = Input

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

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleResetFilters = () => {
    setSearchText('')
    setSelectedType('')
    setSelectedDate(null)
  }

  const medicationTypeMap = medicationTypes.reduce((acc, curr) => {
    acc[curr.value] = curr.label
    return acc
  }, {} as Record<string, string>)

  const columns = [
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Loại thuốc',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => medicationTypeMap[type] || type
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Medication, b: Medication) => a.expiredDate.localeCompare(b.expiredDate)
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Medication) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMedication(record)
              setIsDetailModalVisible(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedMedication(record)
              setIsUpdateModalVisible(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa thuốc này?'
            onConfirm={() => handleDelete(record.medicationId)}
            okText='Có'
            cancelText='Không'
          >
            <Button type='primary' danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='Tìm kiếm theo tên hoặc hướng dẫn sử dụng'
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder='Lọc theo loại thuốc'
              allowClear
              onChange={handleTypeChange}
              value={selectedType || undefined}
              options={medicationTypes}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker
              style={{ width: '100%' }}
              placeholder='Lọc theo ngày hết hạn'
              onChange={handleDateChange}
              value={selectedDate}
              format='DD/MM/YYYY'
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              style={{ width: '100%' }}
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { value: 'desc', label: 'Ngày hết hạn: Gần nhất' },
                { value: 'asc', label: 'Ngày hết hạn: Xa nhất' }
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button onClick={handleResetFilters} style={{ width: '100%' }}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
          Thêm thuốc mới
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredMedications} rowKey='medicationId' loading={loading} />

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
