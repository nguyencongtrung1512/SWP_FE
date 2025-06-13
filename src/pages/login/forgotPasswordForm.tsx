import React from 'react'
import { Form, Input, Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

interface ForgotPasswordFormProps {
  onSubmit: (values: { email: string }) => Promise<void>;
  onBack: () => void
  loading: boolean
  form: any
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, onBack, loading, form }) => {
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  }

  return (
    <motion.div
      key="forgotPassword"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <h1 className="text-xl font-semibold mb-4">Quên mật khẩu</h1>
      <span className="block mb-6 text-gray-600 text-base">
        Vui lòng nhập email của bạn. Chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.
      </span>
      <Form 
        name='forgotPassword' 
        onFinish={onSubmit} 
        layout='vertical' 
        form={form}
        className="space-y-4"
      >
        <Form.Item
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
          className="mb-6"
        >
          <Input prefix={<MailOutlined className="mr-2 text-gray-400" />} placeholder='Email' size='large' className="py-2.5 px-4" />
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
            Gửi yêu cầu
          </Button>
        </Form.Item>
        <div className="mt-4 text-center">
          <Button
            type='link'
            onClick={onBack}
            className='p-0 font-medium'
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

export default ForgotPasswordForm; 