import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select } from 'antd'
import { updateStudent } from '../../../apis/student.api'
import type { Student } from '../../../apis/student.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { getAllUser } from '../../../apis/adminManageAccount.api'

interface UpdateStudentProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  selectedStudent: Student | null
}

const UpdateStudent: React.FC<UpdateStudentProps> = ({ isModalVisible, onCancel, onSuccess, selectedStudent }) => {
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
    if (selectedStudent) {
      form.setFieldsValue({
        ...selectedStudent,
        dateOfBirth: dayjs(selectedStudent.dateOfBirth)
      })
    }
  }, [selectedStudent, form])

  const handleOk = async () => {
    if (!selectedStudent) return

    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateStudent(selectedStudent.studentId, {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString()
      })
      toast.success('Cập nhật học sinh thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error('Có lỗi xảy ra khi cập nhật học sinh!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Cập nhật thông tin học sinh'
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

export default UpdateStudent
