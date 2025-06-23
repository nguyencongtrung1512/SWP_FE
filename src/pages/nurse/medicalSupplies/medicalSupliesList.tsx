import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm, message, Input, Select, DatePicker, Card, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import medicalSupplyApi from '../../../apis/medicalSupply'
import type { MedicalSupply } from '../../../apis/medicalSupply'
import CreateMedicalSupply from './Create'
import UpdateMedicalSupply from './Update'
import MedicalSupplyDetail from './Detail'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const { Search } = Input

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

    setFilteredMedicalSupplies(result)
  }, [medicalSupplies, searchText, selectedType, selectedDate])

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

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleResetFilters = () => {
    setSearchText('')
    setSelectedType('')
    setSelectedDate(null)
  }

  const columns = [
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Loại vật tư',
      dataIndex: 'type',
      key: 'type'
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
      render: (date: string) => {
        if (!date) {
          return '-'
        }
        const parsedDate = dayjs(date)
        if (!parsedDate.isValid()) {
          return '-'
        }
        return parsedDate.format('DD/MM/YYYY')
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: MedicalSupply) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMedicalSupply(record)
              setIsDetailModalVisible(true)
            }}
          >
            Chi tiết
          </Button>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedMedicalSupply(record)
              setIsUpdateModalVisible(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa vật tư này?'
            onConfirm={() => handleDelete(record.$id!)}
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

  const uniqueTypes = Array.from(new Set(medicalSupplies.map((supply) => supply.type)))

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='Tìm kiếm theo tên hoặc mô tả'
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
              placeholder='Lọc theo loại vật tư'
              allowClear
              onChange={handleTypeChange}
              value={selectedType || undefined}
              options={uniqueTypes.map((type) => ({ label: type, value: type }))}
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
            <Button onClick={handleResetFilters} style={{ width: '100%' }}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
          Thêm vật tư mới
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredMedicalSupplies} rowKey='$id' loading={loading} />

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
