import React from 'react'
import { Card, Table, Button, Tag, Space, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { classrooms, grades, levels } from '../studentManagement/fakedata.ts'

const { Title } = Typography

interface Classroom {
  id: string
  gradeId: string
  name: string
  teacher: string
  totalStudents: number
  capacity: number
  description: string
  status: string
}

const ClassList: React.FC = () => {
  const navigate = useNavigate()
  const { levelId, gradeId } = useParams()
  const currentLevel = levels.find((level) => level.id === levelId)
  const currentGrade = grades.find((grade) => grade.id === gradeId)
  const classList = classrooms.filter((classroom) => classroom.gradeId === gradeId)

  const handleViewStudents = (classroom: Classroom) => {
    navigate(`/admin/student-management/level/${levelId}/grade/${gradeId}/class/${classroom.id}/students`)
  }

  const classColumns = [
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giáo viên chủ nhiệm',
      dataIndex: 'teacher',
      key: 'teacher'
    },
    {
      title: 'Số học sinh',
      key: 'students',
      render: (record: Classroom) => (
        <Tag color={record.totalStudents >= record.capacity ? 'red' : 'green'}>
          {record.totalStudents}/{record.capacity}
        </Tag>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Classroom) => (
        <Button type='primary' icon={<EyeOutlined />} onClick={() => handleViewStudents(record)}>
          Xem học sinh
        </Button>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Space>
            <Button onClick={() => navigate(`/admin/student-management/level/${levelId}/grades`)}>Quay lại</Button>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách lớp - {currentGrade?.name} - {currentLevel?.name}
            </Title>
          </Space>
          <Table columns={classColumns} dataSource={classList} rowKey='id' pagination={false} />
        </Space>
      </Card>
    </div>
  )
}

export default ClassList
