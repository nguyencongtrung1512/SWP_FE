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
    const errorData = error?.response?.data
    let message = 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.'

    if (typeof errorData === 'string') {
      message = errorData
    } else if (typeof errorData === 'object' && errorData?.message) {
      message = errorData.message
    }

    return {
      success: false,
      message,
      url: errorData?.url
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
      message: response.data.message
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.'
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
      message: response.data.message
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Mã OTP không chính xác hoặc đã hết hạn!'
    }
  }
}

export const resendOtp = async (params: { email: string }) => {
  try {
    const response = await http.post(`${API_URL}/otp/resend`, params)
    return {
      success: true,
      message: response.data.message
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Không thể gửi lại mã OTP!'
    }
  }
}

export const forgotPassword = async (params: { email: string }) => {
  try {
    const response = await http.post(`${API_URL}/forgot-password`, params)
    return {
      success: true,
      message: response.data.message
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Không thể gửi yêu cầu đặt lại mật khẩu!'
    }
  }
}

export const resetPassword = async (params: { email: string; token: string; newPassword: string }) => {
  try {
    const cleanToken = params.token.trim().replace(/^["'](.*)["']$/, '$1');
    const requestData = {
      email: params.email,
      token: cleanToken,
      newPassword: params.newPassword,
      confirmNewPassword: params.newPassword
    };
    
    console.log('Sending reset password request:', requestData);
    const response = await http.post(`${API_URL}/reset-password`, requestData);
    
    return {
      success: true,
      message: response.data.message || "Mật khẩu đã được đặt lại thành công."
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Vui lòng thử lại.'
    }
  }
}

export const createNurse = async (params: {
  phoneNumber: string
  password: string
  fullname: string
  email: string
  address: string
  dateOfBirth: string
}) => {
  try {
    const response = await http.post(`${API_URL}/admin/create-nurse`, params)
    return {
      success: true,
      message: response.data.message
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || 'Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.'
    }
  }
}