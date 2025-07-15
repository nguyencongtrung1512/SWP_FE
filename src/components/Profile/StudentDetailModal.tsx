import { Modal } from 'antd'
import { Student as StudentBase } from '../../apis/parent.api'
import dayjs from 'dayjs'
import { UserOutlined } from '@ant-design/icons'

interface ClassInfo {
  name?: string
}

interface Student extends Omit<StudentBase, '_class'> {
  _class?: ClassInfo | null
}

interface StudentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ isOpen, onClose, student }) => {
  if (!student) return null

  const getGender = (gender: string) => {
    if (gender === 'Male') return 'Nam'
    if (gender === 'Female') return 'Nữ'
    return 'Chưa có thông tin'
  }

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={600} closable={false} className='p-0'>
      <div className='rounded-t-md bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 text-white flex items-center'>
        <UserOutlined className='mr-2' />
        <span className='text-lg font-semibold'>Thông tin học sinh: {student.fullname}</span>
      </div>
      <div className='bg-white p-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='font-semibold text-gray-700 mb-1 block'>Họ và tên</label>
            <input
              className='w-full rounded border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700 outline-none'
              value={student.fullname || 'Chưa có thông tin'}
              disabled
            />
          </div>
          <div>
            <label className='font-semibold text-gray-700 mb-1 block'>Mã học sinh</label>
            <input
              className='w-full rounded border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700 outline-none'
              value={student.studentCode || 'Chưa có thông tin'}
              disabled
            />
          </div>
          <div>
            <label className='font-semibold text-gray-700 mb-1 block'>Ngày sinh</label>
            <input
              className='w-full rounded border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700 outline-none'
              value={student.dateOfBirth ? dayjs(student.dateOfBirth).format('DD/MM/YYYY') : 'Chưa có thông tin'}
              disabled
            />
          </div>
          <div>
            <label className='font-semibold text-gray-700 mb-1 block'>Giới tính</label>
            <input
              className='w-full rounded border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700 outline-none'
              value={getGender(student.gender)}
              disabled
            />
          </div>
          <div>
            <label className='font-semibold text-gray-700 mb-1 block'>Lớp</label>
            <input
              className='w-full rounded border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700 outline-none'
              value={
                student.className || (student._class && student._class.name ? student._class.name : 'Chưa có thông tin')
              }
              disabled
            />
          </div>
        </div>
        <div className='flex justify-end mt-8'>
          <button
            className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold shadow transition-colors'
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default StudentDetailModal
