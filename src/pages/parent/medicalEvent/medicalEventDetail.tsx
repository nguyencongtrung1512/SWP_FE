import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Separator } from '../../../components/ui/separator'
import { Calendar, FileText, Stethoscope, Pill, Package, User } from 'lucide-react'

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
  console.log('selectedEvent:', selectedEvent)
  console.log('studentDetail:', studentDetail)

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Sốt':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Tai nạn':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Dịch bệnh':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className='space-y-8 max-w-3xl mx-auto'>
      {/* Event Header */}
      <Card className='rounded-2xl shadow-2xl bg-white/90 border-0'>
        <CardHeader className='pb-2'>
          <div className='flex items-center gap-4 mb-3'>
            <Badge
              className={`px-5 py-2 text-lg font-bold rounded-full shadow ${getEventTypeColor(selectedEvent.type)}`}
            >
              {selectedEvent.type}
            </Badge>
            <div className='flex items-center gap-2 text-base text-gray-500'>
              <Calendar className='h-5 w-5' />
              <span>{new Date(selectedEvent.date).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          <CardTitle className='text-2xl font-extrabold text-gray-800 tracking-tight drop-shadow'>
            {selectedEvent.description}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Event Details */}
      <Card className='rounded-2xl shadow-xl bg-white/90 border-0'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl font-bold text-blue-700'>
            <FileText className='h-6 w-6' />
            Chi tiết sự kiện
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6 text-base'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h4 className='font-semibold text-gray-700 mb-2'>Ngày:</h4>
              <p className='text-gray-700 text-lg'>{new Date(selectedEvent.date).toLocaleString('vi-VN')}</p>
            </div>
            <div>
              <h4 className='font-semibold text-gray-700 mb-2'>Loại sự kiện:</h4>
              <Badge
                className={`rounded-full px-4 py-1 text-base font-semibold shadow ${getEventTypeColor(selectedEvent.type)}`}
              >
                {selectedEvent.type}
              </Badge>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className='font-semibold text-gray-700 mb-2'>Mô tả:</h4>
            <p className='text-gray-700 text-lg'>{selectedEvent.description}</p>
          </div>
          {selectedEvent.note && (
            <div>
              <h4 className='font-semibold text-gray-700 mb-2'>Ghi chú:</h4>
              <div className='bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500'>
                <p className='text-blue-700 italic text-base'>{selectedEvent.note}</p>
              </div>
            </div>
          )}
          <div>
            <h4 className='font-semibold text-gray-700 mb-2'>Y tá phụ trách:</h4>
            <div className='flex items-center gap-3 text-lg'>
              <Stethoscope className='h-5 w-5 text-blue-600' />
              <span className='text-blue-700 font-semibold'>{selectedEvent.nurseName || 'Không có thông tin'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Information */}
      {(selectedEvent.student || studentDetail) && (
        <Card className='rounded-2xl shadow-xl bg-white/90 border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-xl font-bold text-indigo-700'>
              <User className='h-6 w-6' />
              Thông tin học sinh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-base'>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Họ tên:</h4>
                <p className='text-gray-700 text-lg'>
                  {selectedEvent.student?.fullname ||
                    studentDetail?.fullname ||
                    selectedEvent.student?.studentName ||
                    'Không có'}
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Mã học sinh:</h4>
                <p className='text-gray-700 text-lg'>
                  {selectedEvent.student?.studentCode || studentDetail?.studentCode || 'Không có'}
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Giới tính:</h4>
                <p className='text-gray-700 text-lg'>
                  {selectedEvent.student?.gender || studentDetail?.gender || 'Không có'}
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Ngày sinh:</h4>
                <p className='text-gray-700 text-lg'>
                  {selectedEvent.student?.dateOfBirth || studentDetail?.dateOfBirth || 'Không có'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications Used */}
      {selectedEvent.medications?.$values && selectedEvent.medications.$values.length > 0 && (
        <Card className='rounded-2xl shadow-xl bg-white/90 border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-xl font-bold text-green-700'>
              <Pill className='h-6 w-6' />
              Thuốc đã sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {selectedEvent.medications.$values.map((medication, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all'
                >
                  <Pill className='h-5 w-5 text-green-600' />
                  <span className='text-green-800 font-semibold text-lg'>{medication.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical Supplies Used */}
      {selectedEvent.medicalSupplies?.$values && selectedEvent.medicalSupplies.$values.length > 0 && (
        <Card className='rounded-2xl shadow-xl bg-white/90 border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-xl font-bold text-blue-700'>
              <Package className='h-6 w-6' />
              Vật tư y tế đã sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {selectedEvent.medicalSupplies.$values.map((supply, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all'
                >
                  <Package className='h-5 w-5 text-blue-600' />
                  <span className='text-blue-800 font-semibold text-lg'>{supply.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nurse Information */}
      {selectedEvent.nurse && (
        <Card className='rounded-2xl shadow-xl bg-white/90 border-0'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-xl font-bold text-blue-700'>
              <Stethoscope className='h-6 w-6' />
              Thông tin y tá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-base'>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Họ tên:</h4>
                <p className='text-gray-700 text-lg'>{selectedEvent.nurse.fullname || 'Không có'}</p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Email:</h4>
                <p className='text-gray-700 text-lg'>{selectedEvent.nurse.email || 'Không có'}</p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-700 mb-1'>Số điện thoại:</h4>
                <p className='text-gray-700 text-lg'>{selectedEvent.nurse.phoneNumber || 'Không có'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MedicalEventDetail
