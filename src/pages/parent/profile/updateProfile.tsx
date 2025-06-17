import { Modal, Form, Input, message, Spin } from 'antd'
import React, { useEffect } from 'react'
import { updateAccount } from '../../../api/parent.api'

interface UpdateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    email: string
    fullname: string
    address: string
    phoneNumber: string
  } | null
  onUpdateSuccess: () => void
}

interface FormValues {
  email: string
  fullname: string
  address: string
  phoneNumber: string
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, initialData, onUpdateSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      form.setFieldsValue(initialData)
    }
  }, [isOpen, initialData, form])

  const handleFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      const response = await updateAccount(values)
      if (response.success) {
        message.success(response.message || 'Cập nhật thông tin thành công!')
        onUpdateSuccess()
        onClose()
      } else {
        message.error(response.message || 'Cập nhật thông tin thất bại!')
      }
    } catch (error) {
      console.error('Failed to update account:', error)
      message.error('Đã xảy ra lỗi khi cập nhật thông tin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Chỉnh sửa hồ sơ'
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          initialValues={initialData || { email: '', fullname: '', address: '', phoneNumber: '' }}
        >
          <Form.Item
            name='email'
            label='Email'
            hidden
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name='fullname'
            label='Họ và tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='address'
            label='Địa chỉ'
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label='Số điện thoại'
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <button type='submit' className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'>
              Lưu thay đổi
            </button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default UpdateProfileModal
