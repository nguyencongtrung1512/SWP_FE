import React, { useEffect, useState } from 'react'
import { getAllClasses, deleteClass } from '../../../apis/class'
import { Select, Card, List, Typography, Button, Popconfirm, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { Class } from '../../../apis/class'
import CreateClass from '../classroomManagement/Create'
import UpdateClass from '../classroomManagement/Update'

const { Title } = Typography

function GradeList() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('1')
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await getAllClasses()
      setClasses(response.data.$values)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
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
    { value: '1', label: 'Cấp 1' },
    { value: '2', label: 'Cấp 2' },
    { value: '3', label: 'Cấp 3' },
    { value: '4', label: 'Cấp 4' },
    { value: '5', label: 'Cấp 5' }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Quản lý lớp học</Title>
        <Button type='primary' onClick={() => setIsCreateModalVisible(true)}>
          Thêm lớp mới
        </Button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Select
          style={{ width: 200 }}
          value={selectedGrade}
          onChange={setSelectedGrade}
          options={gradeOptions}
          placeholder='Chọn cấp'
        />
      </div>

      <Card loading={loading}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={filteredClasses}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={`Lớp ${item.className}`}
                actions={[
                  <Button
                    type='link'
                    onClick={() => handleViewStudents(item.classId, item.className)}
                  >
                    Xem học sinh
                  </Button>,
                  <Button
                    type='link'
                    onClick={() => {
                      setSelectedClass(item)
                      setIsUpdateModalVisible(true)
                    }}
                  >
                    Sửa
                  </Button>,
                  <Popconfirm
                    title='Xóa lớp học'
                    description='Bạn có chắc chắn muốn xóa lớp này?'
                    onConfirm={() => handleDelete(item.classId)}
                    okText='Xóa'
                    cancelText='Hủy'
                  >
                    <Button type='link' danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                ]}
              >
              </Card>
            </List.Item>
          )}
        />
      </Card>

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
