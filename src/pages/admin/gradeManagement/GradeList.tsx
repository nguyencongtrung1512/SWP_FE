import React, { useState } from 'react'
import { Card, Table, Button, Space, Typography, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CreateGrade from './Create'
import UpdateGrade from './Update'
import DeleteGrade from './Delete'

const { Title } = Typography

interface Grade {
  id: string
  name: string
  description: string
  totalClasses: number
  totalStudents: number
  status: string
}

const mockData: Grade[] = [
  {
    id: '1',
    name: 'Khối 1',
    description: 'Khối lớp 1 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 120,
    status: 'active'
  },
  {
    id: '2',
    name: 'Khối 2',
    description: 'Khối lớp 2 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 115,
    status: 'active'
  },
  {
    id: '3',
    name: 'Khối 3',
    description: 'Khối lớp 3 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 120,
    status: 'active'
  },
  {
    id: '4',
    name: 'Khối 4',
    description: 'Khối lớp 4 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 118,
    status: 'active'
  },
  {
    id: '5',
    name: 'Khối 5',
    description: 'Khối lớp 5 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 122,
    status: 'active'
  }
]

const GradeList: React.FC = () => {
  const navigate = useNavigate()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null)

  const handleViewClasses = (grade: Grade) => {
    navigate(`/admin/student-management/grades/${grade.id}/classes`)
  }

  const handleAddGrade = () => {
    setIsCreateModalVisible(true)
  }

  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade)
    setIsUpdateModalVisible(true)
  }

  const handleDeleteGrade = (grade: Grade) => {
    setDeletingGrade(grade)
  }

  const handleCreateOk = (values: any) => {
    // Xử lý thêm khối mới
    console.log('Thêm khối mới:', values)
    setIsCreateModalVisible(false)
  }

  const handleUpdateOk = (values: any) => {
    // Xử lý cập nhật khối
    console.log('Cập nhật khối:', values)
    setIsUpdateModalVisible(false)
    setEditingGrade(null)
  }

  const handleDeleteOk = () => {
    // Xử lý xóa khối
    console.log('Xóa khối:', deletingGrade)
    setDeletingGrade(null)
  }

  const columns = [
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
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Grade) => (
        <Space>
          <Button type='primary' icon={<EyeOutlined />} onClick={() => handleViewClasses(record)}>
            Xem lớp
          </Button>
          <Button type='primary' icon={<EditOutlined />} onClick={() => handleEditGrade(record)}>
            Sửa
          </Button>
          <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => handleDeleteGrade(record)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className='p-6 space-y-6'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-6'>
          <Title level={3}>Quản lý khối</Title>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleAddGrade}>
            Thêm khối mới
          </Button>
        </div>

        <Row gutter={[16, 16]} className='mb-6'>
          <Col span={8}>
            <Card className='bg-blue-50'>
              <Statistic title='Tổng số khối' value={mockData.length} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-green-50'>
              <Statistic
                title='Tổng số lớp'
                value={mockData.reduce((sum, grade) => sum + grade.totalClasses, 0)}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-purple-50'>
              <Statistic
                title='Tổng số học sinh'
                value={mockData.reduce((sum, grade) => sum + grade.totalStudents, 0)}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card className='shadow-md'>
          <Table columns={columns} dataSource={mockData} rowKey='id' pagination={false} />
        </Card>
      </div>

      <CreateGrade
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateOk}
      />

      <UpdateGrade
        isModalVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setEditingGrade(null)
        }}
        onOk={handleUpdateOk}
        editingGrade={editingGrade}
      />

      <DeleteGrade grade={deletingGrade} onOk={handleDeleteOk} onCancel={() => setDeletingGrade(null)} />
    </div>
  )
}

export default GradeList
