import { useEffect, useState } from 'react'
import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { categoryApi, Category } from '../../../apis/category.api'
import { useNavigate } from 'react-router-dom'
import path from '../../../constants/path'

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getAllCategories()
      console.log(response)
      setCategories(response.data.$values)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
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
                  navigate(path.BLOG_LIST_BY_CATEGORY.replace(':categoryId', categoryId.toString()));
                } else {
                  console.error('Cannot navigate: Invalid category ID', record);
                }
              }}
              disabled={typeof categoryId !== 'number'}
            >
              Xem chi tiết
            </Button>
            <Button danger>Xóa</Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <Button type='primary'> + Thêm danh mục mới</Button>
      </div>
      <Table columns={columns} dataSource={categories} rowKey='categoryID' loading={loading} />
    </div>
  )
}

export default CategoryList
