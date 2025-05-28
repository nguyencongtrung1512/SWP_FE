import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, message } from 'antd'
import {
  EditOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  PlusOutlined
} from '@ant-design/icons'

interface Student {
  id: number
  name: string
  dob: string
  gender: string
  class: string
  studentId: string
  healthInfo: string
  bloodType: string
  height: string
  weight: string
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    dob: '15/05/2012',
    gender: 'Nam',
    class: '5A',
    studentId: 'HS2024001',
    healthInfo: 'Tiêm đủ vắc xin theo quy định. Dị ứng với tôm, cua. Cần theo dõi khi ăn hải sản.',
    bloodType: 'A+',
    height: '145 cm',
    weight: '35 kg'
  },
  {
    id: 2,
    name: 'Nguyễn Thị Bình',
    dob: '22/09/2014',
    gender: 'Nữ',
    class: '3B',
    studentId: 'HS2024002',
    healthInfo: 'Hen suyễn nhẹ, cần mang theo ống hít dự phòng. Đã tiêm đầy đủ vắc xin.',
    bloodType: 'O+',
    height: '128 cm',
    weight: '27 kg'
  }
]

const HealthRecord = () => {
  const [students] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student>(initialStudents[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleEdit = (student: Student) => {
    form.setFieldsValue(student)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    form.validateFields().then((values) => {
      message.success('Cập nhật thông tin thành công!')
      setIsModalOpen(false)
    })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-100'>
      <div className='w-full mx-auto px-20'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Hồ Sơ Sức Khỏe Học Sinh</h1>
            <p className='text-gray-600 text-lg mt-2'>Theo dõi và cập nhật thông tin sức khỏe của con bạn</p>
          </div>
          <Button
            type='primary'
            size='large'
            icon={<PlusOutlined />}
            className='bg-blue-500 hover:bg-blue-600 flex items-center'
          >
            Đăng ký thông tin con
          </Button>
        </div>
        <div className='flex justify-start mb-8 space-x-4'>
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2
                      ${selectedStudent.id === student.id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${selectedStudent.id === student.id ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-500'}`}
              >
                {student.name.charAt(0)}
              </div>
              <span className='font-medium'>{student.name}</span>
            </button>
          ))}
        </div>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-white'>{selectedStudent.name}</h2>
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={() => handleEdit(selectedStudent)}
                className='bg-white/20 border-none hover:bg-white/30'
              >
                Chỉnh sửa
              </Button>
            </div>
            <p className='text-blue-100 mt-1'>Mã số: {selectedStudent.studentId}</p>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-2 gap-6'>
              <InfoItem
                icon={<CalendarOutlined className='text-blue-500' />}
                label='Ngày sinh'
                value={selectedStudent.dob}
              />
              <InfoItem
                icon={<UserOutlined className='text-blue-500' />}
                label='Giới tính'
                value={selectedStudent.gender}
              />
              <InfoItem icon={<TeamOutlined className='text-blue-500' />} label='Lớp' value={selectedStudent.class} />
              <InfoItem
                icon={<HeartOutlined className='text-blue-500' />}
                label='Nhóm máu'
                value={selectedStudent.bloodType}
              />
            </div>

            <div className='bg-blue-50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
                <MedicineBoxOutlined className='text-blue-500 mr-2' />
                Thông tin sức khỏe
              </h3>
              <p className='text-gray-600 mb-4'>{selectedStudent.healthInfo}</p>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white rounded-lg p-3'>
                  <span className='text-gray-500 text-sm'>Chiều cao</span>
                  <p className='font-medium text-gray-900 text-lg'>{selectedStudent.height}</p>
                </div>
                <div className='bg-white rounded-lg p-3'>
                  <span className='text-gray-500 text-sm'>Cân nặng</span>
                  <p className='font-medium text-gray-900 text-lg'>{selectedStudent.weight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={<div className='text-xl font-bold'>Chỉnh sửa thông tin học sinh</div>}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        okText='Lưu thay đổi'
        cancelText='Hủy'
      >
        <Form form={form} layout='vertical' className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Form.Item name='name' label='Họ và tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
              <Input />
            </Form.Item>
            <Form.Item name='dob' label='Ngày sinh' rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}>
              <Input />
            </Form.Item>
            <Form.Item name='gender' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
              <Select>
                <Select.Option value='Nam'>Nam</Select.Option>
                <Select.Option value='Nữ'>Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name='class' label='Lớp' rules={[{ required: true, message: 'Vui lòng nhập lớp' }]}>
              <Input />
            </Form.Item>
            <Form.Item name='height' label='Chiều cao'>
              <Input />
            </Form.Item>
            <Form.Item name='weight' label='Cân nặng'>
              <Input />
            </Form.Item>
          </div>
          <Form.Item name='healthInfo' label='Thông tin sức khỏe'>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className='bg-gray-50 rounded-lg p-4 flex items-start space-x-3'>
    {icon}
    <div>
      <p className='text-gray-500 text-sm'>{label}</p>
      <p className='font-medium text-gray-900'>{value}</p>
    </div>
  </div>
)

export default HealthRecord
