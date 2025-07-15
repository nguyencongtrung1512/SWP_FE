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

export interface MedicationRequestHistory {
  className: string;
  studentCode: string;
  requestId: number;
  studentId: number;
  studentName: string;
  parentNote: string;
  dateCreated: string;
  nurseNote: string;
  status: string;
  medications: { $values: Medication[] };
}

export interface MedicationRequestUpdate {
  parentNote: string;
  medications: Medication[];
}

export interface ProcessRequestPayload {
  status: 'Approved' | 'Rejected'
  nurseNote?: string
}

export const getAllRequests = () => http.get(`${API_URL}/GetAllRequests`).then((response) => response.data)

export const sendMedicationToStudent = (data: CreateMedicationRequest) =>
  http.post(`${API_URL}/SendMedicationToStudent`, data).then((response) => response.data)

export const processRequest = (requestId: number, data: ProcessRequestPayload) =>
  http.put(`${API_URL}/ApproveRequest/${requestId}`, data).then((response) => response.data)

export const getRequestById = (id: number) =>
  http.get(`${API_URL}/GetById/${id}`).then((response) => response.data)

export const updateRequest = (id: number, data: MedicationRequestUpdate) =>
  http.put(`${API_URL}/UpdateRequest/${id}`, data).then((response) => response.data)

export const getRequestHistory = () =>
  http.get(`${API_URL}/History`).then((response) => response.data)
