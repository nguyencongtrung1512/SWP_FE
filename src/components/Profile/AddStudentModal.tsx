import { Modal, Form, Input, message, Spin } from 'antd'
import React from 'react'
import { addStudent } from '../../api/parent.api'

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSuccess: () => void
}

interface FormValues {
  studentCode: string
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const handleFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      const response = await addStudent(values)
      if (response.success) {
        message.success(response.message || 'Thêm con thành công!')
        form.resetFields()
        onAddSuccess()
        onClose()
      } else {
        message.error(response.message || 'Thêm con thất bại!')
      }
    } catch (error) {
      console.error('Failed to add student:', error)
      message.error('Đã xảy ra lỗi khi thêm con.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title='Thêm con' open={isOpen} onCancel={onClose} footer={null}>
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item
            name='studentCode'
            label='Mã học sinh'
            rules={[{ required: true, message: 'Vui lòng nhập mã học sinh!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <button
              type='submit'
              className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'
            >
              Thêm con
            </button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddStudentModal
