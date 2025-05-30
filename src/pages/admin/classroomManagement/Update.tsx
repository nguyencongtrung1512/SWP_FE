import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'

interface Class {
  id: string
  gradeId: string
  name: string
  teacher: string
  totalStudents: number
  capacity: number
  description: string
  status: string
}

interface UpdateClassProps {
  isModalVisible: boolean
  onCancel: () => void
  onOk: (values: UpdateClassForm) => void
  editingClass: Class | null
}

interface UpdateClassForm {
  name: string
  teacher: string
  capacity: number
  description: string
  status: string
}

const UpdateClass: React.FC<UpdateClassProps> = ({ isModalVisible, onCancel, onOk, editingClass }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (editingClass) {
      form.setFieldsValue(editingClass)
    }
  }, [editingClass, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk({ ...editingClass, ...values })
      form.resetFields()
    })
  }

  return (
    <Modal
      title='Sửa lớp'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      width={600}
    >
      <Form form={form} layout='vertical'>
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

export default UpdateClass
