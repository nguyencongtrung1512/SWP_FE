import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Card, Typography, Tabs, Row, Col, Modal, Descriptions, Select, DatePicker, message } from 'antd'
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { createHealthCheckList, getAllHealthChecks, HealthCheckList as OriginalHealthCheckList } from '../../../apis/healthCheck.api'
import { getAllClasses, Class } from '../../../apis/class.api'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getNurseListForHealthConsultation } from '../../../apis/healthConsultationBooking.api'
dayjs.extend(utc)

const { Title } = Typography
const { Option } = Select
const { Search } = Input

interface Nurse {
  accountID: number
  fullname: string
  email: string
  phoneNumber: string
  image?: string | null
}

interface HealthCheckList extends OriginalHealthCheckList {
  nurseFullName?: string
  total?: number
  participated?: number
}

const ScheduleHealthCheck: React.FC = () => {
  const [examinationForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1')
  const [examinations, setExaminations] = useState<HealthCheckList[]>([])
  const [nurses, setNurses] = useState<Nurse[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedExamination, setSelectedExamination] = useState<HealthCheckList | null>(null)
  const [selectedNurseID, setSelectedNurseID] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchNurses()
    fetchClasses()
  }, [])

  const fetchNurses = async () => {
    try {
      const res = await getNurseListForHealthConsultation()
      setNurses(res.data?.$values || [])
    } catch (err) {
      console.log('Lấy danh sách y tá thất bại!')
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

  const fetchExaminations = async () => {
    try {
      const res = await getAllHealthChecks()
      const examinationData = res.data?.$values || []

      const fullData = examinationData.map((item: HealthCheckList) => {
        const nurse = nurses.find(n => n.accountID === item.nurseID)
        return {
          ...item,
          nurseFullName: nurse ? nurse.fullname : 'Không rõ'
        }
      })
      setExaminations(fullData)
    } catch (err) {
      console.error('lỗi', err)
      message.error('Lấy danh sách buổi khám thất bại!')
    }
  }

  const isTimeConflict = (selectedTime: dayjs.Dayjs, nurseID: number): boolean => {
    const selectedDateStr = selectedTime.format('YYYY-MM-DD')
    const nurseExaminations = uniqueHealthChecks.filter(
      exam =>
        exam.nurseID === nurseID &&
        dayjs(exam.date).format('YYYY-MM-DD') === selectedDateStr
    )

    for (const exam of nurseExaminations) {
      const examStart = dayjs.utc(exam.date).local()
      const examEnd = examStart.add(30, 'minute')
      const selectedStart = selectedTime
      const selectedEnd = selectedTime.add(30, 'minute')

      if (
        (selectedStart.isBefore(examEnd) && selectedEnd.isAfter(examStart)) ||
        selectedStart.isSame(examStart)
      ) {
        return true
      }
    }
    return false
  }

  const getHealthCheckCounts = (nurseID: number, date: string) => {
    const filteredHealthCheck = examinations.filter(
      exam => exam.nurseID === nurseID && exam.date === date
    )
    
    const total = filteredHealthCheck.length
    const participated = filteredHealthCheck.filter(
      exam => exam.weight !== null || exam.height !== null || 
            exam.leftEye !== null || exam.rightEye !== null
    ).length
    
    return { total, participated }
  }

  const handleCreateExamination = async (values: any) => {
    try {
      const payload = {
        nurseID: values.nurseID,
        date: values.date.format(),
        healthCheckDescription: values.description,
        classIds: values.classIds
      }

      const res = await createHealthCheckList(payload)
      console.log('Kết quả tạo lịch khám:', res)
      if (res.data) {
        message.success('Tạo lịch khám sức khỏe thành công!')
        examinationForm.resetFields()
        setActiveTab('2')
        fetchExaminations()
      }
    } catch {
      message.error('Tạo lịch khám sức khỏe thất bại!')
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key as '1' | '2')

    if (key === '2' && examinations.length === 0) {
      fetchExaminations()
    }
  }

  const uniqueHealthChecks = examinations.filter((value, index, self) =>
    index === self.findIndex((v) => v.nurseID === value.nurseID && v.date === value.date)
  )

  console.log('Examinations:', uniqueHealthChecks)

  const columns: ColumnsType<HealthCheckList> = [
    { title: 'Y tá phụ trách', dataIndex: 'nurseFullName', key: 'nurseFullName' },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: HealthCheckList, b: HealthCheckList) => a.date.localeCompare(b.date)
    },
    {
      title: 'Mô tả',
      dataIndex: 'healthCheckDescription',
      key: 'healthCheckDescription'
    },
    // {
    //   title: 'Đã tham gia',
    //   key: 'consent',
    //   render: (_, record) => {
    //     const { total, participated } = getHealthCheckCounts(record.nurseID, record.date)
    //     return (
    //       <span>
    //         <span style={{ color: 'green', fontWeight: 600 }}>
    //           {participated}
    //         </span>
    //         <span style={{ color: 'black', fontWeight: 600 }}>
    //           /{total} học sinh
    //         </span>
    //       </span>
    //     )
    //   }
    // },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type='link'
          icon={<FileTextOutlined />}
          onClick={() => {
            setSelectedExamination(record)
            setIsModalOpen(true)
          }}
        >
          Xem chi tiết
        </Button>
      )
    }
  ]

  const filteredHealthChecks = uniqueHealthChecks.filter(
    (d) =>
      (d.nurseFullName ?? '').toString().toLowerCase().includes(searchText.toLowerCase())
  )

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tạo buổi khám sức khỏe',
      children: (
        <Card className='max-w-3xl'>
          <Form form={examinationForm} layout='vertical' onFinish={handleCreateExamination}>
            <Form.Item name='nurseID' label='Y tá phụ trách' rules={[{ required: true, message: 'Vui lòng chọn y tá phụ trách' }]}>
              <Select placeholder='Chọn y tá' onChange={(value) => setSelectedNurseID(value)}>
                {nurses.map((n) => (
                  <Option key={n.accountID} value={n.accountID}>
                    {n.fullname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='date' label='Ngày khám' rules={[{ required: true, message: 'Vui lòng chọn ngày khám sức khỏe' }]}>
              <DatePicker
                placeholder='Chọn ngày khám'
                showTime={{
                  format: 'HH:mm',
                  defaultValue: dayjs('08:00', 'HH:mm')
                }}
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  return current && current < dayjs().add(3, 'day').startOf('day') || current.day() === 0
                }}
                disabledTime={(selectedDate) => {
                  if (!selectedDate || selectedNurseID == null) {
                    return {
                      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(h => h < 8 || h > 16),
                      disabledMinutes: () => []
                    }
                  }

                  return {
                    disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(h => h < 8 || h > 16),
                    disabledMinutes: (selectedHour) => {
                      const disabledMinutes: number[] = []
                      for (let minute = 0; minute < 60; minute++) {
                        const testTime = selectedDate.hour(selectedHour).minute(minute).second(0)
                        if (isTimeConflict(testTime, selectedNurseID)) {
                          disabledMinutes.push(minute)
                        }
                      }

                      return disabledMinutes
                    }
                  }
                }}
              />
            </Form.Item>
            <Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả buổi khám sức khỏe' }]}>
              <Input.TextArea rows={3} placeholder='Nhập mô tả chi tiết về buổi khám sức khỏe' />
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
                Tạo buổi khám
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: '2',
      label: 'Danh sách các buổi khám sức khỏe',
      children: (
        <div>
          <Row gutter={[16, 16]} className='mb-4'>
            <Col span={8}>
              <Search placeholder='Tìm kiếm theo tên y tá' allowClear enterButton={<SearchOutlined />} onSearch={setSearchText} onChange={(e) => setSearchText(e.target.value)} />
            </Col>
          </Row>
          <Table columns={columns} dataSource={filteredHealthChecks} rowKey='campaignId' />
        </div>
      )
    }
  ]

  return (
    <div>
      <Title level={3}>Quản lý lịch khám sức khỏe</Title>
      <Tabs activeKey={activeTab} items={items} onChange={handleTabChange} />
      <Modal
        title='Chi tiết buổi khám sức khỏe'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key='close' onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedExamination && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label='Y tá phụ trách'>{selectedExamination.nurseFullName}</Descriptions.Item>
            <Descriptions.Item label='Ngày dự kiến'>{dayjs.utc(selectedExamination.date).local().format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label='Mô tả'>{selectedExamination.healthCheckDescription}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default ScheduleHealthCheck