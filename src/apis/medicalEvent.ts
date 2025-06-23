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
  medications?: { $id: string; $values: Array<{ medicationId: number; name?: string; quantityUsed?: number }> }
  medicalSupplies?: { $id: string; $values: Array<{ medicalSupplyId: number; name?: string; quantityUsed?: number }> }
}

interface MedicalEventResponse {
  $id: string
  $values: MedicalEvent[]
}

export interface MedicationUsed {
  medicationId: number
  quantityUsed: number
}

export interface MedicalSupplyUsed {
  medicalSupplyId: number
  quantityUsed: number
}

export interface CreateMedicalEventRequest {
  studentId: number
  type: string
  description: string
  note: string
  date: string
  medications: MedicationUsed[]
  medicalSupplies: MedicalSupplyUsed[]
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

export const getMedicalEventByParentId = (parentId: number) => {
  return http.get<MedicalEventResponse>(`MedicalEvent/GetMedicalEventByParent/${parentId}`)
}