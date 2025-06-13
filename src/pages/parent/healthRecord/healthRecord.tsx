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
  healthRecordId: number
  parentId: number
  name: string
  dob: string
  gender: string
  class: string
  studentId: string
  studentCode: string
  healthInfo: string
  note: string
  bloodType: string
  height: string
  weight: string
  bmi: string
  nutritionalStatus:
    | 'Suy dinh dưỡng'
    | 'Bình thường'
    | 'Thừa cân'
    | 'Béo phì'
    | 'Béo phì độ I'
    | 'Béo phì độ II'
    | 'Béo phì độ III'
}

const initialStudents: Student[] = [
  {
    id: 1,
    healthRecordId: 101,
    parentId: 1,
    name: 'Nguyễn Văn An',
    dob: '15/05/2012',
    gender: 'Nam',
    class: '5A',
    studentId: 'HS2024001',
    studentCode: 'AN_2012_001',
    healthInfo: 'Tiêm đủ vắc xin theo quy định. Dị ứng với tôm, cua. Cần theo dõi khi ăn hải sản.',
    note: 'Học sinh năng động, sức khỏe tốt. Cần chú ý theo dõi dị ứng hải sản.',
    bloodType: 'A+',
    height: '145 cm',
    weight: '35 kg',
    bmi: '16.7',
    nutritionalStatus: 'Bình thường'
  },
  {
    id: 2,
    healthRecordId: 102,
    parentId: 2,
    name: 'Nguyễn Thị Bình',
    dob: '22/09/2014',
    gender: 'Nữ',
    class: '3B',
    studentId: 'HS2024002',
    studentCode: 'BINH_2014_002',
    healthInfo: 'Hen suyễn nhẹ, cần mang theo ống hít dự phòng. Đã tiêm đầy đủ vắc xin.',
    note: 'Cần chú ý theo dõi hen suyễn, mang theo thuốc dự phòng khi đi học.',
    bloodType: 'O+',
    height: '128 cm',
    weight: '27 kg',
    bmi: '16.4',
    nutritionalStatus: 'Bình thường'
  },
  {
    id: 3,
    healthRecordId: 103,
    parentId: 3,
    name: 'Trần Văn Cường',
    dob: '01/01/2013',
    gender: 'Nam',
    class: '4C',
    studentId: 'HS2024003',
    studentCode: 'CUONG_2013_003',
    healthInfo: 'Sức khỏe tốt, không có tiền sử bệnh lý đặc biệt.',
    note: 'Không có ghi chú đặc biệt.',
    bloodType: 'B-',
    height: '138 cm',
    weight: '38 kg',
    bmi: '20.0',
    nutritionalStatus: 'Thừa cân'
  },
  {
    id: 4,
    healthRecordId: 104,
    parentId: 4,
    name: 'Lê Thị Diệu',
    dob: '10/03/2015',
    gender: 'Nữ',
    class: '2A',
    studentId: 'HS2024004',
    studentCode: 'DIEU_2015_004',
    healthInfo: 'Sức khỏe ổn định, đã tiêm phòng đầy đủ.',
    note: 'Không có ghi chú đặc biệt.',
    bloodType: 'AB+',
    height: '115 cm',
    weight: '20 kg',
    bmi: '15.1',
    nutritionalStatus: 'Bình thường'
  }
]

const HealthRecord = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student>(initialStudents[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleEdit = (student: Student) => {
    form.setFieldsValue({
      ...student,
      height: student.height.replace(' cm', ''), // Remove " cm" for editing
      weight: student.weight.replace(' kg', '') // Remove " kg" for editing
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedStudents = students.map((s) =>
        s.id === selectedStudent.id
          ? {
              ...s,
              ...values,
              height: `${values.height} cm`, // Add " cm" back for display
              weight: `${values.weight} kg` // Add " kg" back for display
            }
          : s
      )
      setStudents(updatedStudents) // Update the main students state
      setSelectedStudent(updatedStudents.find((s) => s.id === selectedStudent.id) || initialStudents[0])
      message.success('Cập nhật thông tin thành công!')
      setIsModalOpen(false)
    })
  }

  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'healthRecordId' | 'parentId' | 'studentCode'>) => {
    const newId = Math.max(...students.map((s) => s.id)) + 1
    const newHealthRecordId = Math.max(...students.map((s) => s.healthRecordId)) + 1
    const newParentId = Math.max(...students.map((s) => s.parentId)) + 1
    const newStudentCode = `HS${new Date().getFullYear()}${String(newId).padStart(3, '0')}`

    const newStudent: Student = {
      id: newId,
      healthRecordId: newHealthRecordId,
      parentId: newParentId,
      studentCode: newStudentCode,
      ...newStudentData,
      height: `${newStudentData.height} cm`,
      weight: `${newStudentData.weight} kg`
    }

    setStudents([...students, newStudent])
    setSelectedStudent(newStudent) // Select the newly added student
    message.success('Đăng ký thông tin con thành công!')
    setIsAddModalOpen(false)
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
            onClick={() => setIsAddModalOpen(true)}
          >
            Đăng ký hồ sơ sức khỏe
          </Button>
        </div>
        <div className='flex justify-start mb-8 space-x-4'>
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2
                      ${
                        selectedStudent.id === student.id
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
            <p className='text-blue-100 mt-1'>Mã số: {selectedStudent.studentCode}</p>
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
              <InfoItem
                icon={<UserOutlined className='text-blue-500' />}
                label='Mã học sinh'
                value={selectedStudent.studentId}
              />
              <InfoItem
                icon={<MedicineBoxOutlined className='text-blue-500' />}
                label='Mã hồ sơ sức khỏe'
                value={selectedStudent.healthRecordId.toString()}
              />
            </div>

            <div className='bg-blue-50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
                <MedicineBoxOutlined className='text-blue-500 mr-2' />
                Thông tin sức khỏe
              </h3>
              <p className='text-gray-600 mb-4'>{selectedStudent.healthInfo}</p>
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-white rounded-lg p-3'>
                  <span className='text-gray-500 text-sm'>Chiều cao</span>
                  <p className='font-medium text-gray-900 text-lg'>{selectedStudent.height}</p>
                </div>
                <div className='bg-white rounded-lg p-3'>
                  <span className='text-gray-500 text-sm'>Cân nặng</span>
                  <p className='font-medium text-gray-900 text-lg'>{selectedStudent.weight}</p>
                </div>
                <div className='bg-white rounded-lg p-3'>
                  <span className='text-gray-500 text-sm'>Chỉ số BMI</span>
                  <p className='font-medium text-gray-900 text-lg'>{selectedStudent.bmi}</p>
                </div>
              </div>
              <div className='mt-4 bg-white rounded-lg p-3'>
                <span className='text-gray-500 text-sm'>Tình trạng dinh dưỡng</span>
                <p className='font-medium text-gray-900 text-lg'>{selectedStudent.nutritionalStatus}</p>
              </div>
              <div className='mt-4 bg-white rounded-lg p-3'>
                <span className='text-gray-500 text-sm'>Ghi chú</span>
                <p className='font-medium text-gray-900 text-lg'>{selectedStudent.note}</p>
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
            <Form.Item name='height' label='Chiều cao'>
              <Input />
            </Form.Item>
            <Form.Item name='weight' label='Cân nặng'>
              <Input />
            </Form.Item>
            <Form.Item name='bmi' label='Chỉ số BMI'>
              <Input />
            </Form.Item>
            <Form.Item name='nutritionalStatus' label='Tình trạng dinh dưỡng'>
              <Select>
                <Select.Option value='Suy dinh dưỡng'>Suy dinh dưỡng</Select.Option>
                <Select.Option value='Bình thường'>Bình thường</Select.Option>
                <Select.Option value='Thừa cân'>Thừa cân</Select.Option>
                <Select.Option value='Béo phì'>Béo phì</Select.Option>
                <Select.Option value='Béo phì độ I'>Béo phì độ I</Select.Option>
                <Select.Option value='Béo phì độ II'>Béo phì độ II</Select.Option>
                <Select.Option value='Béo phì độ III'>Béo phì độ III</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name='healthInfo' label='Thông tin sức khỏe'>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name='note' label='Ghi chú'>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
      <AddHealthRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
      />
    </div>
  )
}

interface AddHealthRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: Omit<Student, 'id' | 'healthRecordId' | 'parentId' | 'studentCode'>) => void
}

const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={<div className='text-xl font-bold'>Đăng ký thông tin con mới</div>}
      open={isOpen}
      onOk={handleOk}
      onCancel={onClose}
      width={600}
      okText='Thêm hồ sơ'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical' className='mt-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item name='height' label='Chiều cao (cm)'>
            <Input type='number' />
          </Form.Item>
          <Form.Item name='weight' label='Cân nặng (kg)'>
            <Input type='number' />
          </Form.Item>
          <Form.Item name='bmi' label='Chỉ số BMI'>
            <Input />
          </Form.Item>
          <Form.Item name='nutritionalStatus' label='Tình trạng dinh dưỡng'>
            <Select>
              <Select.Option value='Suy dinh dưỡng'>Suy dinh dưỡng</Select.Option>
              <Select.Option value='Bình thường'>Bình thường</Select.Option>
              <Select.Option value='Thừa cân'>Thừa cân</Select.Option>
              <Select.Option value='Béo phì'>Béo phì</Select.Option>
              <Select.Option value='Béo phì độ I'>Béo phì độ I</Select.Option>
              <Select.Option value='Béo phì độ II'>Béo phì độ II</Select.Option>
              <Select.Option value='Béo phì độ III'>Béo phì độ III</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item name='healthInfo' label='Thông tin sức khỏe'>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name='note' label='Ghi chú'>
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
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
