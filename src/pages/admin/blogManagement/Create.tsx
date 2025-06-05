import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, Upload, message } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { RcFile } from 'antd/es/upload'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type CreateBlogRequest } from '../../../apis/blog.api'
import { UploadOutlined } from '@ant-design/icons'

// import { createBlog } from '../../../apis/blog.api' // Sẽ gọi API ở component cha

interface CategoryOption {
  id: number | string // Sử dụng id hoặc categoryID tùy thuộc dữ liệu thật
  name: string
}

interface CreateBlogFormProps {
  onSubmit: (values: FormData) => void // Thay đổi kiểu dữ liệu sang FormData
  loading?: boolean
  categories: CategoryOption[]
  initialValues?: CreateBlogRequest // Sử dụng CreateBlogRequest
}

function CreateBlogForm({ onSubmit, loading = false, categories, initialValues }: CreateBlogFormProps) {
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [fileList, setFileList] = useState<UploadFile<void>[]>([]) // Use UploadFile<void>


  const handleFormSubmit = (values: { // Define type for form values
    title: string;
    description: string;
    category: string | number; // Or number, depending on API
    image: UploadFile<void>[]; // Use UploadFile<void>
  }) => {
    const formData = new FormData();

    // Thêm các trường dữ liệu khác vào FormData
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('content', content);
    formData.append('category', values.category.toString());

    // Thêm file ảnh vào FormData
    if (fileList.length > 0) {
      formData.append('imageFile', fileList[0].originFileObj as Blob); // Cast to Blob
    } else if (initialValues?.image) {
      // Nếu không có file mới upload nhưng có initialValues (trường hợp chỉnh sửa)
      // Tùy thuộc API, có thể gửi lại URL hoặc bỏ qua trường file
      // Ở đây tạm thời bỏ qua trường file nếu không có file mới
      // Nếu API cần URL cũ, cần thêm logic xử lý tại đây
    }

    onSubmit(formData) // Gửi FormData đi
  }

  // Xử lý sự kiện change của Upload
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => { // Use UploadProps['onChange'] type
    setFileList(newFileList.slice(-1));
  };

  // Ngăn Upload tự động upload
  const beforeUpload = (file: RcFile) => { // Use RcFile type
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    // Trả về false để ngăn Ant Design tự upload
    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
  };

  useEffect(() => {
    // Reset form và content khi modal đóng (loading chuyển từ true sang false)
    if (!loading) {
      form.resetFields();
      setContent('');
      setFileList([]); // Reset file list
      // Nếu có initialValues, set form values khi initialValues thay đổi và modal mở
    } else if (initialValues) {
      form.setFieldsValue(initialValues);
      setContent(initialValues.content || '');
      // Xử lý initial image nếu có (ví dụ hiển thị tên file cũ)
      if (initialValues.image) {
        // Ant Design Upload cần object có uid, name, status, url
        setFileList([{
          uid: '-1',
          name: initialValues.image.split('/').pop() || 'existing_image',
          status: 'done',
          url: initialValues.image,
        }]);
      } else {
        setFileList([]);
      }
    }
  }, [loading, form, initialValues]);

  useEffect(() => {
    // Set initial content if initialValues are provided on first render
    if (initialValues?.content) {
      setContent(initialValues.content);
    }
    // Xử lý initial image khi component render lần đầu
    if (initialValues?.image && fileList.length === 0) {
      setFileList([{
        uid: '-1',
        name: initialValues.image.split('/').pop() || 'existing_image',
        status: 'done',
        url: initialValues.image,
      }]);
    }
  }, [initialValues, fileList.length]); // Thêm fileList.length vào dependencies

  return (
    <Form form={form} layout='vertical' onFinish={handleFormSubmit} initialValues={initialValues || { content: '' }}>
      {' '}
      {/* Pass initialValues to Form */}
      {/* Trường Danh mục */}
      <Form.Item
        name='category' // Thay categoryId bằng category
        label='Danh mục'
        
      >
        <Select placeholder='Chọn danh mục'>
          {categories.map((category) => (
            // Sử dụng category.id hoặc category.categoryID tùy thuộc dữ liệu API
            <Select.Option key={category.id} value={category.id?.toString()}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {/* Trường Tiêu đề */}
      <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
        <Input placeholder='Nhập tiêu đề blog' />
      </Form.Item>
      {/* Trường Mô tả */}
      <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
        <Input.TextArea rows={4} placeholder='Nhập mô tả blog' />
      </Form.Item>
      {/* Trường Nội dung */}
      <Form.Item
        name='content' // ReactQuill sẽ tự cập nhật state content
        label='Nội dung'
        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]} // Áp dụng rule cho trường Form.Item
      >
        <ReactQuill theme='snow' value={content} onChange={setContent} style={{ height: '200px' }} />
      </Form.Item>
      {/* Trường Ảnh (Upload) */}
      <Form.Item
        name='image' // Tên trường để Form quản lý state, giá trị sẽ là file list
        label='Upload Ảnh'
        valuePropName='fileList' // Form.Item sẽ lấy giá trị từ fileList
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)} // Lấy fileList từ event
        rules={[{ required: true, message: 'Vui lòng upload ảnh!' }]} // Rule required
      >
        <Upload
          beforeUpload={beforeUpload} // Ngăn tự động upload và validate
          onChange={handleUploadChange} // Xử lý khi file thay đổi
          fileList={fileList} // Bind fileList state
          listType="picture" // Hiển thị dạng ảnh
          maxCount={1} // Chỉ cho phép upload 1 file
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>
      <div style={{ marginBottom: '50px' }}></div>
      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading}>
          Tạo Blog
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CreateBlogForm
