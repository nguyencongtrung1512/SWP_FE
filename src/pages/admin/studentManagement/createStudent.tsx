import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd'
import { createStudent } from '../../../apis/student'
import dayjs from 'dayjs'
import { getAllUser } from '../../../apis/adminManageAccount'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'

interface CreateStudentProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  classId: number
}

const CreateStudent: React.FC<CreateStudentProps> = ({ isModalVisible, onCancel, onSuccess, classId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [parents, setParents] = React.useState<{ accountID: number; fullname: string }[]>([])

  const maxDate = dayjs().subtract(6, 'year')
  const minDate = dayjs().subtract(15, 'year')

  useEffect(() => {
    if (isModalVisible) {
      getAllUser.getAllUsers().then((res) => {
        const parentList = res.filter((u) => u.role?.roleName === 'Parent')
        setParents(parentList)
      })
    }
  }, [isModalVisible])

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
    } catch (error: unknown) {
      console.error('Error creating student:', error)
      const err = error as AxiosError<{ message?: string }>
      if (err?.response?.data?.message === 'StudentCode already exists.') {
        toast.error('Học sinh khác đã có mã này!')
      } else {
        toast.error('Có lỗi xảy ra khi thêm học sinh!')
      }
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

        <Form.Item name='parentId' label='Phụ huynh' rules={[{ required: false, message: 'Vui lòng chọn phụ huynh!' }]}>
          <Select
            showSearch
            placeholder='Chọn phụ huynh'
            optionFilterProp='children'
            filterOption={(input, option) => {
              const label = option?.children?.toString() || '';
              return label.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {parents.map((p) => (
              <Select.Option key={p.accountID} value={p.accountID}>
                {p.fullname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateStudent
