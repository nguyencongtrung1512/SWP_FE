import React from 'react'
import { Modal, Form, Input, DatePicker, Select, Tooltip, InputNumber } from 'antd'
import { createMedication } from '../../../apis/medication.api'
import dayjs from 'dayjs'
import { InfoCircleOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

interface CreateMedicationProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const medicationTypes = [
  { label: 'Viên nén', value: 'Tablet' },
  { label: 'Viên nang', value: 'Capsule' },
  { label: 'Dung dịch', value: 'Solution' },
  { label: 'Bột', value: 'Powder' },
  { label: 'Siro', value: 'Syrup' },
  { label: 'Kem', value: 'Cream' },
  { label: 'Thuốc mỡ', value: 'Ointment' },
  { label: 'Thuốc tiêm', value: 'Injection' },
  { label: 'Nhỏ mắt', value: 'Eye Drops' },
  { label: 'Khác', value: 'Other' }
]

const CreateMedication: React.FC<CreateMedicationProps> = ({ isModalVisible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const selectedType = Form.useWatch('type', form)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createMedication({
        ...values,
        expiredDate: values.expiredDate.toISOString()
      })
      toast.success('Thêm thuốc mới thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating medication:', error)
      toast.error('Có lỗi xảy ra khi thêm thuốc mới!')
    } finally {
      setLoading(false)
    }
  }

  const getMedicationUnit = (type: string): string => {
    const typeUpper = type.toUpperCase()
    switch (typeUpper) {
      case 'TABLET':
        return 'viên'
      case 'CAPSULE':
        return 'viên'
      case 'SYRUP':
        return 'lọ'
      case 'CREAM':
        return 'tuýp'
      case 'OINTMENT':
        return 'tuýp'
      case 'SOLUTION':
        return 'lọ'
      case 'INJECTION':
        return 'ống'
      case 'EYE DROPS':
        return 'lọ'
      case 'POWDER':
        return 'gói'
      default:
        return 'đơn vị'
    }
  }

  const getMinMaxByType = (type: string): { min: number; max: number } => {
    switch (type?.toUpperCase()) {
      case 'TABLET':
      case 'CAPSULE':
        return { min: 1, max: 500 }
      case 'POWDER':
        return { min: 1, max: 100 }
      case 'SOLUTION':
      case 'SYRUP':
        return { min: 1, max: 200 }
      case 'CREAM':
      case 'OINTMENT':
        return { min: 1, max: 200 }
      case 'INJECTION':
        return { min: 1, max: 50 }
      default:
        return { min: 1, max: 999 }
    }
  }

  const { min, max } = getMinMaxByType(selectedType)
  const unitName = getMedicationUnit(selectedType || '')

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
          label={
            <span>
              Ngày hết hạn&nbsp;
              <Tooltip title='Ngày hết hạn phải cách hiện tại ít nhất 5 tháng và trong vòng 5 năm' className='ml-1'>
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Vui lòng chọn ngày hết hạn!' }
          ]}
        >
          <DatePicker
            placeholder='Chọn ngày hết hạn'
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            disabledDate={(current) => {
              const now = dayjs()
              const minDate = now.add(5, 'months')
              const maxDate = now.add(5, 'years')
              return current && (current < minDate || current > maxDate)
            }}
          />
        </Form.Item>

        <Form.Item
          name='quantity'
          label={`Số lượng ${unitName ? `(${unitName})` : ''}`}
          rules={[
            {
              validator: (_, value) => {
                if (value === undefined || value === null) return Promise.reject('Vui lòng nhập số lượng!')
                if (value < min || value > max) {
                  return Promise.reject(`Số lượng phải từ ${min} đến ${max} (${unitName})`)
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={`Nhập số lượng (${min}-${max})`}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMedication
