import { useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { categoryApi, Category } from '../../../apis/category.api'
import { useNavigate } from 'react-router-dom'
import path from '../../../constants/path'
import CreateCategoryModal from './create'
import UpdateCategoryModal from './update'
import { toast } from 'react-toastify'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const navigate = useNavigate()

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getAllCategories()
      setCategories(response.data.$values)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId: number) => {
    try {
      await categoryApi.deleteCategoryById(categoryId)
      toast.success('Xóa danh mục thành công')
      fetchCategories() // Reload lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleUpdateClick = (record: Category) => {
    setCurrentCategory(record)
    setIsUpdateModalOpen(true)
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: Category) => {
        const categoryId = record?.categoryID
        return (
          <Space size='middle'>
            <Button
              type='primary'
              onClick={() => {
                if (typeof categoryId === 'number') {
                  navigate(path.BLOG_LIST_BY_CATEGORY.replace(':categoryId', categoryId.toString()))
                } else {
                  console.error('Cannot navigate: Invalid category ID', record)
                }
              }}
              disabled={typeof categoryId !== 'number'}
            >
              Xem chi tiết
            </Button>
            <Button onClick={() => handleUpdateClick(record)}>Cập nhật</Button>
            <Popconfirm
              title='Xóa danh mục'
              description='Bạn có chắc chắn muốn xóa danh mục này?'
              onConfirm={() => categoryId && handleDelete(categoryId)}
              okText='Xóa'
              cancelText='Hủy'
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <Button type='primary' onClick={() => setIsCreateModalOpen(true)}>
          + Thêm danh mục mới
        </Button>
      </div>
      <Table columns={columns} dataSource={categories} rowKey='categoryID' loading={loading} />

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCategories}
      />
      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchCategories}
        currentCategory={currentCategory}
      />
    </div>
  )
}

export default CategoryList
