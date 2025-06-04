import http from '../utils/http';

const API_URL = `/accounts`;

export const login = async (params: { email: string; password: string }) => {
  try {
    const response = await http.post(`${API_URL}/login`, params);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.account));
    }
    return {
      success: true,
      message: response.data.message,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data  || 'Đăng nhập thất bại! Vui lòng thử lại.',
      data: null
    };
  }
};

export const register = async (params: { 
  phoneNumber: string; 
  password: string;
  confirmPassword: string;
  fullname: string;
  email: string;
  address: string;
  dateOfBirth: string;
}) => {
  try {
    const response = await http.post(`${API_URL}/register`, params);
    return {
      success: true,
      message: response.data.message,
      data: response.data
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data?.errors || 'Đăng ký thất bại! Vui lòng thử lại.',
      data: null
    };
  }
};