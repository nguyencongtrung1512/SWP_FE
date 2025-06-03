import React from 'react';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import './signupForm.css';

interface SignupFormProps {
  onFinish: (values: { 
    phone: string; 
    password: string; 
    fullName: string; 
    email: string;
    address: string;
    dateOfBirth: Date;
  }) => Promise<void>;
  loading: boolean;
  form: any;
}

const SignupForm: React.FC<SignupFormProps> = ({ onFinish, loading, form }) => {
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      key="register"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <Form name='register' onFinish={onFinish} layout='vertical' form={form}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='fullName'
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder='Họ và tên' size='large' />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder='Email' size='large' />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder='Số điện thoại' size='large' />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name='dateOfBirth'
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' }
              ]}
            >
              <div className="custom-date-picker-wrapper">
                <span className="date-picker-prefix">
                  <CalendarOutlined />
                </span>
                <DatePicker 
                  placeholder='Ngày sinh' 
                  size='large' 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  className="custom-date-picker"
                  suffixIcon={null}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name='address'
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ!' }
          ]}
        >
          <Input prefix={<HomeOutlined />} placeholder='Địa chỉ' size='large' />
        </Form.Item>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='Mật khẩu' size='large' />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name='confirmPassword'
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='Xác nhận mật khẩu' size='large' />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            block
            size='large'
            className='bg-blue-500 hover:bg-blue-600'
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default SignupForm; 