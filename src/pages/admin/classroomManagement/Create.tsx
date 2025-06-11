import React from 'react'
import { Modal, Form, Input, message } from 'antd'
import { createClass } from '../../../apis/class'

interface CreateClassProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
}

interface CreateClassForm {
  className: string
}

const CreateClass: React.FC<CreateClassProps> = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createClass(values)
      message.success('Thêm lớp thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating class:', error)
      message.error('Có lỗi xảy ra khi thêm lớp!')
    } finally {
      setLoading(false)
    }
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
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='className'
          label='Tên lớp'
          rules={[
            { required: true, message: 'Vui lòng nhập tên lớp!' },
            { pattern: /^\d+\/\d+$/, message: 'Tên lớp phải có định dạng số/số (ví dụ: 1/1)' }
          ]}
        >
          <Input placeholder='Nhập tên lớp (ví dụ: 1/1)' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateClass
