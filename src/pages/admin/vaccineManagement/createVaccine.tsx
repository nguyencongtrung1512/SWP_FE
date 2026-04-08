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
import { EyeOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import {
  createVaccine,
  createVaccinationCampaign,
  getAllVaccinationCampaigns,
  VaccinationCampaign,
  getVaccines,
  Vaccine,
  getConsentsByCampaign,
  getRecordsByCampaign
} from '../../../apis/vaccinatapi.api'
import { getAllClasses, Class } from '../../../apis/class.api'
import dayjs from 'dayjs'

const { Title } = Typography
const { Option } = Select
const { Search } = Input

interface DisabledTimes {
  disabledHours: number[]
  disabledMinutes: number[]
}

interface VaccinationCampaignWithConsent extends VaccinationCampaign {
  consentedCount?: number
  participated?: number
  consents?: {
    campaignId: number
    class: {
      classId: number
      className: string
    }
    consentId: number
    dateConfirmed: string
    isAgreed: boolean
    note: string
    parentId: number
    parentName: string
    studentId: number
    studentName: string
    studentCode: string
  }[]
}

const ScheduleVaccination: React.FC = () => {
  const [vaccineForm] = Form.useForm()
  const [campaignForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1')
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [campaigns, setCampaigns] = useState<VaccinationCampaignWithConsent[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<VaccinationCampaignWithConsent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

  useEffect(() => {
    fetchVaccines()
    fetchClasses()
    fetchCampaigns()
  }, [])

  const fetchVaccines = async () => {
    try {
      const res = await getVaccines()
      setVaccines(res.data?.$values || [])
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
      const campaignsData = res.data?.$values || []
      console.log('Campaigns data:', campaignsData)
      
      const campaignsWithConsents = await Promise.all(
        campaignsData.map(async (campaign) => {
          try {
            const consentRes = await getConsentsByCampaign(campaign.campaignId)
            const consents = (consentRes.data?.$values || []).map((consent: any) => ({
              campaignId: consent.campaignId,
              class: consent.class,
              consentId: consent.consentId,
              dateConfirmed: consent.dateConfirmed,
              isAgreed: consent.isAgreed,
              note: consent.note,
              parentId: consent.parentId,
              parentName: consent.parentName,
              studentId: consent.studentId,
              studentName: consent.studentName,
              studentCode: consent.studentCode
            }))
            const consentedCount = consents.filter(consent => consent.isAgreed === true).length

            const participatedRes = await getRecordsByCampaign(campaign.campaignId) 
            const participatedCount = participatedRes.data?.$values.filter(record => record.result).length || 0

            return {
              ...campaign,
              key: campaign.campaignId.toString(),
              consentedCount,
              consents: consents,
              participated: participatedCount
            }
          } catch (err) {
            console.error(`Error fetching consents for campaign ${campaign.campaignId}:`, err)
            return {
              ...campaign,
              key: campaign.campaignId.toString(),
              consentedCount: 0,
              totalSent: 0,
              consents: []
            }
          }
        })
      )
      
      setCampaigns(campaignsWithConsents as VaccinationCampaignWithConsent[])
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
        date: values.date.format('YYYY-MM-DDTHH:mm:ss'),
        description: values.description,
        classIds: values.classIds
      }

      console.log('Payload for creating campaign:', payload)
      await createVaccinationCampaign(payload)
      message.success('Tạo lịch tiêm thành công!')
      campaignForm.resetFields()
      fetchCampaigns()
      setActiveTab('3')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Tạo lịch tiêm thất bại!')
    }
  }

  const getDisabledTimes = (selectedDate: dayjs.Dayjs | null, campaigns: VaccinationCampaignWithConsent[]): DisabledTimes => {
    if (!selectedDate) return { disabledHours: [], disabledMinutes: [] }

    const selectedDateStr = selectedDate.format('YYYY-MM-DD')
    const campaignsOnDate = campaigns.filter(campaign => {
      const campaignDate = dayjs(campaign.date)
      return campaignDate.format('YYYY-MM-DD') === selectedDateStr
    })

    const disabledHours: number[] = []
    const disabledMinutes: number[] = []

    campaignsOnDate.forEach(campaign => {
      const campaignTime = dayjs(campaign.date)

      const startTime = campaignTime.subtract(30, 'minute')
      const endTime = campaignTime.add(30, 'minute')

      for (let h = startTime.hour(); h <= endTime.hour(); h++) {
        if (h >= 8 && h <= 16) {
          disabledHours.push(h)
        }
      }
    })

    return {
      disabledHours: [...new Set(disabledHours)],
      disabledMinutes
    }
  }

  const columns: ColumnsType<VaccinationCampaignWithConsent> = [
    { title: 'Tên chiến dịch', dataIndex: 'name', key: 'name' },
    { title: 'Vaccine', dataIndex: 'vaccineName', key: 'vaccineName' },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: VaccinationCampaignWithConsent, b: VaccinationCampaignWithConsent) => {
        return dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
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
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedCampaign(record)
              setIsStudentModalOpen(true)
            }}
          >
            Danh sách học sinh
          </Button>
        </div>
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
              <Input.TextArea rows={3} placeholder='Nhập mô tả chi tiết về vaccine' />
            </Form.Item>
            <Form.Item className='flex justify-end'>
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
            <Form.Item name='name' label='Tên chiến dịch' rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}>
              <Input placeholder='Nhập tên chiến dịch' />
            </Form.Item>
            <Form.Item name='vaccineId' label='Vaccine' rules={[{ required: true, message: 'Vui lòng chọn vaccine' }]}>
              <Select placeholder='Chọn vaccine'>
                {vaccines.map((v) => (
                  <Option key={v.vaccineId} value={v.vaccineId}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='date' label='Ngày tiêm' rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm' }]}>
              <DatePicker
                placeholder='Chọn ngày tiêm'
                showTime={{ 
                  format: 'HH:mm', 
                  defaultValue: dayjs('08:00', 'HH:mm') 
                }}
                onChange={(value) => {
                  console.log('Selected date (local):', value?.format())
                }}
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  return current && current < dayjs().add(3, 'day').startOf('day') || current.day() === 0
                }}
                disabledTime={(selectedDate) => {
                  const { disabledHours } = getDisabledTimes(selectedDate, campaigns)

                  return {
                    disabledHours: () => {
                      const businessHoursDisabled = Array.from({ length: 24 }, (_, i) => i).filter(
                        (hour) => hour < 8 || hour > 16
                      )
                      return [...businessHoursDisabled, ...disabledHours]
                    },
                    disabledMinutes: (selectedHour) => {
                      if (!selectedDate) return []
                      const selectedDateStr = selectedDate.format('YYYY-MM-DD')

                      const campaignsAtHour = campaigns.filter(campaign => {
                        const campaignDate = dayjs(campaign.date)
                        return campaignDate.format('YYYY-MM-DD') === selectedDateStr && campaignDate.hour() === selectedHour
                      })

                      const campaignsAtNextHour = campaigns.filter(campaign => {
                        const campaignDate = dayjs(campaign.date)
                        return campaignDate.format('YYYY-MM-DD') === selectedDateStr && campaignDate.hour() === selectedHour + 1
                      })

                      const disabledMinutes: number[] = []
                      campaignsAtHour.forEach(campaign => {
                        const campaignMinute = dayjs(campaign.date).minute()
                        for (let m = Math.max(0, campaignMinute - 30); m <= Math.min(59, campaignMinute + 30); m++) {
                          disabledMinutes.push(m)
                        }
                      })

                      campaignsAtNextHour.forEach(campaign => {
                        const campaignMinute = dayjs(campaign.date).minute()
                        for (let m = Math.max(0, campaignMinute + 30); m <= 59; m++) {
                          disabledMinutes.push(m)
                        }
                      })

                      return [...new Set(disabledMinutes)]
                    }
                  }
                }}
              />
            </Form.Item>
            <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
              <Input.TextArea rows={3} placeholder='Nhập mô tả chi tiết về buổi tiêm' />
            </Form.Item>
            <Form.Item name='classIds' label='Lớp áp dụng' rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}>
              <Select mode='multiple' placeholder='Chọn lớp'>
                {classes.map((cls) => (
                  <Option key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className='flex justify-end'>
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
              <Search placeholder='Tìm kiếm' allowClear enterButton={<SearchOutlined />} onSearch={setSearchText} onChange={(e) => setSearchText(e.target.value)} />
            </Col>
          </Row>
          <Table 
            columns={columns} 
            dataSource={filteredCampaigns} 
            rowKey='campaignId' 
            locale={{
              triggerDesc: 'Nhấn để sắp xếp giảm dần',
              triggerAsc: 'Nhấn để sắp xếp tăng dần',
              cancelSort: 'Hủy sắp xếp',
              emptyText: 'Không có dữ liệu',
            }}
          />
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
            <Descriptions.Item label='Ngày dự kiến'>
              {dayjs(selectedCampaign.date).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label='Mô tả'>{selectedCampaign.description}</Descriptions.Item>
            <Descriptions.Item label='Đã đồng ý tham gia'>{selectedCampaign.consentedCount || 0} học sinh</Descriptions.Item>
            <Descriptions.Item label='Đã ghi nhận kết quả'>{selectedCampaign.participated || 0} học sinh</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        width={800}
        title='Danh sách học sinh trong chiến dịch'
        open={isStudentModalOpen}
        onCancel={() => setIsStudentModalOpen(false)}
        footer={[
          <Button key='close' onClick={() => setIsStudentModalOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedCampaign && (
          <Table
            dataSource={selectedCampaign.consents || []}
            rowKey='consentId'
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Họ tên học sinh', dataIndex: 'studentName', key: 'studentName' },
              { title: 'Mã số HS', dataIndex: 'studentCode', key: 'studentCode' },
              { 
                title: 'Lớp', 
                dataIndex: ['class', 'className'], 
                key: 'className',
                render: (_, record) => record.class?.className || 'N/A'
              },
              { title: 'Phụ huynh', dataIndex: 'parentName', key: 'parentName' },
              { 
                title: 'Ngày xác nhận', 
                dataIndex: 'dateConfirmed', 
                key: 'dateConfirmed', 
                render: (date: string) => date ? dayjs(date).format('HH:mm DD/MM/YYYY') : 'Chưa xác nhận' 
              },
              { 
                title: 'Trạng thái', 
                dataIndex: 'isAgreed', 
                key: 'isAgreed', 
                render: (text) => {
                  if (text === true) return 'Đã đồng ý'
                  if (text === false) return 'Không đồng ý'
                  return 'Chưa phản hồi'
                }
              },
            ]}
          />
        )}
      </Modal>
    </div>
  )
}

export default ScheduleVaccination