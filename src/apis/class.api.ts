import http from '../utils/http'

export interface Class {
  classId: number
  className: string
}

export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export const getAllClasses = () => {
  return http.get<ApiResponse<Class>>('/Class/GetAllClasses')
}

export const getClassById = (id: number, data: Partial<Class>) => {
  return http.get<ApiResponse<Class>>(`Class/GetClassById/${id}`, { params: data })
}

export const createClass = (data: Omit<Class, 'classId'>) => {
  return http.post<ApiResponse<Class>>('/Class/CreateClass', data)
}

export const updateClass = (id: number, data: Partial<Class>) => {
  return http.put<ApiResponse<Class>>(`/Class/UpdateClass/${id}`, data)
}

export const deleteClass = (id: number) => {
  return http.delete<ApiResponse<void>>(`/Class/DeleteClass/${id}`)
}
