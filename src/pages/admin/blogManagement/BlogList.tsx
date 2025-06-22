import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/auth.context'
import { Card, Row, Col, Table, Button, Dropdown, message, Modal } from 'antd'
import { FileTextOutlined, MoreOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import type { MenuProps } from 'antd'
import blogApi, { type Blog, type CreateBlogRequest } from '../../../apis/blog.api'
import { categoryApi, type Category } from '../../../apis/category.api'
import CreateBlogForm from './Create'
import DeleteBlog from './Delete'

function BlogList() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [categories] = useState<Category[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const { user } = useAuth()

  const fetchBlogs = async () => {
    if (!categoryId) return
    try {
      setLoading(true)
      const response = await categoryApi.getCategoryById(parseInt(categoryId))
      console.log('Category Response:', response.data)
      if (response.data) {
        setCurrentCategory(response.data)
        if (response.data.blogs && response.data.blogs.$values) {
          setBlogs(response.data.blogs.$values)
          setCategoryName(response.data.name || '')
        } else {
          setBlogs([])
          setCategoryName('Không tìm thấy danh mục')
        }
      }
    } catch (error) {
      console.error('Error fetching blogs by category:', error)
      setBlogs([])
      setCategoryName('Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(user)
    fetchBlogs()
  }, [categoryId])

  const handleViewDetail = (record: Blog) => {
    if (user?.roleName === 'Nurse') {
      navigate(`/nurse/blog-detail/${record.blogID}`)
    } else if (user?.roleName === 'Admin') {
      navigate(`/admin/blog-detail/${record.blogID}`)
    }
  }

  const handleDelete = (record: Blog) => {
    setSelectedBlog(record)
    setDeleteModalVisible(true)
  }

  const handleDeleteSuccess = () => {
    setDeleteModalVisible(false)
    setSelectedBlog(null)
    fetchBlogs()
  }

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false)
    setSelectedBlog(null)
  }

  const getDropdownItems = (record: Blog): MenuProps['items'] => [
    {
      key: 'view',
      label: 'Xem chi tiết',
      onClick: () => handleViewDetail(record)
    },
    {
      key: 'delete',
      label: 'Xóa',
      danger: true,
      onClick: () => handleDelete(record)
    }
  ]

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Blog) => (
        <Dropdown menu={{ items: getDropdownItems(record) }} trigger={['click']}>
          <Button type='text' icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancelModal = () => {
    setIsModalVisible(false)
  }

  const handleCreateBlogSubmit = async (values: CreateBlogRequest) => {
    setIsCreating(true)
    try {
      const response = await blogApi.createBlog(values)
      if (response.data) {
        message.success('Tạo blog thành công!')
        handleCancelModal()
        fetchBlogs()
      } else {
        console.log('Tạo blog thất bại: Không nhận được dữ liệu phản hồi.')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Quản lý Blog</h1>
      <div className='flex justify-end items-end mb-6 -mt-7 mr-6'>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>

      <Row gutter={16} className='mb-6'>
        <Col span={12}>
          <Card>
            <div className='flex items-center'>
              <FileTextOutlined className='text-3xl text-blue-500 mr-4' />
              <div>
                <p className='text-gray-500'>Tổng số bài viết</p>
                <h2 className='text-2xl font-bold'>{blogs.length}</h2>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <div className='flex justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Danh sách bài viết theo danh mục: {categoryName}</h2>
          <Button type='primary' onClick={showModal}>
            Thêm bài viết mới
          </Button>
        </div>
        <Table columns={columns} dataSource={blogs} loading={loading} rowKey='id' />
      </Card>

      <Modal title='Thêm bài viết mới' visible={isModalVisible} onCancel={handleCancelModal} footer={null} width={800}>
        <CreateBlogForm
          categories={categories}
          onSubmit={handleCreateBlogSubmit}
          loading={isCreating}
          initialCategory={currentCategory}
        />
      </Modal>

      <DeleteBlog
        blog={selectedBlog}
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

export default BlogList
