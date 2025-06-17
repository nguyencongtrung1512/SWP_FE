import React from 'react'
import { Modal } from 'antd'
import medicalSupplyApi from '../../../apis/medicalSupply'
import type { MedicalSupply } from '../../../apis/medicalSupply'
import { toast } from 'react-toastify'

interface DeleteMedicalSupplyProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  selectedMedicalSupply: MedicalSupply | null
}

const DeleteMedicalSupply: React.FC<DeleteMedicalSupplyProps> = ({
  isModalVisible,
  onCancel,
  onSuccess,
  selectedMedicalSupply
}) => {
  const handleDelete = async () => {
    try {
      if (selectedMedicalSupply) {
        await medicalSupplyApi.delete(selectedMedicalSupply.$id!)
        toast.success('Xóa vật tư y tế thành công!')
        onSuccess()
      }
    } catch (error) {
      console.error('Error deleting medical supply:', error)
      toast.error('Có lỗi xảy ra khi xóa vật tư y tế!')
    }
  }

  return (
    <Modal
      title='Xóa vật tư y tế'
      open={isModalVisible}
      onCancel={onCancel}
      onOk={handleDelete}
      okText='Xóa'
      cancelText='Hủy'
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa vật tư y tế này không?</p>
    </Modal>
  )
}

export default DeleteMedicalSupply
