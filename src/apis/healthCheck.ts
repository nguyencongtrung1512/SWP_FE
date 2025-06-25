import http from '../utils/http'

export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export interface HealthCheckNotification {
  healthCheckID: number
  studentID: number
  studentName: string
  date: string
  healthCheckDescription: string
}

export const getHealthCheckNotifications = () => {
  return http.get<ApiResponse<HealthCheckNotification>>('/HealthCheck/ParentNotifications')
}

export const getRecordsByStudent = (studentId: number) => {
  return http.get<any[]>(`/HealthCheck/student/${studentId}`)
}