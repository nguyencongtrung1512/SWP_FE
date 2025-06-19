import http from '../utils/http'

const API_URL = `/ParentMedicationRequest`

export interface Medication {
  name: string
  type: string
  usage: string
  dosage: string
  expiredDate: string
  note: string
}

export interface CreateMedicationRequest {
  studentId: number
  parentNote: string
  medications: Medication[]
}

// Lấy tất cả yêu cầu thuốc
export const getAllRequests = () => http.get(`${API_URL}/GetAllRequests`).then((response) => response.data)

// Gửi yêu cầu thuốc mới
export const sendMedicationToStudent = (data: CreateMedicationRequest) =>
  http.post(`${API_URL}/SendMedicationToStudent`, data).then((response) => response.data)

// Cập nhật trạng thái yêu cầu
export const approveRequest = (requestId: number) =>
  http.put(`${API_URL}/ApproveRequest/${requestId}`).then((response) => response.data)
