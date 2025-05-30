import React from 'react'
import { Modal, Form, Input } from 'antd'

interface CreateClassProps {
  isModalVisible: boolean
  onCancel: () => void
  onOk: (values: CreateClassForm) => void
}

interface CreateClassForm {
  name: string
  teacher: string
  capacity: number
  description: string
  status: string
}

const CreateClass: React.FC<CreateClassProps> = ({ isModalVisible, onCancel, onOk }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title='Thêm lớp mới'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      width={600}
    >
      <Form form={form} layout='vertical' initialValues={{ status: 'active' }}>
        <Form.Item name='name' label='Tên lớp' rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}>
          <Input placeholder='Nhập tên lớp' />
        </Form.Item>

        <Form.Item name='capacity' label='Sức chứa' rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}>
          <Input type='number' min={1} placeholder='Nhập sức chứa lớp' />
        </Form.Item>

        <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea rows={4} placeholder='Nhập mô tả lớp' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateClass
