import { useState, useEffect } from 'react'
import { Form, Input, Button, Avatar, Row, Col, Divider, Modal } from 'antd'
import { UserOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { updateAccount } from '../../../api/parent.api'
import { translateMessage } from '../../../utils/message'

interface NurseProfileData {
  email: string
  fullname: string
  address: string
  phoneNumber: string
  image?: FileList
}

interface NurseProfileModalProps {
  open: boolean
  onClose: () => void
  userData?: {
    email: string
    fullname: string
    address: string
    phoneNumber: string
    image?: string
  }
}

const NurseProfileModal: React.FC<NurseProfileModalProps> = ({ open, onClose, userData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string>(userData?.image ? `data:image/webp;base64,${userData.image}` : '')

  const initialData: NurseProfileData = {
    email: userData?.email || '',
    fullname: userData?.fullname || '',
    address: userData?.address || '',
    phoneNumber: userData?.phoneNumber || ''
  }

  useEffect(() => {
    if (userData) {
      const updatedData: NurseProfileData = {
        email: userData.email || '',
        fullname: userData.fullname || '',
        address: userData.address || '',
        phoneNumber: userData.phoneNumber || ''
      }

      form.setFieldsValue(updatedData)

      if (userData.image) {
        setProfileImage(`data:image/webp;base64,${userData.image}`)
      }
    }
  }, [userData, form])

  const handleSubmit = async (values: NurseProfileData) => {
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

      const response = await updateAccount(formData)
      console.log('Updated profile data:', values)
      if (response.success) {
        toast.success('Cập nhật thông tin thành công!')
        setEditing(false)
        onClose()
      } else {
        toast.error(translateMessage(response.message, 'account'))
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.setFieldsValue(initialData)
    setEditing(false)
    setProfileImage(userData?.image ? `data:image/webp;base64,${userData.image}` : '')
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Hồ sơ cá nhân</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      maskClosable={!editing}
    >
      <div className="max-w-full">
        {!editing && (
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            className="py-4 bg-transparent hover:bg-gray-100 shadow-none border border-gray-300 text-gray-700"
            size="small"
          >
            Chỉnh sửa
          </Button>
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!editing}
        >
          <Row gutter={24}>
            <Col span={24} className="text-center mb-2">
              <div className="flex flex-col items-center">
                <Avatar
                  size={120}
                  src={profileImage}
                  icon={<UserOutlined />}
                  className="mb-4 border-4 border-gray-200"
                />
                {editing && (
                  <Form.Item
                    name='image'
                    valuePropName='fileList'
                    getValueFromEvent={e => e.target.files}
                    className='-mb-2'
                  >
                    <Input type='file' accept='image/*' />
                  </Form.Item>
                )}
              </div>
              <Divider />
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Họ và tên" 
                name="fullname"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                ]}
                className='-mt-2'
              >
                <Input 
                  size="large"
                  placeholder="Nhập họ và tên"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Email" 
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
                className='-mt-2'
              >
                <Input 
                  size="large"
                  placeholder="example@hospital.com"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Số điện thoại" 
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' }
                ]}
                className='-mt-2'
              >
                <Input 
                  size="large"
                  placeholder="0123456789"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item 
                label="Địa chỉ" 
                name="address"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ!' }
                ]}
                className='-mt-2'
              >
                <Input 
                  size="large"
                  placeholder="Nhập địa chỉ"
                />
              </Form.Item>
            </Col>

            {editing && (
              <Col span={24} className="text-center mt-4">
                <div className="space-x-4">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

export default NurseProfileModal