import React from 'react'
import HTMLFlipBook from 'react-pageflip'
import {
  Heart,
  User,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Syringe,
  Shield,
  Stethoscope,
  Activity,
  Package,
  Pill,
  GraduationCap,
  BookOpen
} from 'lucide-react'

// Định nghĩa các kiểu dữ liệu cần thiết
interface Medication {
  medicationId: number
  name: string
  quantityUsed: number
}
interface MedicalSupply {
  medicalSupplyId: number
  name: string
  quantityUsed: number
}
interface MedicalEvent {
  medicalEventId: number
  type: string
  description: string
  note: string
  date: string
  nurseName: string
  medications: { $values: Medication[] }
  medicalSupplies: { $values: MedicalSupply[] }
}
interface VaccinationRecord {
  recordId?: number
  campaignId: number
  studentId: number
  nurseId: number
  dateInjected: string
  result: string
  immediateReaction: string
  note: string
}
interface HealthCheckRecord {
  healthCheckID: number
  studentID: number
  nurseID: number
  date: string
  result: string
  height: number
  weight: number
  leftEye: string
  rightEye: string
}
interface Student {
  studentId: number
  fullname: string
  classId: number
  className: string
  studentCode: string
  gender: string
  parentId: number
  parentName: string
  dateOfBirth: string
}

interface ElectronicHealthBookProps {
  student: Student
  medicalEvents: MedicalEvent[]
  vaccinations: VaccinationRecord[]
  healthChecks: HealthCheckRecord[]
}

