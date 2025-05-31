import React, { useState } from 'react'
import { Form, Input, Button, message, Tooltip } from 'antd'
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/auth.context'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showCredentials, setShowCredentials] = useState(false)

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      setLoading(true)
      const result = await login(values.phone, values.password)
      
      if (result.success) {
        message.success(result.message)
        // Redirect based on user role
        if (result.redirectUrl) {
          navigate(result.redirectUrl)
        }
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('Đăng nhập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#44aade]'>
      {/* Bên trái: Logo + slogan */}
      <div className='flex-1 flex flex-col items-center justify-center text-white'>
        <div className='mb-8'>
          {/* Logo SVG hoặc ảnh */}
          <svg width='120' height='120' viewBox='0 0 36 36' fill='none'>
            <rect x='7' y='16' width='22' height='4' rx='2' fill='#fff' />
            <rect x='16' y='7' width='4' height='22' rx='2' fill='#fff' />
            <rect x='2' y='2' width='32' height='32' rx='8' stroke='#ffffff' strokeWidth='3' />
          </svg>
        </div>
        <h1 className='text-5xl font-bold mb-4'>EduCare</h1>
        <p className='text-xl text-center max-w-xs'>Nền tảng y tế trực tuyến bảo vệ sức khỏe của con bạn!</p>
      </div>
      {/* Bên phải: Form đăng nhập */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 w-[400px]'>
          <div className='flex items-center justify-center mb-6'>
            <span className='text-blue-500 mr-2'>
              <svg width='36' height='36' viewBox='0 0 36 36' fill='none'>
                <rect x='7' y='16' width='22' height='4' rx='2' fill='#1da1f2' />
                <rect x='16' y='7' width='4' height='22' rx='2' fill='#1da1f2' />
                <rect x='2' y='2' width='32' height='32' rx='8' stroke='#1da1f2' strokeWidth='3' />
              </svg>
            </span>
            <span className='text-3xl font-bold select-none'>
              <span className='text-gray-900'>Edu</span>
              <span className='text-blue-500'>Care</span>
            </span>
          </div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Đăng nhập</h2>
            <Tooltip title='Hiển thị thông tin đăng nhập demo'>
              <Button 
                type='text' 
                icon={<InfoCircleOutlined />}
                onClick={() => setShowCredentials(!showCredentials)}
                className='text-blue-500'
              />
            </Tooltip>
          </div>
          {showCredentials && (
            <div className='mb-6 p-3 bg-blue-50 rounded-md border border-blue-100'>
              <div className='text-sm font-medium text-blue-900 mb-2'>Tài khoản demo:</div>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div>
                  <div className='font-medium'>Phụ huynh:</div>
                  <div className='text-gray-600'>0123456789 / parent123</div>
                </div>
                <div>
                  <div className='font-medium'>Y tá:</div>
                  <div className='text-gray-600'>0987654321 / nurse123</div>
                </div>
                <div>
                  <div className='font-medium'>Admin:</div>
                  <div className='text-gray-600'>0909090909 / admin123</div>
                </div>
              </div>
            </div>
          )}
          <Form name='login' onFinish={onFinish} layout='vertical'>
            <Form.Item
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder='Số điện thoại' size='large' />
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
        </div>
      </div>
    </div>
  )
}

export default Login
