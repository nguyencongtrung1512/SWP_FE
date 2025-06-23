import React from 'react'
import { Modal, Descriptions } from 'antd'
import type { MedicalSupply } from '../../../apis/medicalSupply'
import dayjs from 'dayjs'

interface MedicalSupplyDetailProps {
  isModalVisible: boolean
  onCancel: () => void
  medicalSupply: MedicalSupply | null
}

const MedicalSupplyDetail: React.FC<MedicalSupplyDetailProps> = ({ isModalVisible, onCancel, medicalSupply }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = dateString.split('T')[0]
    return dayjs(date).format('DD/MM/YYYY')
  }

  return (
    <Modal title='Chi tiết vật tư y tế' open={isModalVisible} onCancel={onCancel} footer={null}>
      {medicalSupply && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label='Tên vật tư'>{medicalSupply.name}</Descriptions.Item>
          <Descriptions.Item label='Loại vật tư'>{medicalSupply.type}</Descriptions.Item>
          <Descriptions.Item label='Mô tả'>{medicalSupply.description}</Descriptions.Item>
          <Descriptions.Item label='Ngày hết hạn'>{formatDate(medicalSupply.expiredDate)}</Descriptions.Item>
          <Descriptions.Item label='Số lượng'>{medicalSupply.quantity}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  )
}

export default MedicalSupplyDetail
