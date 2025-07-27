import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/auth.context'
import { Table, Button, Space, Popconfirm, Input, Card, Row, Col, Switch, Tooltip } from 'antd'
import {
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { categoryApi, type Category } from '../../../apis/category.api'
import { useNavigate } from 'react-router-dom'
import CreateCategoryModal from './create'
import UpdateCategoryModal from './update'
import { toast } from 'react-toastify'

type ViewMode = 'table' | 'card'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const navigate = useNavigate()
  const { user } = useAuth()

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getAllCategories()
      setCategories(response.data.$values)
      setFilteredCategories(response.data.$values)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (!value.trim()) {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter((category) => category.name?.toLowerCase().includes(value.toLowerCase()))
      setFilteredCategories(filtered)
    }
  }

  const handleDelete = async (categoryId: number) => {
    try {
      await categoryApi.deleteCategoryById(categoryId)
      toast.success('Xóa danh mục thành công')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleUpdateClick = (record: Category) => {
    setCurrentCategory(record)
    setIsUpdateModalOpen(true)
  }

  const handleViewDetail = (record: Category) => {
    const categoryId = record?.categoryID
    if (typeof categoryId === 'number') {
      if (user?.roleName === 'Nurse') {
        navigate(`/nurse/category/${categoryId}/blogs`)
      } else if (user?.roleName === 'Admin') {
        navigate(`/admin/category/${categoryId}/blogs`)
      }
    } else {
      console.error('Cannot navigate: Invalid category ID', record)
    }
  }

  const handleModalSuccess = () => {
    fetchCategories()
    setSearchText('')
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const columns: ColumnsType<Category> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: Category) => {
        const categoryId = record?.categoryID
        return (
          <Space size='middle'>
            <Tooltip title='Xem chi tiết'>
              <Button
                type='primary'
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
                disabled={typeof categoryId !== 'number'}
              >
                Xem chi tiết
              </Button>
            </Tooltip>
            <Tooltip title='Cập nhật'>
              <Button icon={<EditOutlined />} onClick={() => handleUpdateClick(record)}>
                Cập nhật
              </Button>
            </Tooltip>
            <Popconfirm
              title='Xóa danh mục'
              description='Bạn có chắc chắn muốn xóa danh mục này?'
              onConfirm={() => categoryId && handleDelete(categoryId)}
              okText='Xóa'
              cancelText='Hủy'
            >
              <Tooltip title='Xóa'>
                <Button danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const renderTableView = () => (
    <Table
      columns={columns}
      dataSource={filteredCategories}
      rowKey='categoryID'
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      scroll={{ x: 800 }}
    />
  )

  const renderCardView = () => (
    <Row gutter={[16, 16]} style={{ minHeight: loading ? '200px' : 'auto' }}>
      {loading ? (
        // Loading skeleton cards
        Array.from({ length: 6 }).map((_, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card loading={true} />
          </Col>
        ))
      ) : filteredCategories.length === 0 ? (
        <Col span={24}>
          <div className='text-center py-8'>
            <p className='text-gray-500 text-lg'>Không tìm thấy danh mục nào</p>
          </div>
        </Col>
      ) : (
        filteredCategories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category.categoryID}>
            <Card
              hoverable
              className='h-full'
              actions={[
                <Tooltip title='Xem chi tiết' key='view'>
                  <EyeOutlined
                    onClick={() => handleViewDetail(category)}
                    className='text-blue-500 hover:text-blue-700'
                  />
                </Tooltip>,
                <Tooltip title='Cập nhật' key='edit'>
                  <EditOutlined
                    onClick={() => handleUpdateClick(category)}
                    className='text-green-500 hover:text-green-700'
                  />
                </Tooltip>,
                <Tooltip title='Xóa' key='delete'>
                  <Popconfirm
                    title='Xóa danh mục'
                    description='Bạn có chắc chắn muốn xóa danh mục này?'
                    onConfirm={() => category.categoryID && handleDelete(category.categoryID)}
                    okText='Xóa'
                    cancelText='Hủy'
                  >
                    <DeleteOutlined className='text-red-500 hover:text-red-700' />
                  </Popconfirm>
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={
                  <div className='text-center'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>{category.name}</h3>
                  </div>
                }
                description={
                  <div className='text-center'>
                    <p className='text-gray-500 text-sm'>ID: {category.categoryID}</p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))
      )}
    </Row>
  )

  return (
    <div className='p-4'>
      {/* Header Section */}
      <div className='mb-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          {/* Search Section */}
          <div className='flex items-center gap-2'>
            <Input.Search
              placeholder='Tìm kiếm danh mục...'
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              allowClear
              size='large'
            />
          </div>

          {/* Actions Section */}
          <div className='flex items-center gap-4'>
            {/* View Mode Toggle */}
            <div className='flex items-center gap-2 bg-gray-50 p-2 rounded-lg'>
              <UnorderedListOutlined className={viewMode === 'table' ? 'text-blue-500' : 'text-gray-400'} />
              <Switch
                checked={viewMode === 'card'}
                onChange={(checked) => setViewMode(checked ? 'card' : 'table')}
                size='small'
              />
              <AppstoreOutlined className={viewMode === 'card' ? 'text-blue-500' : 'text-gray-400'} />
            </div>

            <Button type='primary' size='large' onClick={() => setIsCreateModalOpen(true)} className='shadow-md'>
              + Thêm danh mục mới
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className='mt-4 flex items-center gap-4 text-sm text-gray-600'>
          <span>
            Tổng số danh mục: <strong>{categories.length}</strong>
          </span>
          {searchText && (
            <span>
              Kết quả tìm kiếm: <strong>{filteredCategories.length}</strong>
            </span>
          )}
          <span>
            Chế độ xem: <strong>{viewMode === 'table' ? 'Danh sách' : 'Thẻ'}</strong>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className='bg-white rounded-lg shadow-sm'>{viewMode === 'table' ? renderTableView() : renderCardView()}</div>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleModalSuccess}
        currentCategory={currentCategory}
      />
    </div>
  )
}

export default CategoryList
