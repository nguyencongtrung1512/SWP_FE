import React from 'react'
import { Modal } from 'antd'

interface Class {
  id: string
  gradeId: string
  name: string
  teacher: string
  totalStudents: number
  capacity: number
  description: string
  status: string
}

interface DeleteClassProps {
  isModalVisible: boolean
  onCancel: () => void
  onOk: () => void
  deletingClass: Class | null
}

const DeleteClass: React.FC<DeleteClassProps> = ({ isModalVisible, onCancel, onOk, deletingClass }) => {
  return (
    <Modal
      title='Xác nhận xóa'
      open={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText='Xóa'
      okType='danger'
      cancelText='Hủy'
    >
      <p>Bạn có chắc chắn muốn xóa lớp {deletingClass?.name}?</p>
      <p className='text-red-500'>Lưu ý: Hành động này không thể hoàn tác!</p>
    </Modal>
  )
}

export default DeleteClass
