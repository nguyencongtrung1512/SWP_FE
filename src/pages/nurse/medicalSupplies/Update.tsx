import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd'
import medicalSupplyApi from '../../../apis/medicalSupply'
import type { MedicalSupply } from '../../../apis/medicalSupply'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

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
        expiredDate: values.expiredDate.toISOString()
      }

      if (selectedMedicalSupply) {
        await medicalSupplyApi.update(selectedMedicalSupply.$id!, medicalSupplyData)
        toast.success('Cập nhật vật tư y tế thành công!')
        form.resetFields()
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating medical supply:', error)
      toast.error('Có lỗi xảy ra khi cập nhật vật tư y tế!')
    }
  }
  return (
    <Modal
      title='Cập nhật vật tư y tế'
      open={isModalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText='Cập nhật'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='name' label='Tên vật tư' rules={[{ required: true, message: 'Vui lòng nhập tên vật tư!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='type' label='Loại vật tư' rules={[{ required: true, message: 'Vui lòng chọn loại vật tư!' }]}>
          <Select>
            <Select.Option value='Dụng cụ y tế'>Dụng cụ y tế</Select.Option>
            <Select.Option value='Vật tư tiêu hao'>Vật tư tiêu hao</Select.Option>
            <Select.Option value='Thiết bị y tế'>Thiết bị y tế</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name='expiredDate'
          label='Ngày hết hạn'
          rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMedicalSupply
