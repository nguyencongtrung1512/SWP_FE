import React from 'react'
import { Modal, Form, Input, DatePicker, Select, message } from 'antd'
import medicalSupplyApi from '../../../apis/medicalSupply'
import type { MedicalSupply } from '../../../apis/medicalSupply'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

interface CreateMedicalSupplyProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const CreateMedicalSupply: React.FC<CreateMedicalSupplyProps> = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const medicalSupplyData: MedicalSupply = {
        ...values,
        expiredDate: values.expiredDate.format('YYYY-MM-DD')
      }

      await medicalSupplyApi.create(medicalSupplyData)
      toast.success('Thêm vật tư y tế thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating medical supply:', error)
      message.error('Có lỗi xảy ra khi thêm vật tư y tế!')
    }
  }

  return (
    <Modal
      title='Thêm vật tư y tế mới'
      open={isModalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText='Thêm'
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
          rules={[
            { required: true, message: 'Vui lòng chọn ngày hết hạn!' },
            {
              validator: (_, value) => {
                if (value && value.isBefore(dayjs())) {
                  return Promise.reject('Ngày hết hạn không được nhỏ hơn ngày hiện tại!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMedicalSupply
