import React from 'react'
import { Modal } from 'antd'

interface Grade {
  id: string
  name: string
}

interface DeleteGradeProps {
  grade: Grade | null
  onOk: () => void
  onCancel: () => void
}

const DeleteGrade: React.FC<DeleteGradeProps> = ({ grade, onOk, onCancel }) => {
  const handleDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa khối ${grade?.name}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        onOk()
      },
      onCancel: () => {
        onCancel()
      }
    })
  }

  return null
}

export default DeleteGrade