// Hàm format ngày
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  // Nếu có giờ phút
  if (d.getHours() + d.getMinutes() > 0) {
    const hour = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${day}/${month}/${year} ${hour}:${min}`
  }
  return `${day}/${month}/${year}`
}

// Hàm tính tuổi
function calculateAge(birthDate: string) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDifference = today.getMonth() - birth.getMonth()
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const ElectronicHealthBook: React.FC<ElectronicHealthBookProps> = ({
  student,
  medicalEvents,
  vaccinations,
  healthChecks
}) => {
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-200px)] p-8'>
      <HTMLFlipBook
        width={400}
        height={520}
        minWidth={315}
        maxWidth={1000}
        minHeight={520}
        maxHeight={1536}
        size='fixed'
        startPage={0}
        drawShadow={true}
        flippingTime={600}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={true}
        showPageCorners={true}
        onFlip={() => { }}
        onChangeOrientation={() => { }}
        onChangeState={() => { }}
        className='shadow-2xl rounded-lg'
        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        disableFlipByClick={false}
      >
        {/* Bìa trước */}
        <div
          className='demoPage hard bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white font-bold flex flex-col items-center justify-center text-center rounded-2xl shadow-xl border-2 border-blue-200 relative overflow-hidden'
          data-density='hard'
        >
          {/* Background decoration */}
          <div className='absolute top-0 left-0 w-full h-full opacity-10'>
            <div className='absolute top-4 left-4'>
              <Heart className='w-8 h-8' />
            </div>
            <div className='absolute top-8 right-6'>
              <Stethoscope className='w-6 h-6' />
            </div>
            <div className='absolute bottom-6 left-8'>
              <Shield className='w-7 h-7' />
            </div>
            <div className='absolute bottom-4 right-4'>
              <Activity className='w-5 h-5' />
            </div>
          </div>

          {/* Main content */}
          <div className='relative z-10 flex flex-col items-center justify-center text-center h-full'>
            {/* Logo and brand */}
            <div className='flex items-center mb-6'>
              <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3'>
                <BookOpen className='w-8 h-8 text-white' />
              </div>
              <div className='text-left'>
                <div className='flex items-center'>
                  <span className='text-2xl font-bold text-white'>Edu</span>
                  <span className='text-2xl font-bold text-blue-100'>Care</span>
                </div>
                <div className='text-xs text-blue-100 opacity-80'>Health Management</div>
              </div>
            </div>

            {/* Title */}
            <div className='text-center mb-4'>
              <h1 className='text-xl font-bold mb-2 text-white drop-shadow-lg'>SỔ SỨC KHỎE ĐIỆN TỬ</h1>
              <div className='w-16 h-0.5 bg-white/60 mx-auto mb-3'></div>
              <p className='text-blue-100 text-sm font-medium'>Trường Tiểu học ABC</p>
            </div>

            {/* Additional info */}
            <div className='flex items-center text-xs text-blue-100 opacity-80'>
              <GraduationCap className='w-3 h-3 mr-1' />
              <span>Hệ thống quản lý sức khỏe học sinh</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className='absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full'></div>
          <div className='absolute -top-2 -left-2 w-12 h-12 bg-white/5 rounded-full'></div>
        </div>

        {/* Trang 1: Thông tin học sinh */}
        <div className='demoPage bg-gradient-to-br from-blue-50 to-purple-50 w-[400px] h-[420px] p-6 font-sans text-sm text-gray-700 rounded-2xl shadow border border-purple-100 overflow-y-auto'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-purple-100 h-full overflow-y-auto max-h-full'>
            <div className='flex items-center mb-4'>
              <User className='w-5 h-5 text-purple-600 mr-2' />
              <h2 className='text-lg font-bold text-purple-700'>Thông tin học sinh</h2>
            </div>

            <div className='space-y-3'>
              <div className='bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3'>
                <div className='flex items-center mb-2'>
                  <div className='w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-3'>
                    <User className='w-6 h-6 text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-bold text-purple-800 text-base'>{student.fullname}</h3>
                    <p className='text-purple-600 text-xs'>Mã HS: {student.studentCode}</p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='bg-blue-50 rounded-lg p-2 flex items-center'>
                  <Calendar className='w-3 h-3 text-blue-600 mr-1' />
                  <div>
                    <p className='text-blue-800 font-medium'>Tuổi</p>
                    <p className='text-blue-600'>{calculateAge(student.dateOfBirth)} tuổi</p>
                  </div>
                </div>

                <div className='bg-pink-50 rounded-lg p-2 flex items-center'>
                  <Users className='w-3 h-3 text-pink-600 mr-1' />
                  <div>
                    <p className='text-pink-800 font-medium'>Giới tính</p>
                    <p className='text-pink-600'>{student.gender}</p>
                  </div>
                </div>

                <div className='bg-green-50 rounded-lg p-2 flex items-center col-span-2'>
                  <div className='flex items-center mb-1'>
                    <MapPin className='w-3 h-3 text-green-600 mr-1' />
                    <p className='text-green-800 font-medium text-xs'>Lớp học</p>
                  </div>
                  <p className='text-green-600 font-semibold'>{student.className}</p>
                </div>
              </div>

              <div className='bg-purple-50 rounded-lg p-2'>
                <p className='text-purple-800 font-medium text-xs mb-1'>Ngày sinh</p>
                <p className='text-purple-600 font-semibold'>{formatDate(student.dateOfBirth)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trang 2: Lịch sử khám sức khỏe */}
        <div className='demoPage bg-gradient-to-br from-green-50 to-blue-50 w-[400px] h-[420px] p-6 font-sans text-sm text-gray-700 rounded-2xl shadow border border-green-100 overflow-y-auto'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-green-100 h-full overflow-y-auto max-h-full'>
            <div className='flex items-center mb-4'>
              <Stethoscope className='w-5 h-5 text-green-600 mr-2' />
              <h2 className='text-lg font-bold text-green-700'>Lịch sử khám sức khỏe</h2>
            </div>

            <div className='space-y-3'>
              {healthChecks.length === 0 ? (
                <div className='flex items-center justify-center h-32 text-gray-400'>
                  <div className='text-center'>
                    <Activity className='w-8 h-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>Chưa có dữ liệu khám sức khỏe</p>
                  </div>
                </div>
              ) : (
                healthChecks.map((hc) => (
                  <div
                    key={hc.healthCheckID}
                    className='bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 border border-green-200'
                  >
                    <div className='flex items-center mb-2'>
                      <Calendar className='w-4 h-4 text-green-600 mr-2' />
                      <span className='font-bold text-green-800 text-sm'>{formatDate(hc.date)}</span>
                    </div>

                    <div className='bg-white rounded-lg p-2 mb-2'>
                      <p className='text-green-700 font-medium text-xs mb-1'>Kết quả khám:</p>
                      <p className='text-green-600 font-semibold text-sm'>{hc.result}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-xs'>
                      <div className='bg-blue-50 rounded p-2 text-center'>
                        <p className='text-blue-800 font-medium'>Cân nặng</p>
                        <p className='text-blue-600 font-bold'>{hc.weight}kg</p>
                      </div>
                      <div className='bg-purple-50 rounded p-2 text-center'>
                        <p className='text-purple-800 font-medium'>Chiều cao</p>
                        <p className='text-purple-600 font-bold'>{hc.height}cm</p>
                      </div>
                      <div className='bg-orange-50 rounded p-2 text-center'>
                        <p className='text-orange-800 font-medium'>Mắt trái</p>
                        <p className='text-orange-600 font-bold'>{hc.leftEye}</p>
                      </div>
                      <div className='bg-pink-50 rounded p-2 text-center'>
                        <p className='text-pink-800 font-medium'>Mắt phải</p>
                        <p className='text-pink-600 font-bold'>{hc.rightEye}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Trang 3: Lịch sử tiêm chủng */}
        <div className='demoPage bg-gradient-to-br from-blue-50 to-indigo-50 w-[400px] h-[420px] p-6 font-sans text-sm text-gray-700 rounded-2xl shadow border border-blue-100 overflow-y-auto'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 h-full overflow-y-auto max-h-full'>
            <div className='flex items-center mb-4'>
              <Shield className='w-5 h-5 text-blue-600 mr-2' />
              <h2 className='text-lg font-bold text-blue-700'>Lịch sử tiêm chủng</h2>
            </div>

            <div className='space-y-3'>
              {vaccinations.length === 0 ? (
                <div className='flex items-center justify-center h-32 text-gray-400'>
                  <div className='text-center'>
                    <Syringe className='w-8 h-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>Chưa có dữ liệu tiêm chủng</p>
                  </div>
                </div>
              ) : (
                vaccinations.map((v) => (
                  <div
                    key={v.recordId}
                    className='bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 border border-blue-200'
                  >
                    <div className='flex items-center mb-2'>
                      <Calendar className='w-4 h-4 text-blue-600 mr-2' />
                      <span className='font-bold text-blue-800 text-sm'>{formatDate(v.dateInjected)}</span>
                    </div>

                    <div className='bg-white rounded-lg p-2 mb-2'>
                      <div className='flex items-center mb-1'>
                        <Syringe className='w-3 h-3 text-blue-600 mr-1' />
                        <p className='text-blue-800 font-medium text-xs'>Kết quả tiêm:</p>
                      </div>
                      <p className='text-blue-600 font-semibold text-sm'>{v.result}</p>
                    </div>

                    <div className='bg-orange-50 rounded-lg p-2'>
                      <div className='flex items-center mb-1'>
                        <AlertCircle className='w-3 h-3 text-orange-600 mr-1' />
                        <p className='text-orange-800 font-medium text-xs'>Phản ứng:</p>
                      </div>
                      <p className='text-orange-600 font-semibold text-sm'>{v.immediateReaction}</p>
                    </div>

                    {v.note && (
                      <div className='bg-gray-50 rounded-lg p-2 mt-2'>
                        <p className='text-gray-800 font-medium text-xs mb-1'>Ghi chú:</p>
                        <p className='text-gray-600 text-xs'>{v.note}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Trang 4: Sự kiện y tế */}
        <div className='demoPage bg-white w-[400px] h-[420px] p-8 font-sans text-base text-gray-700 flex flex-col justify-center rounded-2xl shadow border border-purple-100 overflow-y-auto'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-red-100 h-full overflow-y-auto max-h-full'>
            <div className='flex items-center mb-4'>
              <AlertCircle className='w-5 h-5 text-red-600 mr-2' />
              <h2 className='text-lg font-bold text-red-700'>Sự kiện y tế</h2>
            </div>

            <div className='space-y-3'>
              {medicalEvents.length === 0 ? (
                <div className='flex items-center justify-center h-32 text-gray-400'>
                  <div className='text-center'>
                    <Heart className='w-8 h-8 mx-auto mb-2 opacity-50' />
                    <p className='text-sm'>Chưa có sự kiện y tế</p>
                  </div>
                </div>
              ) : (
                medicalEvents.map((e) => (
                  <div
                    key={e.medicalEventId}
                    className='bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-3 border border-red-200'
                  >
                    <div className='flex items-center mb-2'>
                      <Calendar className='w-4 h-4 text-red-600 mr-2' />
                      <span className='font-bold text-red-800 text-sm'>{formatDate(e.date)}</span>
                    </div>

                    <div className='bg-white rounded-lg p-2 mb-2'>
                      <div className='flex items-center mb-1'>
                        <Activity className='w-3 h-3 text-red-600 mr-1' />
                        <p className='text-red-800 font-medium text-xs'>Loại sự kiện:</p>
                      </div>
                      <p className='text-red-600 font-semibold text-sm'>{e.type}</p>
                    </div>

                    <div className='bg-yellow-50 rounded-lg p-2 mb-2'>
                      <p className='text-yellow-800 font-medium text-xs mb-1'>Mô tả:</p>
                      <p className='text-yellow-700 text-sm'>{e.description}</p>
                    </div>

                    <div className='bg-purple-50 rounded-lg p-2 mb-2'>
                      <div className='flex items-center mb-1'>
                        <User className='w-3 h-3 text-purple-600 mr-1' />
                        <p className='text-purple-800 font-medium text-xs'>Y tá phụ trách:</p>
                      </div>
                      <p className='text-purple-600 font-semibold text-sm'>{e.nurseName}</p>
                    </div>

                    {e.medications.$values.length > 0 && (
                      <div className='bg-green-50 rounded-lg p-2 mb-2'>
                        <div className='flex items-center mb-1'>
                          <Pill className='w-3 h-3 text-green-600 mr-1' />
                          <p className='text-green-800 font-medium text-xs'>Thuốc sử dụng:</p>
                        </div>
                        <p className='text-green-600 text-sm font-medium'>
                          {e.medications.$values.map((m) => `${m.name} (${m.quantityUsed})`).join(', ')}
                        </p>
                      </div>
                    )}

                    {e.medicalSupplies.$values.length > 0 && (
                      <div className='bg-blue-50 rounded-lg p-2 mb-2'>
                        <div className='flex items-center mb-1'>
                          <Package className='w-3 h-3 text-blue-600 mr-1' />
                          <p className='text-blue-800 font-medium text-xs'>Vật tư y tế:</p>
                        </div>
                        <p className='text-blue-600 text-sm font-medium'>
                          {e.medicalSupplies.$values.map((m) => `${m.name} (${m.quantityUsed})`).join(', ')}
                        </p>
                      </div>
                    )}

                    {e.note && (
                      <div className='bg-gray-50 rounded-lg p-2'>
                        <p className='text-gray-800 font-medium text-xs mb-1'>Ghi chú:</p>
                        <p className='text-gray-600 text-xs'>{e.note}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bìa sau */}
        <div
          className='demoPage hard bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 text-white font-bold flex flex-col items-center justify-center text-center h-full text-2xl rounded-2xl shadow-xl border-2 border-blue-200 relative overflow-hidden'
          data-density='hard'
        >
          <div className='absolute top-0 left-0 w-full h-full opacity-10'></div>
          <div className='relative z-10 flex flex-col items-center justify-center h-full text-center gap-3'>
            <div>
              <Heart className='w-12 h-12 m-auto text-white/80' />
              <h2 className='text-lg font-bold text-white drop-shadow-lg'>Chăm sóc sức khỏe tốt nhất</h2>
              <p className='text-sm text-blue-100'>cho thế hệ tương lai</p>
            </div>
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  )
}

export default ElectronicHealthBook
