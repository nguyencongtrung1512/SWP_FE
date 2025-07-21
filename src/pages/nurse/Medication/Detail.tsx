import React from 'react'
import { Modal, Descriptions, Tag } from 'antd'
import type { Medication } from '../../../apis/medication.api'
import dayjs from 'dayjs'

interface MedicationDetailProps {
  isModalVisible: boolean
  onCancel: () => void
  medication: Medication | null
}

const MedicationDetail: React.FC<MedicationDetailProps> = ({ isModalVisible, onCancel, medication }) => {
  if (!medication) return null

  const isExpired = dayjs(medication.expiredDate).isBefore(dayjs())

  return (
    <Modal title='Chi tiết thuốc' open={isModalVisible} onCancel={onCancel} footer={null} width={600}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label='Tên thuốc'>{medication.name}</Descriptions.Item>
        <Descriptions.Item label='Loại thuốc'>{medication.type}</Descriptions.Item>
        <Descriptions.Item label='Hướng dẫn sử dụng'>{medication.usage}</Descriptions.Item>
        <Descriptions.Item label='Ngày hết hạn'>
          {dayjs(medication.expiredDate).format('DD/MM/YYYY')}
          {isExpired && (
            <Tag color='error' style={{ marginLeft: 8 }}>
              Đã hết hạn
            </Tag>
          )}
        </Descriptions.Item>
        {/* <Descriptions.Item label='Ngày tạo'>{dayjs(medication.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
        <Descriptions.Item label='Cập nhật lần cuối'>
          {dayjs(medication.updatedAt).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item> */}
        <Descriptions.Item label='Số lượng'>{medication.quantity}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default MedicationDetail
