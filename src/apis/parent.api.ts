import http from '../utils/http'
import { AxiosError } from 'axios'

const API_URL = '/Parent'
const API_ACCOUNT = '/accounts'
const API_HEALTH_RECORD = '/HealthRecord'

export interface Student {
  $id: string
  studentId: number
  fullname: string
  studentCode: string
  dateOfBirth: string
  gender: string
  address: string
  parentID: number
  parent: null
  classID: number
  className: string
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
        message: error.response?.data || 'Thêm con không thành công!',
        data: null
      }
    }
    console.error('Add student error:', error)
    return {
      success: false,
      message: 'Thêm con không thành công!',
      data: null
    }
  }
}

export const updateAccount = async (params: any) => {
  try {
    let config = {}
    if (params instanceof FormData) {
      config = { headers: { 'Content-Type': 'multipart/form-data' } }
    }
    console.log('Sending update request with params:', params)
    const response = await http.patch(`${API_ACCOUNT}/update`, params, config)
    console.log('Update response:', response.data)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Update account error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      })
      return {
        success: false,
        message: error.response?.data || 'Cập nhật thông tin thất bại!',
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
        message: error.response?.data || 'Đổi mật khẩu thất bại!',
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
        message: error.response?.data || 'Lấy thông tin tài khoản thất bại!',
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

export const getStudentInfo = async (studentCode: string) => {
  try {
    const response = await http.get(`/Parent/student-info/${studentCode}`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data || 'Lấy thông tin học sinh không thành công!',
        data: null
      }
    }
    console.error('Get student info error:', error)
    return {
      success: false,
      message: 'Lấy thông tin học sinh không thành công!',
      data: null
    }
  }
}

export interface HealthRecordData {
  weight: number
  height: number
  note: string
  leftEye: number
  rightEye: number
}

interface HealthRecordParams {
  parentID: number
  studentCode: string
  weight: number
  height: number
  leftEye: number
  rightEye: number
  note: string
}

export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export const addHealthRecord = async (params: HealthRecordParams) => {
  try {
    const response = await http.post(`${API_HEALTH_RECORD}/CreateHealthRecord`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Tạo hồ sơ sức khỏe không thành công!',
        data: null
      }
    }
    console.error('Add health record error:', error)
    return {
      success: false,
      message: 'Tạo hồ sơ sức khỏe không thành công!',
      data: null
    }
  }
}

export const editHealthRecord = async (id: number, params: HealthRecordParams) => {
  try {
    const response = await http.put(`${API_HEALTH_RECORD}/UpdateHealthRecord/${id}`, params)
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật hồ sơ sức khỏe không thành công!',
        data: null
      }
    }
    console.error('Edit health record error:', error)
    return {
      success: false,
      message: 'Cập nhật hồ sơ sức khỏe không thành công!',
      data: null
    }
  }
}

export const getHealthRecordsByStudentId = async (studentId: number) => {
  try {
    const response = await http.get(`${API_HEALTH_RECORD}/GetHealthRecordsByStudentId/${studentId}`)
    return {
      success: true,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin sức khỏe!',
        data: null
      }
    }
    console.error('Get health record error:', error)
    return {
      success: false,
      message: 'Không thể lấy thông tin sức khỏe!',
      data: null
    }
  }
}

export const getAllMedicalEventsForParent = async () => {
  try {
    const response = await http.get('/MedicalEvent/Parent/MedicalEvents')
    return {
      success: true,
      data: response.data,
      message: 'Lấy danh sách sự kiện y tế thành công!'
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy danh sách sự kiện y tế thất bại!',
        data: null
      }
    }
    console.error('Get all medical events for parent error:', error)
    return {
      success: false,
      message: 'Lấy danh sách sự kiện y tế thất bại!',
      data: null
    }
  }
}
