import React from 'react'
import { Modal, Form, Input } from 'antd'

interface CreateGradeProps {
  isModalVisible: boolean
  onCancel: () => void
  onOk: (values: any) => void
}
//call api 
// const handleCreate = async (values: any) => {
//   try {
//     await createGradeAPI(values)
//     onOk(values)
//   } catch (error) {
//     // Xử lý lỗi
//   }
// }

const CreateGrade: React.FC<CreateGradeProps> = ({ isModalVisible, onCancel, onOk }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title='Thêm khối mới'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      width={600}
    >
      <Form form={form} layout='vertical' initialValues={{ status: 'active' }}>
        <Form.Item name='name' label='Tên khối' rules={[{ required: true, message: 'Vui lòng nhập tên khối!' }]}>
          <Input placeholder='Nhập tên khối' />
        </Form.Item>

        <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea rows={4} placeholder='Nhập mô tả khối' />
        </Form.Item>

        <Form.Item name='totalClasses' label='Số lớp' rules={[{ required: true, message: 'Vui lòng nhập số lớp!' }]}>
          <Input type='number' min={1} placeholder='Nhập số lớp' />
        </Form.Item>

        <Form.Item
          name='totalStudents'
          label='Tổng học sinh'
          rules={[{ required: true, message: 'Vui lòng nhập tổng số học sinh!' }]}
        >
          <Input type='number' min={0} placeholder='Nhập tổng số học sinh' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateGrade
