import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Upload, message, Typography } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { RcFile } from 'antd/es/upload'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UploadOutlined } from '@ant-design/icons'

interface CategoryOption {
  categoryID: number | string
  name: string
}

interface CreateBlogFormProps {
  onSubmit: (values: FormData) => void
  loading?: boolean
  categories: CategoryOption[]
  initialValues?: {
    title?: string
    description?: string
    content?: string
    image?: string
    categoryID?: number
  }
  initialCategory?: CategoryOption | null
}

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({
  onSubmit,
  loading = false,
  categories,
  initialValues,
  initialCategory
}) => {
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!loading) {
      form.resetFields()
      setContent('')
      setFileList([])
    } else if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        categoryID: initialValues.categoryID ?? initialCategory?.categoryID
      })
      setContent(initialValues.content || '')
      if (initialValues.image) {
        setFileList([
          {
            uid: '-1',
            name: initialValues.image.split('/').pop() || 'existing_image',
            status: 'done',
            url: initialValues.image
          }
        ])
      }
    }
    // Set initial category value when initialCategory changes
    if (initialCategory && initialCategory.categoryID !== undefined && initialCategory.categoryID !== null) {
      form.setFieldsValue({
        categoryID: initialCategory.categoryID.toString()
      })
    }
  }, [loading, form, initialValues, initialCategory])

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newList }) => {
    setFileList(newList.slice(-1))
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJpgOrPng) message.error('Chỉ chấp nhận ảnh JPG/PNG!')
    if (!isLt2M) message.error('Ảnh phải nhỏ hơn 2MB!')

    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE
  }

  const handleFormSubmit = (values: {
    title: string
    description?: string
    categoryID?: number | string
    image?: UploadFile[]
  }) => {
    if (!content || content.trim() === '') {
      message.error('Nội dung không được để trống!')
      return
    }

    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description || '')
    formData.append('content', content)

    const categoryIdToSubmit = values.categoryID || initialCategory?.categoryID
    if (categoryIdToSubmit !== undefined && categoryIdToSubmit !== null) {
      formData.append('CategoryID', String(categoryIdToSubmit))
    } else {
      message.error('Vui lòng chọn danh mục!')
      return
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj)
    }

    onSubmit(formData)
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleFormSubmit}
      initialValues={initialValues || (initialCategory ? { categoryID: initialCategory.categoryID } : {})}
    >
      {initialCategory && (
        <Typography.Text type='secondary' style={{ marginBottom: '16px', display: 'block' }}>
          Đang tạo blog cho danh mục: <Typography.Text strong>{initialCategory.name}</Typography.Text>
        </Typography.Text>
      )}
      <Form.Item
        name='categoryID'
        label='Danh mục'
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        initialValue={initialCategory?.categoryID}
      >
        <div>
          <Typography.Text strong style={{ display: 'block' }}>
            {initialCategory?.name ||
              categories.find((cat) => cat.categoryID === form.getFieldValue('categoryID'))?.name}
          </Typography.Text>
          <input type='hidden' value={initialCategory?.categoryID} />
        </div>
      </Form.Item>
      <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
        <Input placeholder='Nhập tiêu đề blog' />
      </Form.Item>

      <Form.Item name='description' label='Mô tả'>
        <Input.TextArea rows={4} placeholder='Nhập mô tả blog' />
      </Form.Item>

      <Form.Item
        label='Nội dung'
        required
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        validateStatus={!content ? 'error' : ''}
      >
        <ReactQuill value={content} onChange={setContent} theme='snow' style={{ height: 200 }} />
      </Form.Item>

      <Form.Item
        className='py-8'
        name='image'
        label='Upload Ảnh'
        valuePropName='fileList'
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        rules={[{ required: false }]}
      >
        <Upload
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          fileList={fileList}
          listType='picture'
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>

      {/* <Form.Item
        className='py-9'
        name='imageBanner'
        label='Upload Ảnh Banner'
        valuePropName='fileList'
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        rules={[{ required: false }]}
      >
        <Upload
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          fileList={fileList}
          listType='picture'
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item> */}

      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          Tạo Blog
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateBlogForm
