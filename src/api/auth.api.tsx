import http from '../utils/http'

const API_URL = `/accounts`

export const login = async (params: { email: string; password: string }) => {
  try {
    const response = await http.post(`${API_URL}/login`, params)
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.account))
    }
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Đăng nhập thất bại!',
      data: null
    }
  }
}

export const register = async (params: {
  phoneNumber: string
  password: string
  confirmPassword: string
  fullname: string
  email: string
  address: string
  dateOfBirth: string
}) => {
  try {
    const response = await http.post(`${API_URL}/otp/register`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error: any) {
    console.error('Register error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.',
      data: null
    }
  }
}

export const verifyOtp = async (params: { email: string; otp: string }) => {
  try {
    const apiParams = {
      email: params.email,
      otpCode: params.otp
    }
    const response = await http.post(`${API_URL}/otp/verify`, apiParams)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn!',
      data: null
    }
  }
}

export const resendOtp = async (params: { email: string }) => {
  try {
    const response = await http.post(`${API_URL}/otp/resend`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể gửi lại mã OTP!',
      data: null
    }
  }
}