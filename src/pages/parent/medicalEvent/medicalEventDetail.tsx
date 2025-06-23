import React from 'react'
import { Descriptions } from 'antd'

interface Medication {
  name: string
}

interface MedicalSupply {
  name: string
}

interface Student {
  studentCode?: string
  fullname?: string
  gender?: string
  email?: string
  studentId?: string
  studentName?: string
  dateOfBirth?: string
  classID?: string
  classId?: string
}

interface Nurse {
  fullname?: string
  email?: string
  phoneNumber?: string
}

interface MedicalEventDetailProps {
  selectedEvent: {
    date: string
    type: string
    description: string
    note: string
    classId?: number
    student?: Student
    nurse?: Nurse
    medications?: { $values: Medication[] }
    medicalSupplies?: { $values: MedicalSupply[] }
    nurseName?: string
  }
  studentDetail?: Student | null
}

const MedicalEventDetail: React.FC<MedicalEventDetailProps> = ({ selectedEvent, studentDetail }) => {
  // Log dữ liệu truyền vào để debug
  console.log('selectedEvent:', selectedEvent)
  console.log('studentDetail:', studentDetail)
  return (
    <div className='space-y-6'>
      <Descriptions bordered>
        <Descriptions.Item label='Ngày'>{new Date(selectedEvent.date).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label='Loại sự kiện'>{selectedEvent.type}</Descriptions.Item>
        <Descriptions.Item label='Mô tả'>{selectedEvent.description}</Descriptions.Item>
        <Descriptions.Item label='Ghi chú'>{selectedEvent.note}</Descriptions.Item>
        <Descriptions.Item label='Y tá phụ trách'>{selectedEvent.nurseName || ''}</Descriptions.Item>
        <Descriptions.Item label='Thuốc'>
          {selectedEvent.medications?.$values && selectedEvent.medications.$values.length > 0
            ? selectedEvent.medications.$values.map((med) => med.name).join(', ')
            : 'Không sử dụng'}
        </Descriptions.Item>
        <Descriptions.Item label='Vật tư y tế'>
          {selectedEvent.medicalSupplies?.$values && selectedEvent.medicalSupplies.$values.length > 0
            ? selectedEvent.medicalSupplies.$values.map((sup) => sup.name).join(', ')
            : 'Không sử dụng'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default MedicalEventDetail
