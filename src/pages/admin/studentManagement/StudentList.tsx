import React from 'react'
import { Card, Table, Tag, Space, Typography, Button } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { students, classrooms, grades, levels } from './fakedata.ts'

const { Title } = Typography

interface Student {
  id: string
  studentCode: string
  fullName: string
  dateOfBirth: string
  gender: string
  gradeId: string
  classroomId: string
  parentName: string
  parentPhone: string
  address: string
  status: string
  healthStatus: string
}

const StudentList: React.FC = () => {
  const navigate = useNavigate()
  const { levelId, gradeId, classId } = useParams()
  const currentLevel = levels.find((level) => level.id === levelId)
  const currentGrade = grades.find((grade) => grade.id === gradeId)
  const currentClass = classrooms.find((classroom) => classroom.id === classId)
  const studentList = students.filter((student) => student.classroomId === classId)

  const studentColumns = [
    {
      title: 'Mã học sinh',
      dataIndex: 'studentCode',
      key: 'studentCode'
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === 'male' ? 'blue' : 'pink'}>{gender === 'male' ? 'Nam' : 'Nữ'}</Tag>
      )
    },
    {
      title: 'Phụ huynh',
      dataIndex: 'parentName',
      key: 'parentName'
    },
    {
      title: 'SĐT phụ huynh',
      dataIndex: 'parentPhone',
      key: 'parentPhone'
    },
    {
      title: 'Tình trạng sức khỏe',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'green' : 'orange'}>{status === 'normal' ? 'Bình thường' : 'Cần chú ý'}</Tag>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Space>
            <Button onClick={() => navigate(`/admin/student-management/level/${levelId}/grade/${gradeId}/classes`)}>
              Quay lại
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách học sinh - {currentClass?.name} - {currentGrade?.name} - {currentLevel?.name}
            </Title>
          </Space>
          <Table columns={studentColumns} dataSource={studentList} rowKey='id' pagination={false} />
        </Space>
      </Card>
    </div>
  )
}

export default StudentList
