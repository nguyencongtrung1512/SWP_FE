import React from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd'
import { createStudent } from '../../../apis/student'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

interface CreateStudentProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  classId: number
}

const CreateStudent: React.FC<CreateStudentProps> = ({ isModalVisible, onCancel, onSuccess, classId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const maxDate = dayjs().subtract(6, 'year')
  const minDate = dayjs().subtract(15, 'year')

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await createStudent({
        ...values,
        classId,
        dateOfBirth: values.dateOfBirth.toISOString(),
        gender: values.gender
      })
      toast.success('Thêm học sinh thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error creating student:', error)
      toast.error('Có lỗi xảy ra khi thêm học sinh!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Thêm học sinh mới'
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
          name='studentCode'
          label='Mã học sinh'
          rules={[{ required: true, message: 'Vui lòng nhập mã học sinh!' }]}
        >
          <Input placeholder='Nhập mã học sinh' />
        </Form.Item>

        <Form.Item name='fullname' label='Họ và tên' rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input placeholder='Nhập họ và tên' />
        </Form.Item>

        <Form.Item name='gender' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select
            placeholder='Chọn giới tính'
            options={[
              { value: 'Male', label: 'Nam' },
              { value: 'Female', label: 'Nữ' }
            ]}
          />
        </Form.Item>

        <Form.Item
          name='dateOfBirth'
          label='Ngày sinh'
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format='DD/MM/YYYY'
            placeholder='Chọn ngày sinh'
            disabledDate={(current) => {
              return current && (current > maxDate || current < minDate)
            }}
          />
        </Form.Item>

        <Form.Item
          name='parentId'
          label='ID Phụ huynh'
          rules={[{ required: true, message: 'Vui lòng nhập ID phụ huynh!' }]}
        >
          <Input type='number' placeholder='Nhập ID phụ huynh' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateStudent
