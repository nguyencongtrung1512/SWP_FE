import { Form, Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

interface ResetPasswordFormProps {
  onSubmit: (values: { newPassword: string; confirmPassword: string }) => Promise<void>
  loading: boolean
  form: any
  email: string
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit, loading, form, email }) => {
  
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  }

  const handleSubmit = (values: { newPassword: string; confirmPassword: string }) => {
    return onSubmit(values)
  }

  return (
    <motion.div
      key="resetPassword"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <h1 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h1>
      <span className="block mb-6 text-gray-600">
        Vui lòng nhập mật khẩu mới cho tài khoản {email}.
      </span>
      <Form 
        name='resetPassword' 
        onFinish={handleSubmit} 
        layout='vertical' 
        form={form}
        className="space-y-4"
      >
        <Form.Item
          name='newPassword'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
          className="mb-4"
        >
          <Input.Password prefix={<LockOutlined className="mr-2 text-gray-400" />} placeholder='Mật khẩu mới' size='large' className="py-2.5 px-4" />
        </Form.Item>
        <Form.Item
          name='confirmNewPassword'
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
          className="mb-6"
        >
          <Input.Password prefix={<LockOutlined className="mr-2 text-gray-400" />} placeholder='Xác nhận mật khẩu' size='large' className="py-2.5 px-4" />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            block
            size='large'
            className='bg-blue-500 hover:bg-blue-600 h-12 text-base font-medium'
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  )
}

export default ResetPasswordForm