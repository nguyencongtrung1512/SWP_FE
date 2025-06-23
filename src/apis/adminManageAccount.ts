import http from '../utils/http'

const API_URL = `/accounts`

export interface Role {
  $id: string
  roleID: number
  roleName: string
  accounts: { $id: string; $values: string[] }
}

export interface User {
  $id: string
  accountID: number
  roleID: number
  email: string
  password?: string
  fullname: string
  address: string
  dateOfBirth: string
  phoneNumber: string
  createdAt: string
  updateAt: string
  status: 'Active' | 'Inactive'
  role: Role
  students: unknown[] | null
  passwordResetTokens: { $id: string; $values: unknown[] }
}

export interface Profile {
  email: string
  fullname: string
  address: string
  dateOfBirth: string
  phoneNumber: string
}

export const profileAdmin = {
  getProfileAdmin(id: string) {
    return http.get<Profile>(`${API_URL}/admin/${id}`)
  }
}

export const profileInfor = {
  getProfileInfor() {
    return http.get<Profile>(`${API_URL}/info`)
  }
}

export const getAllUser = {
  async getAllUsers(): Promise<User[]> {
    const response = await http.get<{ $id: string; $values: User[] }>(`${API_URL}/admin/All`)
    return response.data.$values
  }
}

export const deleteUser = {
  deleteUser(id: number) {
    return http.delete(`${API_URL}/admin/delete/${id}`)
  }
}

export const updateUserStatus = {
  updateStatus(id: number, status: string) {
    return http.patch(`${API_URL}/admin/update-status/${id}`, { status})
  }
}
