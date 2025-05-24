import React from 'react'
import { Card, Table, Button, Tag, Space, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { grades, levels } from '../studentManagement/fakedata.ts'

const { Title } = Typography

interface Grade {
  id: string
  levelId: string
  name: string
  description: string
  totalClasses: number
  totalStudents: number
  status: string
}

const GradeList: React.FC = () => {
  const navigate = useNavigate()
  const { levelId } = useParams()
  const currentLevel = levels.find((level) => level.id === levelId)
  const gradeList = grades.filter((grade) => grade.levelId === levelId)

  const handleViewClasses = (grade: Grade) => {
    navigate(`/admin/student-management/level/${levelId}/grade/${grade.id}/classes`)
  }

  const gradeColumns = [
    {
      title: 'Tên khối',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Số lớp',
      dataIndex: 'totalClasses',
      key: 'totalClasses'
    },
    {
      title: 'Tổng học sinh',
      dataIndex: 'totalStudents',
      key: 'totalStudents'
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
      render: (_: unknown, record: Grade) => (
        <Button type='primary' icon={<EyeOutlined />} onClick={() => handleViewClasses(record)}>
          Xem lớp
        </Button>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Space>
            <Button onClick={() => navigate(`/admin/student-management`)}>Quay lại</Button>
            <Title level={2} style={{ margin: 0 }}>
              Danh sách khối - {currentLevel?.name}
            </Title>
          </Space>
          <Table columns={gradeColumns} dataSource={gradeList} rowKey='id' pagination={false} />
        </Space>
      </Card>
    </div>
  )
}

export default GradeList
