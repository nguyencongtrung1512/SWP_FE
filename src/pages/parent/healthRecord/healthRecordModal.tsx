import React from 'react'
import { Modal, Form, Input, InputNumber, Button } from 'antd'
import { UserOutlined, HeartOutlined, SaveOutlined, FileTextOutlined } from '@ant-design/icons'

interface HealthRecordData {
  weight: number
  height: number
  note: string
}

interface Student {
  studentId: number
  fullname: string
  studentCode: string
}

interface HealthRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: HealthRecordData) => Promise<void>
  student: Student | null
  mode: 'add' | 'edit'
  initialData?: {
    weight?: number
    height?: number
    note?: string
  }
}

const HealthRecordModal: React.FC<HealthRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  mode,
  initialData
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      form.setFieldsValue({
        weight: initialData.weight,
        height: initialData.height,
        note: initialData.note || ''
      })
    } else if (isOpen && mode === 'add') {
      form.resetFields()
    }
  }, [isOpen, mode, initialData, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      await onSave({
        weight: parseFloat(values.weight),
        height: parseFloat(values.height),
        note: values.note || ''
      })
      form.resetFields()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-blue-500" />
          <span>
            {mode === 'add' ? 'Tạo hồ sơ sức khỏe' : 'Chỉnh sửa hồ sơ sức khỏe'}
            {student && ` - ${student.fullname}`}
          </span>
        </div>
      }
      open={isOpen}
      closable={false}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel} size="large">
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
          size="large"
          className="bg-blue-500 hover:bg-blue-600"
        >
          {mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      ]}
    >
      <div className="py-4">
        {student && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Thông tin học sinh</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Họ tên:</span>
                <p className="font-medium">{student.fullname}</p>
              </div>
              <div>
                <span className="text-gray-500">Mã số:</span>
                <p className="font-medium">{student.studentCode}</p>
              </div>
            </div>
          </div>
        )}

        <Form form={form} layout="vertical" size="large">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="weight"
              label={
                <span className="flex items-center space-x-2">
                  <SaveOutlined className="text-blue-500" />
                  <span>Cân nặng (kg)</span>
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập cân nặng!' },
                { type: 'number', min: 20, max: 70, message: 'Cân nặng phải từ 20-70kg!' }
              ]}
            >
              <InputNumber
                placeholder="Nhập cân nặng"
                style={{ width: '100%' }}
                min={20}
                max={70}
                step={1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              name="height"
              label={
                <span className="flex items-center space-x-2">
                  <HeartOutlined className="text-blue-500" />
                  <span>Chiều cao (cm)</span>
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập chiều cao!' },
                { type: 'number', min: 110, max: 160, message: 'Chiều cao phải từ 110-160cm!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Chiều cao phải là số!' }
              ]}
            >
              <InputNumber
                placeholder="Nhập chiều cao"
                style={{ width: '100%' }}
                min={110}
                max={160}
                step={1}
                precision={1}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="note"
            label={
              <span className="flex items-center space-x-2">
                <FileTextOutlined className="text-blue-500" />
                <span>Ghi chú</span>
              </span>
            }
            rules={[{ max: 500, message: 'Ghi chú không được quá 500 ký tự!' }]}
          >
            <Input.TextArea
              placeholder="Nhập ghi chú về tình trạng sức khỏe (tùy chọn)"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>

        {mode === 'add' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Thông tin sức khỏe sẽ được sử dụng để tính toán chỉ số BMI và đánh giá tình trạng dinh dưỡng của học sinh.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default HealthRecordModal