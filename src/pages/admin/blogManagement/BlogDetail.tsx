import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Upload, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import blogApi from '../../../apis/blog.api'
import { categoryApi, Category } from '../../../apis/category.api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { RcFile } from 'antd/es/upload'
import { toast } from 'react-toastify'

const { TextArea } = Input

interface BlogData {
  blogID: number
  title: string
  description: string
  content: string
  image: string
  categoryID: number
}

function BlogDetail() {
  const params = useParams()
  console.log('All URL params:', params)
  const id = params.id
  console.log('Extracted id:', id)

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [blogData, setBlogData] = useState<BlogData | null>(null)
  const [categoryName, setCategoryName] = useState<string>('')

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogApi.getBlogById(id!)
      console.log('API Response:', response)
      console.log('Blog data:', response.data)
      console.log('Category from API:', response.data.categoryID)

      if (response.data) {
        const data = {
          blogID: response.data.blogID,
          title: response.data.title,
          description: response.data.description,
          content: response.data.content,
          image: response.data.image,
          categoryID: response.data.categoryID
        }
        console.log('Processed data:', data)
        setBlogData(data)

        try {
          const categoryResponse = await categoryApi.getCategoryById(data.categoryID)
          if (categoryResponse.data) {
            const categoryDetails: Category = categoryResponse.data
            setCategoryName(categoryDetails.name)
          }
        } catch (categoryError) {
          console.error('Error fetching category name:', categoryError)
          setCategoryName('Không xác định')
        }

        form.setFieldsValue({
          title: data.title,
          description: data.description
        })
        setContent(data.content)
        if (data.image) {
          setFileList([
            {
              uid: '-1',
              name: 'existing_image',
              status: 'done',
              url: data.image
            }
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Component mounted with ID:', id)
    if (id) {
      fetchBlog()
    }
  }, [id])

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newList }) => {
    setFileList(newList.slice(-1))
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJpgOrPng) toast.error('Chỉ chấp nhận ảnh JPG/PNG!')
    if (!isLt2M) toast.error('Ảnh phải nhỏ hơn 2MB!')

    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE
  }

  const handleSubmit = async (values: { title: string; description?: string }) => {
    if (!content || content.trim() === '') {
      toast.error('Nội dung không được để trống!')
      return
    }
    if (!id || !blogData) {
      toast.error('Không tìm thấy thông tin bài viết')
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('Title', values.title)
      formData.append('Description', values.description || '')
      formData.append('Content', content)
      formData.append('CategoryID', blogData.categoryID !== undefined ? blogData.categoryID.toString() : '0')

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('Image', fileList[0].originFileObj)
      }

      console.log('Submitting form data:', Object.fromEntries(formData))
      const res = await blogApi.updateBlog(id, formData)
      if (res) {
        toast.success('Cập nhật bài viết thành công!')
        navigate(-1)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật bài viết!')
      console.error('Error updating blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!blogData) {
    return <div className="p-6">Không tìm thấy thông tin bài viết</div>
  }

  return (
    <div className='p-6'>
      <Spin spinning={loading} delay={500}>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Chỉnh sửa bài viết {categoryName ? `(${categoryName})` : ''}</h1>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>

        <Card>
          <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={blogData}>
            <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
              <Input placeholder='Nhập tiêu đề bài viết' />
            </Form.Item>

            <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
              <TextArea placeholder='Nhập mô tả ngắn gọn' autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>

            <Form.Item
              label='Nội dung'
              required
              validateStatus={!content ? 'error' : ''}
              help={!content ? 'Vui lòng nhập nội dung' : ''}
            >
              <ReactQuill value={content} onChange={setContent} theme='snow' style={{ height: 200 }} />
            </Form.Item>

            <Form.Item name='image' label='Hình ảnh' className='py-8'>
              <Upload
                listType='picture'
                maxCount={1}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading}>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}

export default BlogDetail
