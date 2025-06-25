import React from 'react'
import { Modal, Form, Input, DatePicker, message, Select } from 'antd'
import { createMedication } from '../../../apis/medication'
import dayjs from 'dayjs'

interface CreateMedicationProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
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

const CreateMedication: React.FC<CreateMedicationProps> = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createMedication({
        ...values,
        expiredDate: values.expiredDate.toISOString()
      })
      message.success('Thêm thuốc mới thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating medication:', error)
      message.error('Có lỗi xảy ra khi thêm thuốc mới!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Thêm thuốc mới'
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
        <Form.Item name='name' label='Tên thuốc' rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}>
          <Input placeholder='Nhập tên thuốc' />
        </Form.Item>

        <Form.Item name='type' label='Loại thuốc' rules={[{ required: true, message: 'Vui lòng chọn loại thuốc!' }]}>
          <Select placeholder='Chọn loại thuốc' options={medicationTypes} showSearch optionFilterProp='label' />
        </Form.Item>

        <Form.Item
          name='usage'
          label='Hướng dẫn sử dụng'
          rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn sử dụng!' }]}
        >
          <Input.TextArea placeholder='Nhập hướng dẫn sử dụng' autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>

        <Form.Item
          name='expiredDate'
          label='Ngày hết hạn'
          rules={[
            { required: true, message: 'Vui lòng chọn ngày hết hạn!' }
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            placeholder='Chọn ngày hết hạn cách hiện tại ít nhất 5 tháng và không quá 5 năm'
            disabledDate={(current) => {
              const now = dayjs()
              const minDate = now.add(5, 'months')
              const maxDate = now.add(5, 'years')
              return current && (current < minDate || current > maxDate)
            }}
          />
        </Form.Item>

        <Form.Item name='quantity' label='Số lượng' rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
          <Input type='number' min={1} placeholder='Nhập số lượng' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMedication
