import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'

interface Grade {
  id: string
  name: string
  description: string
  totalClasses: number
  totalStudents: number
}

interface UpdateGradeProps {
  isModalVisible: boolean
  onCancel: () => void
  onOk: (values: any) => void
  editingGrade: Grade | null
}

const UpdateGrade: React.FC<UpdateGradeProps> = ({ isModalVisible, onCancel, onOk, editingGrade }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (editingGrade) {
      form.setFieldsValue(editingGrade)
    }
  }, [editingGrade, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk({ ...editingGrade, ...values })
      form.resetFields()
    })
  }

  return (
    <Modal
      title='Sửa khối'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      width={600}
    >
      <Form form={form} layout='vertical'>
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

export default UpdateGrade
