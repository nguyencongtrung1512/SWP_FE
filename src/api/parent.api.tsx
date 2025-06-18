import http from '../utils/http'
import { AxiosError } from 'axios'

const API_URL = `/Parent`
const API_ACCOUNT = `/accounts`

export interface Student {
  $id: string
  id: number
  fullname: string
  studentCode: string
  dateOfBirth: string
  gender: string
  address: string
  parentID: number
  parent: null
  classID: number
  _class: null
  healthRecords: any[]
  medicalEvents: any[]
  vaccinationSchedules: any[]
  medicalReports: any[]
}

export const getMyChildren = async () => {
  try {
    const response = await http.get<{ $id: string; $values: Student[] }>(`${API_URL}/MyChildren`)
    return {
      success: true,
      data: response.data.$values,
      message: 'Lấy danh sách con thành công!'
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy danh sách con thất bại!',
        data: null
      }
    }
    console.error('Get my children error:', error)
    return {
      success: false,
      message: 'Lấy danh sách con thất bại!',
      data: null
    }
  }
}

export const addStudent = async (params: { studentCode: string }) => {
  try {
    const response = await http.post(`${API_URL}/add-student`, params)
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.account))
    }
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Thêm con thất bại!',
        data: null
      }
    }
    console.error('Add student error:', error)
    return {
      success: false,
      message: 'Thêm con thất bại!',
      data: null
    }
  }
}

interface UpdateAccountParams {
  email: string
  fullname: string
  address: string
  phoneNumber: string
}

export const updateAccount = async (params: UpdateAccountParams) => {
  try {
    const response = await http.patch(`${API_ACCOUNT}/update`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật thông tin thất bại!',
        data: null
      }
    }
    console.error('Update account info error:', error)
    return {
      success: false,
      message: 'Cập nhật thông tin thất bại!',
      data: null
    }
  }
}

interface ChangePasswordParams {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const changePassword = async (params: ChangePasswordParams) => {
  try {
    const response = await http.patch(`${API_ACCOUNT}/change-password`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại!',
        data: null
      }
    }
    console.error('Change password error:', error)
    return {
      success: false,
      message: 'Đổi mật khẩu thất bại!',
      data: null
    }
  }
}

export const getAccountInfo = async () => {
  try {
    const response = await http.get(`${API_ACCOUNT}/info`)
    const data = response.data
    if (data && data.student && !Array.isArray(data.student)) {
      data.student = [data.student]
    }
    return {
      success: true,
      data: data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy thông tin tài khoản thất bại!',
        data: null
      }
    }
    console.error('Get account info error:', error)
    return {
      success: false,
      message: 'Lấy thông tin tài khoản thất bại!',
      data: null
    }
  }
}

