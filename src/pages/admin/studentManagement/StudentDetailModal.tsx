import React, { useEffect, useState } from 'react'
import { Modal, Descriptions, Typography, Spin, message } from 'antd'
import { getStudentById } from '../../../apis/student'
import type { Student } from '../../../apis/student'

const { Title } = Typography

interface StudentDetailModalProps {
  isModalVisible: boolean
  onCancel: () => void
  studentId: number | null
}

function StudentDetailModal({ isModalVisible, onCancel, studentId }: StudentDetailModalProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isModalVisible && studentId) {
      fetchStudentDetail()
    }
  }, [isModalVisible, studentId])

  const fetchStudentDetail = async () => {
    try {
      setLoading(true)
      const response = await getStudentById(Number(studentId))
      console.log('API Response data:', response.data)
      setStudent(response.data)
    } catch (error) {
      console.error('Error fetching student detail:', error)
      message.error('Có lỗi xảy ra khi tải thông tin học sinh!')
    } finally {
      setLoading(false)
    }
  }

  console.log('Student state:', student)
  if (student) {
    console.log('student.parent:', student.parent)
  }

  return (
    <Modal title='Thông tin chi tiết học sinh' open={isModalVisible} onCancel={onCancel} width={800} footer={null}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
          <Spin size='large' />
        </div>
      ) : student ? (
        <>
          <Descriptions title='Thông tin học sinh' bordered>
            <Descriptions.Item label='Mã học sinh'>{student.studentCode}</Descriptions.Item>
            <Descriptions.Item label='Họ và tên'>{student.fullname}</Descriptions.Item>
            <Descriptions.Item label='Giới tính'>{student.gender === 'Male' ? 'Nam' : 'Nữ'}</Descriptions.Item>
            <Descriptions.Item label='Ngày sinh'>
              {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label='Ngày tạo'>
              {new Date(student.createdAt).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label='Ngày cập nhật'>
              {new Date(student.updateAt).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title='Thông tin phụ huynh' bordered style={{ marginTop: '24px' }}>
            <Descriptions.Item label='Họ và tên'>{student.parent?.fullname || 'Chưa Cập nhập'}</Descriptions.Item>
            <Descriptions.Item label='Email'>{student.parent?.email || 'Chưa Cập nhập'}</Descriptions.Item>
            <Descriptions.Item label='Số điện thoại'>
              {student.parent?.phoneNumber || 'Chưa Cập nhập'}
            </Descriptions.Item>
            <Descriptions.Item label='Địa chỉ'>{student.parent?.address || 'Chưa Cập nhập'}</Descriptions.Item>
            <Descriptions.Item label='Ngày sinh'>
              {student.parent?.dateOfBirth ? new Date(student.parent.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>{student.parent?.status || 'Chưa Cập nhập'}</Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <div style={{ padding: '24px' }}>
          <Title level={3}>Không tìm thấy thông tin học sinh</Title>
        </div>
      )}
    </Modal>
  )
}

export default StudentDetailModal
