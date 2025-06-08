import http from '../utils/http'

const API_URL = `/accounts`
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
