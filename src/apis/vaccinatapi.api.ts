import http from '../utils/http'

export interface VaccinationCampaign {
  campaignId: number
  name: string
  vaccineId: number
  vaccineName: string
  date: string
  description: string
  key?: string
}

export interface Vaccine {
  vaccineId: number
  name: string
  description: string
}

export interface VaccinationConsent {
  consentId: number
  campaignId: number
  campaignName: string
  studentId: number
  studentName: string
  isAgreed: boolean | null
  note: string | null
  dateConfirmed: string | null
  key?: string
}

export interface VaccinationRecord {
  recordId?: number
  campaignId: number
  studentId: number
  nurseId: number
  dateInjected: string
  result: string
  immediateReaction: string
  note: string
}

export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export const getAllVaccinationCampaigns = () => {
  return http.get<ApiResponse<VaccinationCampaign>>('/Vaccination/Campaigns')
}

export const createVaccinationCampaign = (data: {
  name: string
  vaccineId: number
  date: string
  description: string
  classIds: number[]
}) => {
  return http.post('/Vaccination/Campaign', data)
}

export const getVaccines = () => {
  return http.get<ApiResponse<Vaccine>>('/Vaccination/Vaccines')
}

export const createVaccine = (data: { name: string; description: string }) => {
  return http.post('/Vaccination/Vaccine', data)
}

export const getParentNotifications = () => {
  return http.get<ApiResponse<VaccinationConsent>>('/Vaccination/ParentNotifications')
}

export const sendConsent = (data: {
  campaignId: number
  studentId: number
  isAgreed: boolean
  note: string
}) => {
  return http.post('/Vaccination/Consent', data)
}

export const createVaccinationRecord = (data: VaccinationRecord) => {
  return http.post('/Vaccination/Record', data)
}
export const getConsentsByCampaign = (campaignId: number) => {
  return http.get<ApiResponse<VaccinationConsent>>(`/Vaccination/Consents/${campaignId}`)
}
export interface FollowUpPayload {
  recordId: number
  date: string
  reaction: string
  note: string
}

export const createFollowUp = (data: FollowUpPayload) => {
  return http.post('/Vaccination/FollowUp', data)
}

export const getVaccinationRecordsByCampaign = (campaignId: number) => {
  return http.get<ApiResponse<VaccinationRecord>>(`/Vaccination/Records/${campaignId}`)
}

export const getFollowUpsByRecord = (recordId: number) => {
  return http.get<any[]>(`/Vaccination/FollowUps/${recordId}`)
}

export const getRecordsByStudent = (studentId: number) => {
  return http.get<ApiResponse<VaccinationRecord>>(`/Vaccination/RecordsByStudent/${studentId}`)
}