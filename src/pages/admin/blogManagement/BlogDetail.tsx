// import React, { useEffect, useState } from 'react'
// import { Card, Form, Input, Select, Button, Upload, message } from 'antd'
// import { UploadOutlined } from '@ant-design/icons'
// import { useParams, useNavigate } from 'react-router-dom'
// import blogApi, { type Blog, type CreateBlogRequest } from '../../../apis/blog.api'

// const { TextArea } = Input

// function BlogDetail() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [form] = Form.useForm()
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (values: CreateBlogRequest) => {
//     try {
//       setLoading(true)
//       if (id) {
//         // TODO: Implement update API
//         message.success('Cập nhật bài viết thành công!')
//       } else {
//         await blogApi.createBlog(values)
//         message.success('Tạo bài viết mới thành công!')
//       }
//       navigate('/admin/blog')
//     } catch (error) {
//       message.error('Có lỗi xảy ra!')
//       console.error('Error submitting blog:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (id) {
//       // TODO: Implement get blog by id API
//       const fetchBlog = async () => {
//         try {
//           setLoading(true)
//           // const response = await blogApi.getBlogById(id)
//           // form.setFieldsValue(response.data)
//         } catch (error) {
//           message.error('Không thể tải thông tin bài viết')
//           console.error('Error fetching blog:', error)
//         } finally {
//           setLoading(false)
//         }
//       }
//       fetchBlog()
//     }
//   }, [id, form])

//   return (
//     <div className='p-6'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-2xl font-bold'>{id ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h1>
//         <Button onClick={() => navigate('/admin/blog')}>Quay lại</Button>
//       </div>

//       <Card>
//         <Form form={form} layout='vertical' onFinish={handleSubmit} disabled={loading}>
//           <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
//             <Input placeholder='Nhập tiêu đề bài viết' />
//           </Form.Item>

//           <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
//             <TextArea placeholder='Nhập mô tả ngắn gọn' autoSize={{ minRows: 2, maxRows: 4 }} />
//           </Form.Item>

//           <Form.Item name='content' label='Nội dung' rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
//             <TextArea placeholder='Nhập nội dung chi tiết' autoSize={{ minRows: 6, maxRows: 12 }} />
//           </Form.Item>

//           <Form.Item name='category' label='Danh mục' rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
//             <Select placeholder='Chọn danh mục'>
//               <Select.Option value='Công nghệ'>Công nghệ</Select.Option>
//               <Select.Option value='Giáo dục'>Giáo dục</Select.Option>
//               <Select.Option value='Kinh tế'>Kinh tế</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name='image' label='Hình ảnh' rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh' }]}>
//             <Upload listType='picture' maxCount={1} beforeUpload={() => false}>
//               <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item>
//             <Button type='primary' htmlType='submit' loading={loading}>
//               {id ? 'Cập nhật' : 'Tạo mới'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   )
// }

// export default BlogDetail
