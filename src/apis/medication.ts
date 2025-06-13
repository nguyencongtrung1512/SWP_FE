import http from '../utils/http'

export interface Medication {
  medicationId: number
  name: string
  type: string
  usage: string
  expiredDate: string
  medicalEvents: any | null
}

export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export const getAllMedications = () => {
  return http.get<ApiResponse<Medication>>('/Medication/GetAllMedications')
}

export const getMedicationById = (id: number) => {
  return http.get<ApiResponse<Medication>>(`/Medication/GetMedicationById/${id}`)
}

export const createMedication = (data: Omit<Medication, 'medicationId' | 'medicalEvents'>) => {
  return http.post<ApiResponse<Medication>>('/Medication/CreateMedication', data)
}

export const updateMedication = (id: number, data: Partial<Medication>) => {
  return http.put<ApiResponse<Medication>>(`/Medication/UpdateMedication/${id}`, data)
}

export const deleteMedication = (id: number) => {
  return http.delete<ApiResponse<void>>(`/Medication/DeleteMedication/${id}`)
}