import { Modal, Form, Input, Spin } from 'antd'
import React from 'react'
import { changePassword } from '../../apis/parent.api'
import { toast } from 'react-toastify'
import { translateMessage } from '../../utils/message'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await changePassword(values)
      if (response.success) {
        toast.success(translateMessage(response.message, 'account'))
        form.resetFields()
        onClose()
      } else {
        toast.error(translateMessage(response.message, 'account'))
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error('Đã xảy ra lỗi khi đổi mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal title='Đổi mật khẩu' open={isOpen} onCancel={handleCancel} footer={null}>
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item
            name='currentPassword'
            label='Mật khẩu hiện tại'
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='newPassword'
            label='Mật khẩu mới'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='confirmNewPassword'
            label='Xác nhận mật khẩu mới'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <button
              type='submit'
              className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'
            >
              Đổi mật khẩu
            </button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ChangePasswordModal
