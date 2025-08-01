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

export interface HealthCheckList {
  nurseID: number
  classIds: number[]
  date: string
  healthCheckDescription: string
  weight: number
  height: number
  leftEye: number
  rightEye: number
  studentID: number
}

export interface HealthCheckCreateParams {
  nurseID: number
  classIds: number[]
  date: string
  healthCheckDescription: string
}

export interface HealthCheckRecord {
  healthCheckID: number
  studentID: number
  nurseID: number
  date: string
  result: string
  height: number
  weight: number
  leftEye: string
  rightEye: string
  healthCheckDescription: string
}

export const getHealthCheckNotifications = () => {
  return http.get<ApiResponse<HealthCheckNotification>>('/HealthCheck/ParentNotifications')
}

export const getRecordsByStudent = (studentId: number) => {
  return http.get<ApiResponse<HealthCheckRecord>>(`/HealthCheck/student/${studentId}`)
}

export const createHealthCheckList = (params: HealthCheckCreateParams) => {
  return http.post('/HealthCheck/CreateHealthCheckList', params)
}

export const getAllHealthChecks = () => {
  return http.get('/HealthCheck')
}

export const getRecordsByNurse= (nurseID: number) => {
  return http.get<ApiResponse<HealthCheckRecord>>(`/HealthCheck/nurse/${nurseID}`)
}

export const updateHealthCheck = (params: {}, healthCheckID : number) => {
  return http.put(`/HealthCheck/${healthCheckID}`, params)
}

export const deleteHealthCheck = (healthCheckID : number) => {
  return http.delete(`/HealthCheck/${healthCheckID}`)
}