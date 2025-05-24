import React, { useState } from 'react'
import {
  Card,
  Table,
  Typography,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic
} from 'antd'
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select

interface User {
  id: string
  username: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'nurse' | 'parent'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

const UserList: React.FC = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock data - sau này sẽ lấy từ API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin1',
      fullName: 'Nguyễn Văn A',
      email: 'admin1@example.com',
      phone: '0123456789',
      role: 'admin',
      status: 'active',
      createdAt: '2024-03-20 10:00',
      lastLogin: '2024-03-25 15:30'
    },
    {
      id: '2',
      username: 'nurse1',
      fullName: 'Trần Thị B',
      email: 'nurse1@example.com',
      phone: '0987654321',
      role: 'nurse',
      status: 'active',
      createdAt: '2024-03-19 14:00'
    },
    {
      id: '3',
      username: 'parent1',
      fullName: 'Lê Văn C',
      email: 'parent1@example.com',
      phone: '0123456788',
      role: 'parent',
      status: 'inactive',
      createdAt: '2024-03-18 09:00'
    }
  ])

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roles = {
          admin: { color: 'red', text: 'Quản trị viên' },
          nurse: { color: 'blue', text: 'Y tá' },
          parent: { color: 'green', text: 'Phụ huynh' }
        }
        const { color, text } = roles[role as keyof typeof roles]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: User) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
            Sửa
          </Button>
          <Popconfirm
            title='Xóa người dùng'
            description='Bạn có chắc chắn muốn xóa người dùng này?'
            onConfirm={() => handleDeleteUser(record)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button type='link' danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type='link'
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
            style={{ color: record.status === 'active' ? 'red' : 'green' }}
          >
            {record.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>
        </Space>
      )
    }
  ]

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    form.setFieldsValue({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    setIsModalVisible(true)
  }

  const handleDeleteUser = (user: User) => {
    // Gọi API xóa người dùng
    setUsers(users.filter((u) => u.id !== user.id))
    message.success('Đã xóa người dùng thành công!')
  }

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, status: newStatus }
      }
      return u
    })
    setUsers(updatedUsers)
    message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản!`)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedUser) {
        // Cập nhật thông tin người dùng
        const updatedUsers = users.map((u) => {
          if (u.id === selectedUser.id) {
            return {
              ...u,
              ...values
            }
          }
          return u
        })
        setUsers(updatedUsers)
        message.success('Cập nhật thông tin người dùng thành công!')
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Title level={4}>Quản lý người dùng</Title>
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col span={8}>
              <Card>
                <Statistic title='Tổng số người dùng' value={stats.total} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title='Đang hoạt động' value={stats.active} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title='Vô hiệu hóa' value={stats.inactive} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title='Danh sách người dùng'>
          <Table columns={columns} dataSource={users} rowKey='id' pagination={{ pageSize: 10 }} />
        </Card>

        <Modal
          title='Cập nhật thông tin người dùng'
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          onOk={handleSubmit}
          okText='Cập nhật'
          cancelText='Hủy'
        >
          <Form form={form} layout='vertical'>
            <Form.Item
              name='username'
              label='Tên đăng nhập'
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='fullName'
              label='Họ và tên'
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='phone'
              label='Số điện thoại'
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='role' label='Vai trò' rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
              <Select>
                <Option value='admin'>Quản trị viên</Option>
                <Option value='nurse'>Y tá</Option>
                <Option value='parent'>Phụ huynh</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default UserList
