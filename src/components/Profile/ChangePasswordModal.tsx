import { Modal, Form, Input, message, Spin } from 'antd'
import React from 'react'
import { changePassword } from '../../api/parent.api'

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
        message.success(response.message || 'Đổi mật khẩu thành công!')
        form.resetFields()
        onClose()
      } else {
        message.error(response.message || 'Đổi mật khẩu thất bại!')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      message.error('Đã xảy ra lỗi khi đổi mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title='Đổi mật khẩu' open={isOpen} onCancel={onClose} footer={null}>
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
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
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
