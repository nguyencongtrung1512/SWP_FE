import React, { useState, useEffect } from 'react'
import { Card, Table, Typography, Space, Tag, Button, Popconfirm, Row, Col, Statistic, Modal, Descriptions, Spin } from 'antd'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { getAllUser, deleteUser, User } from '../../../apis/adminManageAccount'

const { Title } = Typography

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (token) {
          const data = await getAllUser.getAllUsers()
          const transformedData = data.map((user: User) => ({
            ...user,
            status: (user.status === 'Active' ? 'Active' : 'Inactive') as 'Active' | 'Inactive'
          }))
          setUsers(transformedData)
        } else {
          setError('Không tìm thấy token xác thực.')
          toast.error('Không tìm thấy token xác thực.')
        }
      } catch (err) {
        setError('Không thể tải dữ liệu người dùng.')
        toast.error('Không thể tải dữ liệu người dùng.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDeleteUser = async (user: User) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await deleteUser.deleteUser(user.accountID)
        setUsers(users.filter((u) => u.accountID !== user.accountID))
        toast.success('Đã xóa người dùng thành công!')
      } else {
        toast.error('Không tìm thấy token xác thực.')
      }
    } catch (err) {
      toast.error('Xóa người dùng thất bại.')
      console.error(err)
    }
  }

  const showUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedUser(null)
  }

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      key: 'fullname'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role.roleName',
      key: 'role',
      render: (text: string, record: User) => (record.role ? record.role.roleName : 'N/A')
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: User) => {
        const statusColor = record.status === 'Active' ? 'green' : 'volcano'
        const statusText = record.status === 'Active' ? 'Đang hoạt động' : 'Vô hiệu hóa'
        return <Tag color={statusColor}>{statusText}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: User) => (
        <Space>
          <Button type='link' icon={<EyeOutlined />} onClick={() => showUserDetails(record)}>
            Xem chi tiết
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
        </Space>
      )
    }
  ]

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    inactive: users.filter((u) => u.status === 'Inactive').length
  }

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
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

          <Card title='Danh sách người dùng' style={{ marginTop: '20px' }}>
            {error ? (
              <Typography.Text type='danger'>{error}</Typography.Text>
            ) : (
              <Table columns={columns} dataSource={users} rowKey='accountID' pagination={{ pageSize: 10 }} />
            )}
          </Card>
        </Space>
      </Spin>
      {selectedUser && (
        <Modal title='Chi tiết người dùng' visible={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label='ID tài khoản'>{selectedUser.accountID}</Descriptions.Item>
            <Descriptions.Item label='Email'>{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label='Họ và tên'>{selectedUser.fullname}</Descriptions.Item>
            <Descriptions.Item label='Địa chỉ'>{selectedUser.address}</Descriptions.Item>
            <Descriptions.Item label='Ngày sinh'>{selectedUser.dateOfBirth.split('T')[0]}</Descriptions.Item>
            <Descriptions.Item label='Số điện thoại'>{selectedUser.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label='Vai trò'>{selectedUser.role.roleName}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>
              <Tag color={selectedUser.status === 'Active' ? 'green' : 'volcano'}>
                {selectedUser.status === 'Active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Ngày tạo'>{new Date(selectedUser.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label='Cập nhật lần cuối'>
              {new Date(selectedUser.updateAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </div>
  )
}

export default UserList
