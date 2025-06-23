import http from '../utils/http'

export interface MedicalSupply {
  $id?: number
  name: string
  type: string
  description: string
  expiredDate: string
  quantity: number
}

interface MedicalSupplyGetAllResponse {
  $values: MedicalSupply[]
}

const medicalSupplyApi = {
  getAll() {
    return http.get<MedicalSupplyGetAllResponse>('MedicalSupply/GetAll')
  },

  create(data: MedicalSupply) {
    return http.post<MedicalSupply>('MedicalSupply/Create', data)
  },

  getById(id: number) {
    return http.get<MedicalSupply>(`MedicalSupply/GetById/${id}`)
  },

  update(id: number, data: MedicalSupply) {
    return http.put<MedicalSupply>(`MedicalSupply/Update/${id}`, data)
  },

  delete(id: number) {
    return http.delete(`MedicalSupply/Delete/${id}`)
  }
}

export default medicalSupplyApi
