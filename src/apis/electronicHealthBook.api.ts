import http from "../utils/http"

// Interface cho thuốc được sử dụng
interface Medication {
  medicationId: number
  name: string
  quantityUsed: number
}

// Interface cho vật tư y tế được sử dụng
interface MedicalSupply {
  medicalSupplyId: number
  name: string
  quantityUsed: number
}

// Interface cho sự kiện y tế
export interface MedicalEvent {
  medicalEventId: number
  type: string
  description: string
  note: string
  date: string
  nurseName: string
  medications: {
    $values: Medication[]
  }
  medicalSupplies: {
    $values: MedicalSupply[]
  }
}

// Interface cho response của API
interface MedicalEventByStudentResponse {
  studentId: number
  studentName: string
  studentCode: string
  className: string
  events: {
    $values: MedicalEvent[]
  }
}

// API function để lấy sự kiện y tế theo học sinh
export const getMedicalEventByStudent = (studentId: number) => {
  return http.get<MedicalEventByStudentResponse>(`/MedicalEvent/Parent/MedicalEvents/${studentId}`)
}
