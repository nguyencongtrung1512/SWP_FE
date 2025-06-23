import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Table,
  Card,
  Typography,
  Tabs,
  Row,
  Col,
  Modal,
  Descriptions,
  Select,
  DatePicker,
  message
} from 'antd'
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import {
  createVaccine,
  createVaccinationCampaign,
  getAllVaccinationCampaigns,
  VaccinationCampaign,
  getVaccines,
  Vaccine
} from '../../../apis/vaccination'
import { getAllClasses, Class } from '../../../apis/class'

const { Title } = Typography
const { Option } = Select
const { Search } = Input

const ScheduleVaccination: React.FC = () => {
  const [vaccineForm] = Form.useForm()
  const [campaignForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1')

  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [campaigns, setCampaigns] = useState<VaccinationCampaign[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<VaccinationCampaign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchVaccines()
    fetchClasses()
    fetchCampaigns()
  }, [])

  const fetchVaccines = async () => {
    try {
      const res = await getVaccines()
      setVaccines(res.data?.$values || [])
      console.log('API trả về:', res.data)
    } catch (err) {
      message.error('Lấy danh sách vaccine thất bại!')
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await getAllClasses()
      setClasses(res.data?.$values || [])
    } catch (err) {
      message.error('Lấy danh sách lớp thất bại!')
    }
  }

  const fetchCampaigns = async () => {
    try {
      const res = await getAllVaccinationCampaigns()
      const campaignsData = res.data?.$values || [] // Lấy đúng $values

      setCampaigns(
        campaignsData.map((item) => ({
          ...item,
          key: item.campaignId.toString() // key cho Table
        }))
      )
    } catch (err) {
      console.error('lỗi', err)
      message.error('Lấy danh sách chiến dịch thất bại!')
    }
  }

  const handleCreateVaccine = async (values: { name: string; description: string }) => {
    try {
      await createVaccine(values)
      message.success('Tạo vaccine thành công!')
      vaccineForm.resetFields()
      fetchVaccines()
    } catch {
      message.error('Tạo vaccine thất bại!')
    }
  }

  const handleCreateCampaign = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        vaccineId: values.vaccineId,
        date: values.date.toISOString(),
        description: values.description,
        classIds: values.classIds
      }
      await createVaccinationCampaign(payload)
      message.success('Tạo lịch tiêm thành công!')
      campaignForm.resetFields()
      fetchCampaigns()
      setActiveTab('3')
    } catch {
      message.error('Tạo lịch tiêm thất bại!')
    }
  }

  const columns: ColumnsType<VaccinationCampaign> = [
    { title: 'Tên chiến dịch', dataIndex: 'name', key: 'name' },
    { title: 'Vaccine', dataIndex: 'vaccineName', key: 'vaccineName' },
    { title: 'Ngày dự kiến', dataIndex: 'date', key: 'date' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type='link'
          icon={<FileTextOutlined />}
          onClick={() => {
            setSelectedCampaign(record)
            setIsModalOpen(true)
          }}
        >
          Xem chi tiết
        </Button>
      )
    }
  ]

  const filteredCampaigns = campaigns.filter(
    (d) =>
      d.name.toLowerCase().includes(searchText.toLowerCase()) ||
      d.vaccineName.toLowerCase().includes(searchText.toLowerCase())
  )

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tạo vaccine',
      children: (
        <Card className='max-w-3xl'>
          <Form form={vaccineForm} layout='vertical' onFinish={handleCreateVaccine}>
            <Form.Item name='name' label='Tên vaccine' rules={[{ required: true }]}>
              <Input placeholder='Nhập tên vaccine' />
            </Form.Item>
            <Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Tạo vaccine
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: '2',
      label: 'Tạo lịch tiêm',
      children: (
        <Card className='max-w-3xl'>
          <Form form={campaignForm} layout='vertical' onFinish={handleCreateCampaign}>
            <Form.Item name='name' label='Tên chiến dịch' rules={[{ required: true }]}>
              <Input placeholder='Nhập tên chiến dịch' />
            </Form.Item>
            <Form.Item name='vaccineId' label='Vaccine' rules={[{ required: true }]}>
              <Select placeholder='Chọn vaccine'>
                {vaccines.map((v) => (
                  <Option key={v.vaccineId} value={v.vaccineId}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='date' label='Ngày tiêm' rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name='classIds' label='Lớp áp dụng' rules={[{ required: true }]}>
              <Select mode='multiple' placeholder='Chọn lớp'>
                {classes.map((cls) => (
                  <Option key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Tạo lịch tiêm
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: '3',
      label: 'Danh sách lịch tiêm',
      children: (
        <div>
          <Row gutter={[16, 16]} className='mb-4'>
            <Col span={8}>
              <Search placeholder='Tìm kiếm' allowClear enterButton={<SearchOutlined />} onSearch={setSearchText} />
            </Col>
          </Row>
          <Table columns={columns} dataSource={filteredCampaigns} rowKey='campaignId' />
        </div>
      )
    }
  ]

  return (
    <div>
      <Title level={3}>Quản lý tiêm chủng</Title>
      <Tabs activeKey={activeTab} items={items} onChange={(key) => setActiveTab(key as any)} />
      <Modal
        title='Chi tiết lịch tiêm'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key='close' onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedCampaign && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label='Tên chiến dịch'>{selectedCampaign.name}</Descriptions.Item>
            <Descriptions.Item label='Vaccine'>{selectedCampaign.vaccineName}</Descriptions.Item>
            <Descriptions.Item label='Ngày dự kiến'>{selectedCampaign.date}</Descriptions.Item>
            <Descriptions.Item label='Mô tả'>{selectedCampaign.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default ScheduleVaccination
