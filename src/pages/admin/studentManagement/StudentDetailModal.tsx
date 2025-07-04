import { useEffect, useState } from 'react'
import { Modal, Descriptions, Typography, Spin, message } from 'antd'
import { getParentById, getStudentById } from '../../../apis/student'
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
  const [parent, setParent] = useState<any>(null)

  useEffect(() => {
    if (isModalVisible && studentId) {
      fetchStudentDetail()
    }
  }, [isModalVisible, studentId])

  const fetchStudentDetail = async () => {
    try {
      setLoading(true)
      const response = await getStudentById(Number(studentId))
      setStudent(response.data)
      if (response.data.parentId) {
        const parentRes = await getParentById(response.data.parentId)
        setParent(parentRes.data)
      } else {
        setParent(null)
      }
    } catch (error) {
      console.error('Error fetching student detail:', error)
      message.error('Có lỗi xảy ra khi tải thông tin học sinh!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Thông tin chi tiết học sinh'
      open={isModalVisible}
      onCancel={onCancel}
      width={900}
      footer={null}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
          <Spin size='large' />
        </div>
      ) : student ? (
        <>
          <Descriptions
            title='Thông tin học sinh'
            bordered
            column={3}
            labelStyle={{ width: 120 }}
            contentStyle={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            <Descriptions.Item label='Mã học sinh'>{student.studentCode}</Descriptions.Item>
            <Descriptions.Item label='Họ và tên'>{student.fullname}</Descriptions.Item>
            <Descriptions.Item label='Giới tính'>{student.gender === 'Male' ? 'Nam' : 'Nữ'}</Descriptions.Item>
            <Descriptions.Item label='Ngày sinh'>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</Descriptions.Item>
            <Descriptions.Item label='Ngày tạo'>{new Date(student.createdAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
            <Descriptions.Item label='Ngày cập nhật'>{new Date(student.updateAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
          </Descriptions>

          <Descriptions
            title='Thông tin phụ huynh'
            bordered
            column={3}
            style={{ marginTop: 24 }}
            labelStyle={{ width: 120 }}
            contentStyle={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            <Descriptions.Item label='Họ và tên'>{parent?.fullname || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label='Email'>{parent?.email || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label='Số điện thoại'>{parent?.phoneNumber || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label='Địa chỉ'>{parent?.address || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label='Ngày sinh'>
              {parent?.dateOfBirth
                ? new Date(parent.dateOfBirth).toLocaleDateString('vi-VN')
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>{parent?.status || 'Chưa cập nhật'}</Descriptions.Item>
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
