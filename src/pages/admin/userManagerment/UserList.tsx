import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Typography,
  Space,
  Tag,
  Button,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Modal,
  Descriptions,
  Spin,
  Select,
  message
} from 'antd'
import { CiLock, CiUnlock } from 'react-icons/ci'
import { EyeOutlined } from '@ant-design/icons'
import { getAllUser, User, updateUserStatus } from '../../../apis/adminManageAccount'
import { createNurse } from '../../../apis/auth.api'
import { FaPlus } from 'react-icons/fa6'
import AddNurse from './AddNurse'
import { translateMessage } from '../../../utils/message'
import dayjs from 'dayjs'

const { Title } = Typography

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [nurseModalVisible, setNurseModalVisible] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user) => user.role?.roleName === selectedRole)
      setFilteredUsers(filtered)
    }
  }, [selectedRole, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (token) {
        const data = await getAllUser.getAllUsers()
        const transformedData = data
          .filter((user: User) => user.role?.roleName === 'Parent' || user.role?.roleName === 'Nurse')
          .map((user: User) => ({
            ...user,
            status: (user.status === 'Active' ? 'Active' : 'Inactive') as 'Active' | 'Inactive'
          }))
        setUsers(transformedData)
        console.log('Fetched Users:', transformedData)
        setFilteredUsers(transformedData)
      } else {
        setError('Không tìm thấy token xác thực.')
        message.error('Không tìm thấy token xác thực.')
      }
    } catch (err) {
      setError('Không thể tải dữ liệu người dùng.')
      message.error('Không thể tải dữ liệu người dùng.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    const token = localStorage.getItem('token')
    if (!token) {
      message.error('Không tìm thấy token xác thực.')
      return
    }
    try {
      const response = await updateUserStatus.updateStatus(user.accountID, 'InActive')
      if (response.data && response.data.message) {
        console.log('Response:', response.data)
        message.success('Đã vô hiệu hóa người dùng thành công!')
        fetchUsers()
      }
    } catch (err) {
      console.log('Error activating user:', err)
    }
  }

  const handleActivateUser = async (user: User) => {
    const token = localStorage.getItem('token')
    if (!token) {
      message.error('Không tìm thấy token xác thực.')
      return
    }
    try {
      const response = await updateUserStatus.updateStatus(user.accountID, 'Active')
      if (response.data && response.data.message) {
        console.log('Response:', response.data)
        message.success('Đã kích hoạt người dùng thành công!')
        fetchUsers()
      }
    } catch (err) {
      console.log('Error activating user:', err)
    }
  }

  const handleOpenNurseModal = () => {
    setNurseModalVisible(true)
  }

  const showUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedUser(null)
  }

  const handleAddNurseCancel = () => {
    setNurseModalVisible(false)
  }

  const handleAddNurseSuccess = async (values: {
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
      if (!values.dateOfBirth) {
        message.error('Vui lòng chọn ngày sinh!')
        setLoading(false)
        return
      }

      let formattedDate
      try {
        if (typeof values.dateOfBirth === 'string') {
          const parts = values.dateOfBirth.split('/')
          if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`
          else formattedDate = new Date(values.dateOfBirth).toISOString()
        } else if (values.dateOfBirth instanceof Date) {
          formattedDate = values.dateOfBirth.toISOString()
        } else {
          formattedDate = dayjs(values.dateOfBirth).format('YYYY-MM-DD') + 'T00:00:00Z'
        }
      } catch (e) {
        message.error('Định dạng ngày sinh không hợp lệ!')
        setLoading(false)
        return
      }

      const formattedValues = {
        ...values,
        dateOfBirth: formattedDate
      }

      console.log('Formatted Values:', formattedValues)
      const result: any = await createNurse(formattedValues)

      if (result && result.success) {
        message.success('Đăng ký tài khoản y tá thành công!')
        setNurseModalVisible(false)
        fetchUsers()
      } else if (result) {
        message.error(translateMessage(result.message, 'register'))
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      message.error(error?.message || 'Đăng ký thất bại! Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const columns: any[] = [
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
      render: (text: string, record: User) => {
        if (!record.role) return 'N/A'
        switch (record.role.roleName) {
          case 'Parent':
            return 'Phụ huynh'
          case 'Nurse':
            return 'Y tá'
          case 'Admin':
            return 'Quản trị viên'
          default:
            return record.role.roleName
        }
      }
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
          {record.status === 'Active' ? (
            <Popconfirm
              title='Vô hiệu hóa người dùng'
              description='Bạn có chắc chắn muốn vô hiệu hóa người dùng này?'
              onConfirm={() => handleDeleteUser(record)}
              okText='Vô hiệu hóa'
              cancelText='Hủy'
            >
              <Button type='link' danger icon={<CiLock className='text-lg' />}>
                Vô hiệu hóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title='Kích hoạt người dùng'
              description='Bạn có chắc chắn muốn kích hoạt người dùng này?'
              onConfirm={() => handleActivateUser(record)}
              okText='Kích hoạt'
              cancelText='Hủy'
            >
              <Button type='link' danger icon={<CiUnlock className='text-lg' />}>
                Kích hoạt
              </Button>
            </Popconfirm>
          )}
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
      <Spin spinning={loading} tip='Đang tải dữ liệu...'>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Select
                style={{ width: 200 }}
                value={selectedRole}
                onChange={setSelectedRole}
                options={[
                  { value: 'all', label: 'Tất cả vai trò' },
                  { value: 'Parent', label: 'Phụ huynh' },
                  { value: 'Nurse', label: 'Y tá' }
                ]}
              />
              <Button
                type='primary'
                onClick={handleOpenNurseModal}
              >
                <FaPlus />Tạo tài khoản cho Y tá
              </Button>
            </div>
            {error ? (
              <Typography.Text type='danger'>{error}</Typography.Text>
            ) : (
              <Table columns={columns} dataSource={filteredUsers} rowKey='accountID' pagination={{ pageSize: 10 }} />
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
            <Descriptions.Item label='Ngày sinh'>{selectedUser.dateOfBirth ? dayjs(selectedUser.dateOfBirth).format('DD/MM/YYYY') : ''}</Descriptions.Item>
            <Descriptions.Item label='Số điện thoại'>{selectedUser.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label='Vai trò'>{selectedUser.role.roleName}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>
              <Tag color={selectedUser.status === 'Active' ? 'green' : 'volcano'}>
                {selectedUser.status === 'Active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}

      <AddNurse
        visible={nurseModalVisible}
        onClose={handleAddNurseCancel}
        onSuccess={handleAddNurseSuccess}
      />
    </div>
  )
}

export default UserList
