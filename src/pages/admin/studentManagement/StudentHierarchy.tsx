import React from 'react'
import { Card, Table, Button, Tag, Space, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { levels } from './fakedata.ts'

const { Title } = Typography

interface Level {
  id: string
  name: string
  description: string
  totalGrades: number
  totalClasses: number
  totalStudents: number
  status: string
}

const StudentHierarchy: React.FC = () => {
  const navigate = useNavigate()

  const handleViewGrades = (level: Level) => {
    navigate(`/admin/student-management/level/${level.id}/grades`)
  }

  const levelColumns = [
    {
      title: 'Tên cấp',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Số khối',
      dataIndex: 'totalGrades',
      key: 'totalGrades'
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
      render: (_: unknown, record: Level) => (
        <Button type='primary' icon={<EyeOutlined />} onClick={() => handleViewGrades(record)}>
          Xem khối
        </Button>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Quản lý học sinh theo cấp</Title>
        <Table columns={levelColumns} dataSource={levels} rowKey='id' pagination={false} />
      </Card>
    </div>
  )
}

export default StudentHierarchy
