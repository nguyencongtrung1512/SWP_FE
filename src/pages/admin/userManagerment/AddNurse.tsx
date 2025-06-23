import { useState } from 'react'
import { Form, Modal, Input, Button, Col, Row, DatePicker } from 'antd'
import dayjs from 'dayjs'

interface CreateNurseProps {
  visible: boolean
  onClose: () => void
  onSuccess: (values: {
    phoneNumber: string
    password: string
    confirmPassword: string
    fullname: string
    email: string
    address: string
    dateOfBirth: any
  }) => Promise<void>
}

const AddNurse: React.FC<CreateNurseProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const maxDate = dayjs().subtract(30, 'year')
  const minDate = dayjs().subtract(50, 'year')

  const handleSubmit = async (values: {
    phoneNumber: string
    password: string
    confirmPassword: string
    fullname: string
    email: string
    address: string
    dateOfBirth: any
  }) => {
    try {
      setLoading(true)
      await onSuccess(values)
      form.resetFields()
    } catch (error) {
      console.error('Error creating nurse:', error)
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
      title="Tạo tài khoản cho Y tá"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      closable={false}
      destroyOnClose
    >
      <Form 
        name='createNurse' 
        onFinish={handleSubmit} 
        layout='vertical' 
        form={form}
        style={{ padding: '20px 0' }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Họ và tên"
              name='fullname'
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input
                placeholder='Nhập họ và tên y tá'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input
                placeholder='Nhập email y tá'
                size='large'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Số điện thoại"
              name='phoneNumber'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input
                placeholder='Nhập số điện thoại y tá'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Ngày sinh"
              name='dateOfBirth'
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              getValueProps={(value) => {
                return {
                  value: value ? dayjs(value) : undefined
                }
              }}
            >
              <DatePicker
                placeholder='Chọn ngày sinh'
                size='large'
                format='DD/MM/YYYY'
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  return current && (current > maxDate || current < minDate)
                }}
                onChange={(dateString) => {
                  form.setFieldsValue({ dateOfBirth: dateString })
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item
              label="Địa chỉ"
              name='address'
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' }
              ]}
            >
              <Input
                placeholder='Nhập địa chỉ y tá'
                size='large'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mật khẩu"
              name='password'
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                  message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!'
                }
              ]}
              validateTrigger={['onChange', 'onBlur']}
            >
              <Input.Password
                placeholder='Nhập mật khẩu'
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Xác nhận mật khẩu"
              name='confirmPassword'
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder='Xác nhận mật khẩu'
                size='large'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button 
                  size='large' 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  loading={loading}
                >
                  Tạo tài khoản Y tá
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddNurse