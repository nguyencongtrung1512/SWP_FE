import AppointmentForm from './AppointmentForm'
import AppointmentList from './AppointmentList'

const AppointmentPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-cyan-50 p-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12'>
        {/* Form đặt lịch bên trái */}
        <div className='md:col-span-2'>
          <AppointmentForm onSubmit={() => {}} />
        </div>
        {/* Danh sách lịch hẹn bên phải */}
        <div>
          <AppointmentList />
        </div>
      </div>
    </div>
  )
}

export default AppointmentPage
