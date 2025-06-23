import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, message, Select } from 'antd'
import { updateMedication } from '../../../apis/medication'
import type { Medication } from '../../../apis/medication'
import dayjs from 'dayjs'

interface UpdateMedicationProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  selectedMedication: Medication | null
}

const medicationTypes = [
  { label: 'Viên nén', value: 'Tablet' },
  { label: 'Viên nang', value: 'Capsule' },
  { label: 'Dung dịch', value: 'Solution' },
  { label: 'Hỗn dịch', value: 'Suspension' },
  { label: 'Bột', value: 'Powder' },
  { label: 'Kem', value: 'Cream' },
  { label: 'Thuốc mỡ', value: 'Ointment' },
  { label: 'Thuốc tiêm', value: 'Injection' },
  { label: 'Khác', value: 'Other' }
]

const UpdateMedication: React.FC<UpdateMedicationProps> = ({ isModalVisible, onCancel, onSuccess, selectedMedication }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (selectedMedication) {
      form.setFieldsValue({
        ...selectedMedication,
        expiredDate: dayjs(selectedMedication.expiredDate)
      })
    }
  }, [selectedMedication, form])

  const handleOk = async () => {
    if (!selectedMedication) return

    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateMedication(selectedMedication.medicationId, {
        ...values,
        expiredDate: values.expiredDate.toISOString()
      })
      message.success('Cập nhật thuốc thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error updating medication:', error)
      message.error('Có lỗi xảy ra khi cập nhật thuốc!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Cập nhật thông tin thuốc'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='name'
          label='Tên thuốc'
          rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
        >
          <Input placeholder='Nhập tên thuốc' />
        </Form.Item>

        <Form.Item
          name='type'
          label='Loại thuốc'
          rules={[{ required: true, message: 'Vui lòng chọn loại thuốc!' }]}
        >
          <Select
            placeholder='Chọn loại thuốc'
            options={medicationTypes}
            showSearch
            optionFilterProp='label'
          />
        </Form.Item>

        <Form.Item
          name='usage'
          label='Hướng dẫn sử dụng'
          rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn sử dụng!' }]}
        >
          <Input.TextArea
            placeholder='Nhập hướng dẫn sử dụng'
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name='expiredDate'
          label='Ngày hết hạn'
          rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            placeholder='Chọn ngày hết hạn'
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item name='quantity' label='Số lượng' rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
          <Input type='number' min={1} placeholder='Nhập số lượng' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateMedication
