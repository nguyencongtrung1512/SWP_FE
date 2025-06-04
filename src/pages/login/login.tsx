import React, { useState } from 'react'
import { Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { login, register, verifyOtp, resendOtp } from '../../api/auth.api'
import path from '../../constants/path'
import LoginForm from './loginForm'
import SignupForm from './signupForm'
import OtpVerification from './otpVerification'
import { useAuth } from '../../contexts/auth.context'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [form] = Form.useForm()
  const { login: authLogin } = useAuth()

  const onFinishLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      const result : any = await login(values)

      if (result.success) {
        toast.success('Đăng nhập thành công!')
        const userData = result.data.account;
        
        authLogin(userData)
        
        if (userData.roleName === 'Parent') 
          navigate(path.healthRecord)
        else if (userData.roleName === 'Nurse') 
          navigate(path.NURSE_PROFILE);
        else if (userData.roleName === 'Admin') 
          navigate(path.CENSOR_LIST);
        
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.log('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const onFinishRegister = async (values: { 
    phoneNumber: string; 
    password: string; 
    confirmPassword: string;
    fullname: string; 
    email: string;
    address: string;
    dateOfBirth: any;
  }) => {
    try {
      setLoading(true)
      if (!values.dateOfBirth) {
        toast.error('Vui lòng chọn ngày sinh!')
        setLoading(false)
        return
      }
      
      let formattedDate;
      
      try {
        if (typeof values.dateOfBirth === 'string') {
          const parts = values.dateOfBirth.split('/');
          if (parts.length === 3)
            formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`;
          else 
            formattedDate = new Date(values.dateOfBirth).toISOString();
          
        } else if (values.dateOfBirth instanceof Date) {
          formattedDate = values.dateOfBirth.toISOString();
        } else {
          formattedDate = dayjs(values.dateOfBirth).format('YYYY-MM-DD') + 'T00:00:00Z';
        }
      } catch (e) {
        toast.error('Định dạng ngày sinh không hợp lệ!');
        setLoading(false);
        return;
      }
      
      const formattedValues = {
        ...values,
        dateOfBirth: formattedDate
      }
      
      const result : any = await register(formattedValues)
      
      if (result && result.success) {
        setRegisteredEmail(values.email)
        setShowOtpVerification(true)
        toast.success('Đăng ký thành công! Vui lòng nhập mã OTP để xác thực tài khoản.')
      } else if (result) {
        toast.error(result.message)
      }

    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error?.message || 'Đăng ký thất bại! Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (otpValue: string) => {
    try {
      setLoading(true)
      const result = await verifyOtp({ email: registeredEmail, otp: otpValue })
      
      if (result.success) {
        toast.success('Xác thực tài khoản thành công! Vui lòng đăng nhập.')
        setShowOtpVerification(false)
        setIsLogin(true)
        form.resetFields()
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Xác thực thất bại! Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true)
      const result = await resendOtp({ email: registeredEmail })
      
      if (result.success)
        toast.success(result.message || 'Đã gửi lại mã OTP!')
      else 
        toast.error(result.message)
      
    } catch (error: any) {
      toast.error(error?.message || 'Không thể gửi lại mã OTP!')
    } finally {
      setLoading(false)
    }
  }

  const toggleForm = () => {
    setShowOtpVerification(false)
    form.resetFields()
    setIsLogin(!isLogin)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#44aade]'>
      <div className='hidden md:flex flex-1 flex-col items-center justify-center text-white'>
        <div className='mb-8'>
          <svg width='120' height='120' viewBox='0 0 36 36' fill='none'>
            <rect x='7' y='16' width='22' height='4' rx='2' fill='#fff' />
            <rect x='16' y='7' width='4' height='22' rx='2' fill='#fff' />
            <rect x='2' y='2' width='32' height='32' rx='8' stroke='#ffffff' strokeWidth='3' />
          </svg>
        </div>
        <h1 className='text-5xl font-bold mb-4'>EduCare</h1>
        <p className='text-xl text-center max-w-xs'>Nền tảng y tế trực tuyến bảo vệ sức khỏe của con bạn!</p>
      </div>
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 w-full ${!isLogin ? 'max-w-[540px]' : 'max-w-[450px]'}`}>
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
            <h2 className='text-2xl font-semibold text-gray-800'>
              {isLogin ? 'Đăng nhập' : (showOtpVerification ? '' : 'Đăng ký')}
            </h2>
          </div>
          
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm 
                onFinish={onFinishLogin} 
                loading={loading} 
                form={form} 
              />
            ) : showOtpVerification ? (
              <OtpVerification
                onVerify={handleVerifyOtp}
                loading={loading}
                email={registeredEmail}
                onResendOtp={handleResendOtp}
              />
            ) : (
              <SignupForm 
                onFinish={onFinishRegister} 
                loading={loading} 
                form={form} 
              />
            )}
          </AnimatePresence>
          
          {!showOtpVerification && (
            <div className='mt-4 text-center'>
              <p className='text-gray-600'>
                {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}
                <Button
                  type='link'
                  onClick={toggleForm}
                  className='p-0 ml-1 font-medium'
                >
                  {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                </Button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
