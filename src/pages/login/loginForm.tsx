import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onFinish: (values: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  form: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ onFinish, loading, form }) => {
  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log('Form values before submit:', values);
    return onFinish(values);
  };

  return (
    <motion.div
      key="login"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <Form 
        name='login' 
        onFinish={handleSubmit} 
        layout='vertical' 
        form={form}
        onFinishFailed={(errorInfo) => {
          console.log('Form validation failed:', errorInfo);
        }}
      >
        <Form.Item
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='Email' size='large' />
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder='Mật khẩu' size='large' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            block
            size='large'
            className='bg-blue-500 hover:bg-blue-600'
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default LoginForm; 