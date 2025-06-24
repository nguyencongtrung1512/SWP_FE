import http from '../utils/http'

export interface HealthConsultationBookingPayload {
  studentId: number
  nurseId: number
  parentId: number
  scheduledTime: string
  reason: string
  studentCode: string
}

export const createHealthConsultationBookingByNurse = (data: HealthConsultationBookingPayload) => {
  return http.post('/HealthConsultationBooking/NurseBook', data)
}

export const createHealthConsultationBookingByParent = (data: HealthConsultationBookingPayload) => {
  return http.post('/HealthConsultationBooking/ParentBook', data)
}

export const getHealthConsultationBookingByParent = () => {
  return http.get('/HealthConsultationBooking/Parent')
}

export const getHealthConsultationBookingByNurse = () => {
  return http.get('/HealthConsultationBooking/Nurse')
}

export const getHealthConsultationBookingById = (id: number) => {
  return http.get(`/HealthConsultationBooking/${id}`)
}

export const confirmHealthConsultationBooking = (id: number) => {
  return http.put(`/HealthConsultationBooking/${id}/confirm`)
}

export const cancelHealthConsultationBooking = (id: number) => {
  return http.put(`/HealthConsultationBooking/${id}/cancel`)
}

export const doneHealthConsultationBooking = (id: number) => {
  return http.put(`/HealthConsultationBooking/${id}/done`)
}

export const getNurseListForHealthConsultation = () => {
  return http.get('/HealthConsultationBooking/Nurses')
}
