import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Tag, Space, Typography, Modal, Row, Col, Statistic, Descriptions, Avatar } from 'antd'
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { students, classrooms } from './fakedata'

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

const StudentList: React.FC = () => {
  const { classId } = useParams<{ classId: string }>()
  const [studentList, setStudentList] = useState<Student[]>([])
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

  useEffect(() => {
    // Lấy thông tin lớp hiện tại
    const classroom = classrooms.find((c) => c.id === classId)
    if (classroom) {
      setCurrentClassroom(classroom)
    }

    // Lấy danh sách học sinh của lớp
    const studentsInClass = students.filter((s) => s.classroomId === classId)
    setStudentList(studentsInClass)
  }, [classId])

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student)
    setIsDetailModalVisible(true)
  }

  const columns = [
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
      title: 'Số điện thoại',
      dataIndex: 'parentPhone',
      key: 'parentPhone'
    },
    {
      title: 'Tình trạng sức khỏe',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'green' : 'orange'}>{status === 'normal' ? 'Bình thường' : 'Đặc biệt'}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Student) => (
        <Button type='primary' icon={<InfoCircleOutlined />} onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      )
    }
  ]

  if (!currentClassroom) {
    return <div>Không tìm thấy thông tin lớp</div>
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='mb-6'>
          <Title level={3}>Danh sách học sinh - {currentClassroom.name}</Title>
          <p className='text-gray-600'>Giáo viên chủ nhiệm: {currentClassroom.teacher}</p>
        </div>

        <Row gutter={[16, 16]} className='mb-6'>
          <Col span={8}>
            <Card className='bg-blue-100'>
              <Statistic title='Tổng số học sinh' value={studentList.length} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className='bg-green-100'>
              <Statistic title='Sức chứa lớp' value={currentClassroom.capacity} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
        </Row>

        <Card className='shadow-md'>
          <Table columns={columns} dataSource={studentList} rowKey='id' pagination={false} />
        </Card>
      </div>

      <Modal
        title='Thông tin chi tiết học sinh'
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedStudent && (
          <div className='p-4'>
            <div className='flex items-center mb-6'>
              <Avatar size={64} icon={<UserOutlined />} className='mr-4' />
              <div>
                <Title level={4}>{selectedStudent.fullName}</Title>
                <p className='text-gray-600'>Mã học sinh: {selectedStudent.studentCode}</p>
              </div>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label='Ngày sinh' span={2}>
                {selectedStudent.dateOfBirth}
              </Descriptions.Item>
              <Descriptions.Item label='Giới tính'>
                {selectedStudent.gender === 'male' ? 'Nam' : 'Nữ'}
              </Descriptions.Item>
              <Descriptions.Item label='Tình trạng sức khỏe'>
                <Tag color={selectedStudent.healthStatus === 'normal' ? 'green' : 'orange'}>
                  {selectedStudent.healthStatus === 'normal' ? 'Bình thường' : 'Đặc biệt'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Phụ huynh' span={2}>
                {selectedStudent.parentName}
              </Descriptions.Item>
              <Descriptions.Item label='Số điện thoại' span={2}>
                <Space>
                  <PhoneOutlined />
                  {selectedStudent.parentPhone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label='Địa chỉ' span={2}>
                <Space>
                  <EnvironmentOutlined />
                  {selectedStudent.address}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StudentList
