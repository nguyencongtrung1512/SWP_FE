import React, { useState, useEffect } from 'react'
import { Form } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../../apis/auth.api'
import ResetPasswordForm from './resetPasswordForm'
import { toast } from 'react-toastify'

const extractParamsFromUrl = (url: string): { email: string | null; token: string | null } => {
  try {
    if (url.includes('email=') && url.includes('token=')) {
      const emailMatch = url.match(/email=([^&]+)/)
      const tokenMatch = url.match(/token=([^&]+)/)
      
      return {
        email: emailMatch && emailMatch[1] ? decodeURIComponent(emailMatch[1]) : null,
        token: tokenMatch && tokenMatch[1] ? decodeURIComponent(tokenMatch[1]) : null
      }
    }
    return { email: null, token: null }
  } catch (error) {
    console.error('Error extracting params from URL:', error)
    return { email: null, token: null }
  }
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenParam = queryParams.get('token')
    const emailParam = queryParams.get('email')
    
    let finalToken = tokenParam
    let finalEmail = emailParam

    if (!finalToken || !finalEmail) {
      const fullUrl = window.location.href
      
      const extractedParams = extractParamsFromUrl(fullUrl)
      if (extractedParams.email) finalEmail = extractedParams.email
      if (extractedParams.token) finalToken = extractedParams.token
    }

    if (!finalToken || !finalEmail) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ!')
      navigate('/login')
      return
    }
    setToken(finalToken)
    setEmail(finalEmail)
  }, [location, navigate])

  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    try {
      setLoading(true)
      console.log('Submitting reset password with token:', token, 'email:', email)

      const result = await resetPassword({
        email,
        token,
        newPassword: values.newPassword
      })

      if (result.success) {
        toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
        navigate('/login')
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Không thể đặt lại mật khẩu!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#44aade]'>
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-[450px]'>
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
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            loading={loading}
            form={form}
            email={email}
          />
        </div>
      </div>
    </div>
  )
}

export default ResetPassword