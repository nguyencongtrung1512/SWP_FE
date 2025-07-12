import React, { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { updateClass } from '../../../apis/class.api'
import type { Class } from '../../../apis/class.api'

interface UpdateClassProps {
  isModalVisible: boolean
  onCancel: () => void
  onSuccess: () => void
  selectedClass: Class | null
}

const UpdateClass: React.FC<UpdateClassProps> = ({ isModalVisible, onCancel, onSuccess, selectedClass }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (selectedClass) {
      form.setFieldsValue({
        className: selectedClass.className
      })
    }
  }, [selectedClass, form])

  const handleOk = async () => {
    if (!selectedClass) return

    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateClass(selectedClass.classId, values)
      message.success('Cập nhật lớp thành công!')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Error updating class:', error)
      message.error('Có lỗi xảy ra khi cập nhật lớp!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Cập nhật lớp học'
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
          name='className'
          label='Tên lớp'
          rules={[
            { required: true, message: 'Vui lòng nhập tên lớp!' },
            { pattern: /^\d+\/\d+$/, message: 'Tên lớp phải có định dạng số/số (ví dụ: 1/1)' }
          ]}
        >
          <Input placeholder='Nhập tên lớp (ví dụ: 1/1)' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateClass