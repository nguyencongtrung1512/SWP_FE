import { Modal, Form, Input, Spin } from 'antd'
import React, { useEffect } from 'react'
import { updateAccount } from '../../../api/parent.api'
import { toast } from 'react-toastify'
import { translateMessage } from '../../../utils/message'

interface UpdateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    email: string
    fullname: string
    address: string
    phoneNumber: string
  } | null
  onUpdateSuccess: () => void
}

interface FormValues {
  email: string
  fullname: string
  address: string
  phoneNumber: string
  image?: FileList
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, initialData, onUpdateSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      form.setFieldsValue(initialData)
    }
  }, [isOpen, initialData, form])

  const handleFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('fullname', values.fullname)
      formData.append('address', values.address)
      formData.append('phoneNumber', values.phoneNumber)
      if (values.image && values.image.length > 0) {
        formData.append('image', values.image[0])
      }
      console.log('Submitting form with FormData:', formData)
      const response = await updateAccount(formData)
      console.log('Update account response:', response)
      if (response.success) {
        toast.success(translateMessage(response.message, 'account'))
        onUpdateSuccess()
        onClose()
      } else {
        toast.error(translateMessage(response.message, 'account'))
      }
    } catch (error) {
      console.error('Failed to update account:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Chỉnh sửa hồ sơ'
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          initialValues={initialData || { email: '', fullname: '', address: '', phoneNumber: '' }}
        >
          <Form.Item
            name='email'
            label='Email'
            hidden
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name='fullname'
            label='Họ và tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='address'
            label='Địa chỉ'
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label='Số điện thoại'
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='image'
            label='Ảnh đại diện'
            valuePropName='fileList'
            getValueFromEvent={e => e.target.files}
          >
            <Input type='file' accept='image/*' />
          </Form.Item>
          <Form.Item>
            <button type='submit' className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium'>
              Lưu thay đổi
            </button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default UpdateProfileModal
