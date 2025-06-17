import http from '../utils/http'

interface MedicationIds {
  $id: string
  $values: number[]
}

interface MedicationNames {
  $id: string
  $values: string[]
}

interface MedicalSupplyIds {
  $id: string
  $values: number[]
}

interface MedicalSupplyNames {
  $id: string
  $values: string[]
}

export interface MedicalEvent {
  $id: string
  medicalEventId: number
  studentId: number
  studentName: string
  nurseId: number
  nurseName: string
  medicationIds: MedicationIds
  medicationNames: MedicationNames
  medicalSupplyIds: MedicalSupplyIds
  medicalSupplyNames: MedicalSupplyNames
  type: string
  description: string
  note: string
  date: string
  studentCode: string
}

interface MedicalEventResponse {
  $id: string
  $values: MedicalEvent[]
}

export interface CreateMedicalEventRequest {
  studentId: number
  type: string
  description: string
  note: string
  date: string
  medicationIds: number[]
  medicalSupplyIds: number[]
}

export const getAllMedicalEvents = () => {
  return http.get<MedicalEventResponse>('MedicalEvent/GetAllMedicalEvents')
}

export const getMedicalEventById = (id: number) => {
  return http.get<MedicalEvent>(`MedicalEvent/GetMedicalEventById/${id}`)
}

export const createMedicalEvent = (data: CreateMedicalEventRequest) => {
  return http.post<MedicalEvent>('MedicalEvent/CreateMedicalEvent', data)
}

export const updateMedicalEvent = (id: number, data: CreateMedicalEventRequest) => {
  return http.put<MedicalEvent>(`MedicalEvent/UpdateMedicalEvent/${id}`, data)
}

export const deleteMedicalEvent = (id: number) => {
  return http.delete(`MedicalEvent/DeleteMedicalEvent/${id}`)
}