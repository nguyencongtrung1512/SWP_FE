import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Typography, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { classrooms, grades } from '../studentManagement/fakedata'
import CreateClass from './Create'
import UpdateClass from './Update'
import DeleteClass from './Delete'

const { Title } = Typography

interface Classes {
  id: string
  gradeId: string
  name: string
  teacher: string
  totalStudents: number
  capacity: number
  description: string
  status: string
}

interface Grade {
  id: string
  name: string
  description: string
}

interface CreateClassForm {
  name: string
  teacher: string
  capacity: number
  description: string
  status: string
}

interface UpdateClassForm {
  name: string
  teacher: string
  capacity: number
  description: string
  status: string
}

const ClassList: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>()
  const navigate = useNavigate()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editingClass, setEditingClass] = useState<Classes | null>(null)
  const [deletingClass, setDeletingClass] = useState<Classes | null>(null)
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null)
  const [classList, setClassList] = useState<Classes[]>([])

  useEffect(() => {
    // Lấy thông tin khối hiện tại
    const grade = grades.find((g) => g.id === gradeId)
    if (grade) {
      setCurrentGrade(grade)
    }

    // Lấy danh sách lớp của khối
    const classes = classrooms.filter((c) => c.gradeId === gradeId)
    setClassList(classes)
  }, [gradeId])

  const handleAddClass = () => {
    setIsCreateModalVisible(true)
  }

  const handleEditClass = (classes: Classes) => {
    setEditingClass(classes)
    setIsUpdateModalVisible(true)
  }

  const handleDeleteClass = (classes: Classes) => {
    setDeletingClass(classes)
    setIsDeleteModalVisible(true)
  }

  const handleViewStudents = (classes: Classes) => {
    navigate(`/admin/student-management/classes/${classes.id}/students`)
  }

  const handleCreateOk = (values: CreateClassForm) => {
    // Xử lý thêm lớp mới
    console.log('Thêm lớp mới:', { ...values, gradeId })
    setIsCreateModalVisible(false)
  }

  const handleUpdateOk = (values: UpdateClassForm) => {
    // Xử lý cập nhật lớp
    console.log('Cập nhật lớp:', values)
    setIsUpdateModalVisible(false)
  }

  const handleDeleteOk = () => {
    // Xử lý xóa lớp
    console.log('Xóa lớp:', deletingClass)
    setIsDeleteModalVisible(false)
  }

  const columns = [
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Số học sinh',
      dataIndex: 'totalStudents',
      key: 'totalStudents'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Classes) => (
        <Space>
          <Button color='cyan' variant='outlined' icon={<UserOutlined />} onClick={() => handleViewStudents(record)}>
            Xem học sinh
          </Button>
          <Button color='purple' variant='outlined' icon={<EditOutlined />} onClick={() => handleEditClass(record)}>
            Sửa
          </Button>
          <Button color='danger' variant='outlined' icon={<DeleteOutlined />} onClick={() => handleDeleteClass(record)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ]

  if (!currentGrade) {
    return <div>Không tìm thấy thông tin khối</div>
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <Title level={3}>Danh sách lớp - {currentGrade.name}</Title>
            <p className='text-gray-600'>{currentGrade.description}</p>
          </div>
          <Button color='cyan' variant='outlined' icon={<PlusOutlined />} onClick={handleAddClass}>
            Thêm lớp mới
          </Button>
        </div>

        <Row gutter={[16, 16]} className='mb-6'>
          <Col span={8}>
            <Card className='bg-blue-100'>
              <Statistic title='Tổng số lớp' value={classList.length} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-green-100'>
              <Statistic
                title='Tổng số học sinh'
                value={classList.reduce((sum, classes) => sum + classes.totalStudents, 0)}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Card className='shadow-md'>
          <Table columns={columns} dataSource={classList} rowKey='id' pagination={false} />
        </Card>
      </div>

      <CreateClass
        isModalVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateOk}
      />

      <UpdateClass
        isModalVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateOk}
        editingClass={editingClass}
      />

      <DeleteClass
        isModalVisible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteOk}
        deletingClass={deletingClass}
      />
    </div>
  )
}

export default ClassList
