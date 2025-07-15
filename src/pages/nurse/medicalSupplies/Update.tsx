import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select, Tooltip, InputNumber } from 'antd'
import medicalSupplyApi from '../../../apis/medicalSupply.api'
import type { MedicalSupply } from '../../../apis/medicalSupply.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { InfoCircleOutlined } from '@ant-design/icons'

interface UpdateMedicalSupplyProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  selectedMedicalSupply: MedicalSupply | null
}

const UpdateMedicalSupply: React.FC<UpdateMedicalSupplyProps> = ({
  isModalVisible,
  onCancel,
  onSuccess,
  selectedMedicalSupply
}) => {
  const [form] = Form.useForm()
  const selectedType = Form.useWatch('type', form)
  const supplyName = Form.useWatch('name', form)

  useEffect(() => {
    if (selectedMedicalSupply) {
      const expiredDate = selectedMedicalSupply.expiredDate
        ? dayjs(selectedMedicalSupply.expiredDate.split('T')[0])
        : null

      form.setFieldsValue({
        ...selectedMedicalSupply,
        expiredDate
      })
    }
  }, [selectedMedicalSupply, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const medicalSupplyData: MedicalSupply = {
        ...values,
        expiredDate: values.expiredDate ? values.expiredDate.toISOString() : null,
      }

      if (selectedMedicalSupply) {
        await medicalSupplyApi.update(selectedMedicalSupply.medicalSupplyId, medicalSupplyData)
        toast.success('Cập nhật vật tư y tế thành công!')
        form.resetFields()
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating medical supply:', error)
      toast.error('Có lỗi xảy ra khi cập nhật vật tư y tế!')
    }
  }

  const handleClose = () => {
    form.resetFields()
    onCancel()
  }

  const getMedicalSupplyUnit = (type: string, name: string): string => {
    const typeUpper = type.toUpperCase()
    const nameUpper = name.toUpperCase()

    if (typeUpper === 'VẬT TƯ TIÊU HAO') {
      if (nameUpper.includes('BÔNG Y TẾ')) {
        return 'gói'
      }
      return 'chiếc'
    }

    switch (typeUpper) {
      case 'THIẾT BỊ ĐO':
        return 'thiết bị'
      case 'THIẾT BỊ HỖ TRỢ':
        return 'thiết bị'
      case 'BỘ DỤNG CỤ':
        return 'bộ'
      case 'DỤNG CỤ':
        return 'chiếc'
      default:
        return 'đơn vị'
    }
  }

  const unitName = getMedicalSupplyUnit(selectedType || '', supplyName || '')

  return (
    <Modal
      title='Cập nhật vật tư y tế'
      open={isModalVisible}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText='Cập nhật'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='name' label='Tên vật tư' rules={[{ required: true, message: 'Vui lòng nhập tên vật tư!' }]}>
          <Input placeholder='Nhập tên vật tư' />
        </Form.Item>

        <Form.Item name='type' label='Loại vật tư' rules={[{ required: true, message: 'Vui lòng chọn loại vật tư!' }]}>
          <Select
            placeholder='Chọn loại vật tư'
          >
            <Select.Option value='Vật tư tiêu hao'>Vật tư tiêu hao</Select.Option>
            <Select.Option value='Thiết bị đo'>Thiết bị đo</Select.Option>
            <Select.Option value='Thiết bị hỗ trợ'>Thiết bị hỗ trợ</Select.Option>
            <Select.Option value='Bộ dụng cụ'>Bộ dụng cụ</Select.Option>
            <Select.Option value='Dụng cụ'>Dụng cụ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea placeholder='Nhập mô tả về vật tư' />
        </Form.Item>

        <Form.Item
          name='expiredDate'
          label={
            <span>
              Ngày hết hạn&nbsp;
              <Tooltip title='Ngày hết hạn phải cách hiện tại ít nhất 6 tháng và trong vòng 15 năm' className='ml-1'>
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </span>
          }
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item
          name='quantity'
          label={`Số lượng ${unitName ? `(${unitName})` : ''}`}
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', min: 1, max: 999, message: 'Số lượng phải từ 1-999!' },
            { pattern: /^\d+(\.\d+)?$/, message: 'Số lượng phải là số dương!' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder='Nhập số lượng'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMedicalSupply
