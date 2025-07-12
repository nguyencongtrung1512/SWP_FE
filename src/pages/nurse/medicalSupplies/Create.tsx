import React from 'react'
import { Modal, Form, Input, DatePicker, Select, InputNumber, Tooltip } from 'antd'
import medicalSupplyApi from '../../../apis/medicalSupply.api'
import type { MedicalSupply } from '../../../apis/medicalSupply.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { InfoCircleOutlined } from '@ant-design/icons'

interface CreateMedicalSupplyProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const CreateMedicalSupply: React.FC<CreateMedicalSupplyProps> = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const selectedType = Form.useWatch('type', form)
  const supplyName = Form.useWatch('name', form)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const medicalSupplyData: MedicalSupply = {
        ...values,
        expiredDate: values.expiredDate ? values.expiredDate.format('YYYY-MM-DD') : null,
      }

      await medicalSupplyApi.create(medicalSupplyData)
      toast.success('Thêm vật tư y tế thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating medical supply:', error)
      toast.error('Có lỗi xảy ra khi thêm vật tư y tế!')
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
      title='Thêm vật tư y tế mới'
      open={isModalVisible}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText='Thêm'
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
          rules={[
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
          <DatePicker
            placeholder='Chọn ngày hết hạn'
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            disabledDate={(current) => {
              const sixMonthsFromNow = dayjs().add(6, 'month').startOf('day')
              const fifteenYearsFromNow = dayjs().add(15, 'year').endOf('day')
              return current && (current < sixMonthsFromNow || current > fifteenYearsFromNow)
            }}
          />
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

export default CreateMedicalSupply
