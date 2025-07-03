import React, { useEffect, useState } from 'react'
import { getAllClasses, deleteClass } from '../../../apis/class'
import { Select, message, Popconfirm } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { Class as ClassBase } from '../../../apis/class'
import CreateClass from '../classroomManagement/Create'
import UpdateClass from '../classroomManagement/Update'
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { getAllStudents } from '../../../apis/student'
import { getStudentDistribution, StudentDistributionResponse } from '../../../apis/dashboard.api'

type Class = ClassBase & { studentCount?: number }

function GradeList() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('1')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [studentDistribution, setStudentDistribution] = useState<StudentDistributionResponse | null>(null)

  useEffect(() => {
    fetchClasses()
    fetchStudentDistribution()
  }, [])

  const fetchClasses = async () => {
    try {
      const [classRes, studentRes] = await Promise.all([
        getAllClasses(),
        getAllStudents()
      ])
      const classList = classRes.data.$values
      const students = studentRes.data.$values

      // Tạo map classId -> số lượng học sinh
      const classIdToCount: Record<number, number> = {}
      students.forEach(stu => {
        classIdToCount[stu.classId] = (classIdToCount[stu.classId] || 0) + 1
      })

      // Gán studentCount cho từng lớp
      const classesWithCount = classList.map(cls => ({
        ...cls,
        studentCount: classIdToCount[cls.classId] || 0
      }))

      setClasses(classesWithCount)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchStudentDistribution = async () => {
    try {
      const res = await getStudentDistribution()
      setStudentDistribution(res.data)
    } catch (error) {
      console.error('Error fetching student distribution:', error)
    }
  }

  const handleDelete = async (classId: number) => {
    try {
      await deleteClass(classId)
      message.success('Xóa lớp thành công!')
      fetchClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      message.error('Có lỗi xảy ra khi xóa lớp!')
    }
  }

  const handleViewStudents = (classId: number, className: string) => {
    navigate(`/admin/students/${classId}`, { state: { className } })
  }

  const filteredClasses = classes.filter((cls) => cls.className.split('/')[0] === selectedGrade)

  const gradeOptions = [
    { value: '1', label: 'Khối 1' },
    { value: '2', label: 'Khối 2' },
    { value: '3', label: 'Khối 3' },
    { value: '4', label: 'Khối 4' },
    { value: '5', label: 'Khối 5' }
  ]

  return (
    <div className='min-h-screen bg-[#f4f7fb] p-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4'>
        <h2 className='text-3xl font-bold text-gray-800'>Quản lý lớp học</h2>
        <div className='flex gap-4 items-center'>
          <Select
            style={{ width: 160 }}
            value={selectedGrade}
            onChange={setSelectedGrade}
            options={gradeOptions}
            placeholder='Chọn khối'
            className='rounded-lg shadow-sm'
          />
          <button
            className='flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-colors'
            onClick={() => setIsCreateModalVisible(true)}
          >
            <span className='text-lg'>+</span> Thêm lớp mới
          </button>
        </div>
      </div>

      {/* Thống kê phân bố học sinh */}
      {studentDistribution && (
        <div className='mb-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='font-semibold mb-2'>Phân bố theo giới tính</div>
            {Object.entries(studentDistribution.byGender).map(([gender, count]) => (
              <div key={gender} className='flex justify-between'>
                <span>{gender === 'Male' ? 'Nam' : gender === 'Female' ? 'Nữ' : gender}</span>
                <span className='font-bold'>{count}</span>
              </div>
            ))}
          </div>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='font-semibold mb-2'>Phân bố theo nhóm tuổi</div>
            {Object.entries(studentDistribution.byAge).map(([age, count]) => (
              <div key={age} className='flex justify-between'>
                <span>{age}</span>
                <span className='font-bold'>{count}</span>
              </div>
            ))}
          </div>
          <div className='bg-white rounded-xl shadow p-4'>
            <div className='font-semibold mb-2'>Phân bố theo lớp học</div>
            {studentDistribution.byClass.$values.map((item) => (
              <div key={item.className} className='flex justify-between'>
                <span>{item.className}</span>
                <span className='font-bold'>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {filteredClasses.map((item) => (
          <div
            key={item.classId}
            className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow duration-200 min-h-[220px]'
          >
            <div className='text-xl font-bold text-gray-700 mb-2'>Lớp {item.className}</div>
            <div className='flex items-center gap-2 text-gray-500 mb-4'>
              <UserOutlined />
              <span>{item['studentCount'] || 0} học sinh</span>
            </div>
            <div className='flex flex-col gap-2 w-full mt-auto'>
              <button
                className='flex items-center gap-2 text-blue-600 hover:underline font-medium justify-center'
                onClick={() => handleViewStudents(item.classId, item.className)}
              >
                <EyeOutlined /> Xem học sinh
              </button>
              <button
                className='flex items-center gap-2 text-blue-500 hover:underline font-medium justify-center'
                onClick={() => {
                  setSelectedClass(item)
                  setIsUpdateModalVisible(true)
                }}
              >
                <EditOutlined /> Sửa
              </button>
              <Popconfirm
                title='Xóa lớp học'
                description='Bạn có chắc chắn muốn xóa lớp này?'
                onConfirm={() => handleDelete(item.classId)}
                okText='Xóa'
                cancelText='Hủy'
              >
                <button className='flex items-center gap-2 text-red-500 hover:underline font-medium justify-center'>
                  <DeleteOutlined /> Xóa
                </button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>

      <CreateClass
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false)
          fetchClasses()
        }}
      />

      <UpdateClass
        isModalVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setSelectedClass(null)
        }}
        onSuccess={() => {
          setIsUpdateModalVisible(false)
          setSelectedClass(null)
          fetchClasses()
        }}
        selectedClass={selectedClass}
      />
    </div>
  )
}

export default GradeList
