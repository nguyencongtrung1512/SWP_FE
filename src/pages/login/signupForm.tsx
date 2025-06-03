import React from 'react';
import { Form, Input, Button, DatePicker, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

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
      className="mt-2 w-full"
    >
      <Form name='register' onFinish={onFinish} layout='vertical' form={form} className="space-y-2 w-full ml-2">
        <Row gutter={16} className="w-full">
          <Col xs={24} sm={12}>
            <Form.Item
              name='fullName'
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' }
              ]}
              className="mb-3"
            >
              <Input 
                prefix={<UserOutlined className="mr-2 text-gray-400" />} 
                placeholder='Họ và tên' 
                size='large'
                className="py-3 px-4 w-full" 
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              className="mb-3"
            >
              <Input 
                prefix={<MailOutlined className="mr-2 text-gray-400" />} 
                placeholder='Email' 
                size='large'
                className="py-3 px-4 w-full" 
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} className="w-full">
          <Col xs={24} sm={12}>
            <Form.Item
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
              className="mb-3"
            >
              <Input 
                prefix={<PhoneOutlined className="mr-2 text-gray-400" />} 
                placeholder='Số điện thoại' 
                size='large'
                className="py-3 px-4 w-full" 
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name='dateOfBirth'
              rules={[
                { required: true, message: 'Vui lòng chọn ngày sinh!' }
              ]}
              className="mb-3"
            >
              <div className="relative flex items-center w-full">
                <span className="absolute left-3 z-10 text-gray-400">
                  <CalendarOutlined />
                </span>
                <DatePicker 
                  placeholder='Ngày sinh' 
                  size='large' 
                  format="DD/MM/YYYY"
                  className="w-full py-3 px-4 pl-9"
                  suffixIcon={null}
                  style={{ paddingLeft: '36px', height: '48px' }}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} className="w-full">
          <Col xs={24}>
            <Form.Item
              name='address'
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' }
              ]}
              className="mb-3"
            >
              <Input 
                prefix={<HomeOutlined className="mr-2 text-gray-400" />} 
                placeholder='Địa chỉ' 
                size='large'
                className="py-3 px-4 w-full" 
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} className="w-full">
          <Col xs={24} sm={12}>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
              className="mb-3"
            >
              <Input.Password 
                prefix={<LockOutlined className="mr-2 text-gray-400" />} 
                placeholder='Mật khẩu' 
                size='large'
                className="py-3 px-4 w-full" 
              />
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
              className="mb-3"
            >
              <Input.Password 
                prefix={<LockOutlined className="mr-2 text-gray-400" />} 
                placeholder='Xác nhận mật khẩu' 
                size='large'
                className="py-3 px-4 w-full" 
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16} className="w-full">
          <Col xs={24}>
            <Form.Item className="mb-0 mt-4">
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                size='large'
                className='bg-blue-500 hover:bg-blue-600 h-12 text-base font-medium w-full'
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
};

export default SignupForm; 