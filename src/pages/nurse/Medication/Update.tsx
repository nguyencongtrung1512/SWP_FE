import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select, Tooltip, InputNumber } from 'antd'
import { updateMedication } from '../../../apis/medication'
import type { Medication } from '../../../apis/medication'
import dayjs from 'dayjs'
import { InfoCircleOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

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
  const selectedType = Form.useWatch('type', form)

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
      toast.success('Cập nhật thuốc thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error updating medication:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thuốc!')
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
          label={
            <span>
              Ngày hết hạn&nbsp;
              <Tooltip title='Ngày hết hạn phải cách hiện tại ít nhất 5 tháng và trong vòng 5 năm' className='ml-1'>
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            placeholder='Chọn ngày hết hạn'
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

export default UpdateMedication
