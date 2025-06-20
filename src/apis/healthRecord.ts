import http from '../utils/http'
import { AxiosError } from 'axios'

const API_HEALTH_RECORD = '/HealthRecord'

export const getAllHealthRecords = async () => {
  try {
    const response = await http.get(`${API_HEALTH_RECORD}/GetAllHealthRecords`)
    return {
      success: true,
      data: response.data,
      message: response.data.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data || 'Lấy danh sách hồ sơ sức khỏe thất bại!',
        data: null
      }
    }
    console.error('Get health records error:', error)
    return {
      success: false,
      message: 'Lấy danh sách hồ sơ sức khỏe thất bại!',
      data: null
    }
  }
}