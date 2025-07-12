import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Table, Button, Card, Typography, Space, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getAllStudents, deleteStudent } from '../../../apis/student.api'
import type { Student } from '../../../apis/student.api'
import CreateStudent from './createStudent'
import UpdateStudent from './updateStudent'
import StudentDetailModal from './StudentDetailModal'

const { Title } = Typography

function StudentList() {
  const { classId } = useParams()
  const location = useLocation()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const className = location.state?.className || ''

  useEffect(() => {
    fetchStudents()
  }, [classId])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllStudents()

      const filteredStudents = response.data.$values.filter((student) => student.classId === Number(classId))
      setStudents(filteredStudents)
      console.log('phụ huynh ', filteredStudents)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (studentId: number) => {
    try {
      await deleteStudent(studentId)
      message.success('Xóa học sinh thành công!')
      fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      message.error('Có lỗi xảy ra khi xóa học sinh!')
    }
  }

  const handleViewDetail = (studentId: number) => {
    setSelectedStudentId(studentId)
    setIsDetailModalVisible(true)
  }

  const columns: ColumnsType<Student> = [
    {
      title: 'Mã học sinh',
      dataIndex: 'studentCode',
      key: 'studentCode'
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      key: 'fullname'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Phụ huynh',
      key: 'parentName',
      render: (_, record) =>
        record.parentName ||
        (record.parent && record.parent.fullname) ||
        'Chưa có thông tin'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='link' onClick={() => handleViewDetail(record.studentId)}>
            Chi tiết
          </Button>
          <Button
            type='link'
            onClick={() => {
              setSelectedStudent(record)
              setIsUpdateModalVisible(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa học sinh'
            description='Bạn có chắc chắn muốn xóa học sinh này?'
            onConfirm={() => handleDelete(record.studentId)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button type='link' danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Danh sách học sinh - Lớp {className}</Title>
        <Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
          Thêm học sinh mới
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={students} rowKey='studentId' loading={loading} />
      </Card>

      <CreateStudent
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false)
          fetchStudents()
        }}
        classId={Number(classId)}
      />

      <UpdateStudent
        isModalVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setSelectedStudent(null)
        }}
        onSuccess={() => {
          setIsUpdateModalVisible(false)
          setSelectedStudent(null)
          fetchStudents()
        }}
        selectedStudent={selectedStudent}
      />

      <StudentDetailModal
        isModalVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedStudentId(null)
        }}
        studentId={selectedStudentId}
      />
    </div>
  )
}

export default StudentList
