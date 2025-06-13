import http from '../utils/http'

export interface Parent {
  accountID: number
  roleID: number
  email: string
  fullname: string
  address: string
  dateOfBirth: string
  phoneNumber: string
  createdAt: string
  updateAt: string
  status: string
}

export interface Student {
  studentId: number
  fullname: string
  classId: number
  studentCode: string
  gender: string
  parentId: number
  dateOfBirth: string
  createdAt: string
  updateAt: string
  parent?: Parent | null
}

export interface ApiResponse<T> {
  $id: string
  $values: T[]
  message?: string
}

export const getAllStudents = () => {
  return http.get<ApiResponse<Student>>('/Student/GetAllStudents')
}

export const getStudentById = (id: number) => {
  return http.get<Student>(`/Student/GetStudentById/${id}`)
}

export const getStudentByCode = (studentCode: number) => {
  return http.get<ApiResponse<Student>>(`/Student/GetStudentByCode/${studentCode}`)
}

export const createStudent = (data: Omit<Student, 'studentId' | 'createdAt' | 'updateAt' | 'parent'>) => {
  return http.post<ApiResponse<Student>>('/Student/CreateStudent', data)
}

export const updateStudent = (id: number, data: Partial<Omit<Student, 'parent'>>) => {
  return http.put<ApiResponse<Student>>(`/Student/UpdateStudent/${id}`, data)
}

export const deleteStudent = (id: number) => {
  return http.delete<ApiResponse<void>>(`/Student/DeleteStudent/${id}`)
}
