import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Card, Typography, Tabs, Row, Col, Modal, Descriptions, Select, DatePicker, message } from 'antd'
import { EyeOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import { createHealthCheckList, getAllHealthChecks, HealthCheckList } from '../../../apis/healthCheck.api'
import { getAllClasses, Class } from '../../../apis/class.api'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getNurseListForHealthConsultation } from '../../../apis/healthConsultationBooking.api'
import { getAllStudents } from '../../../apis/student.api'
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

interface FullHealthCheckList extends HealthCheckList {
  nurseFullName: string
  participated?: number
  studentName: string
  studentCode: string
  className: string
}

const ScheduleHealthCheck: React.FC = () => {
  const [examinationForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1')
  const [examinations, setExaminations] = useState<FullHealthCheckList[]>([])
  const [nurses, setNurses] = useState<Nurse[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedExamination, setSelectedExamination] = useState<FullHealthCheckList | null>(null)
  const [selectedNurseID, setSelectedNurseID] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

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
      const [studentsRes, res] = await Promise.all([getAllStudents(), getAllHealthChecks()])
      const examinationData = res.data?.$values || []
      const studentData = studentsRes.data?.$values || []
      console.log(studentData)
      const fullData = examinationData.map((item: FullHealthCheckList) => {
        const nurse = nurses.find(n => n.accountID === item.nurseID)
        return {
          ...item,
          nurseFullName: nurse ? nurse.fullname : 'N/A',
          studentName: studentData.find(s => s.studentId === item.studentID)?.fullname || 'N/A',
          studentCode: studentData.find(s => s.studentId === item.studentID)?.studentCode || 'N/A',
          className: studentData.find(s => s.studentId === item.studentID)?.className || 'N/A',
        }
      })
      console.log('Danh sách buổi khám:', fullData)
      setExaminations(fullData)
    } catch (err) {
      console.error('lỗi', err)
      message.error('Lấy danh sách buổi khám thất bại!')
    }
  }

  const getParticipationStatus = (exam: FullHealthCheckList) => {
    if (exam.weight == null || exam.height == null || exam.leftEye == null || exam.rightEye == null) {
      return 'Không tham gia'
    }
    else if (exam.weight > 0 && exam.height > 0 && exam.leftEye >= 0 && exam.rightEye >= 0) {
      return 'Đã ghi nhận kết quả'
    }

    const currentDate = dayjs()
    const examDate = dayjs(exam.date)
    
    if (currentDate.isAfter(examDate)) {
      return 'Không tham gia'
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

  const columns: ColumnsType<FullHealthCheckList> = [
    { title: 'Y tá phụ trách', dataIndex: 'nurseFullName', key: 'nurseFullName' },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: FullHealthCheckList, b: FullHealthCheckList) => a.date.localeCompare(b.date)
    },
    {
      title: 'Mô tả',
      dataIndex: 'healthCheckDescription',
      key: 'healthCheckDescription'
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
            setSelectedExamination(record)
            setIsModalOpen(true)
          }}
        >
          Xem chi tiết
        </Button>
        <Button
          type='link'
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedExamination(record)
            setIsStudentModalOpen(true)
          }}
          >
          Danh sách học sinh
        </Button>
        </div>
      )
    }
  ]

  const filteredHealthChecks = uniqueHealthChecks.filter(
    (d) => (d.nurseFullName ?? '').toString().toLowerCase().includes(searchText.toLowerCase())
  )

  const getStudentsForExamination = () => {
    if (!selectedExamination) return []
    
    return examinations.filter(exam => 
      exam.nurseID === selectedExamination.nurseID && 
      exam.date === selectedExamination.date
    ).sort((a, b) => a.className.localeCompare(b.className))
  }

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
            <Descriptions.Item label='Đã ghi nhận kết quả'>{selectedExamination.participated || 0} học sinh</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        width={800}
        title='Danh sách học sinh trong buổi khám sức khỏe'
        open={isStudentModalOpen}
        onCancel={() => setIsStudentModalOpen(false)}
        footer={[
          <Button key='close' onClick={() => setIsStudentModalOpen(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedExamination && (
          <Table
            dataSource={getStudentsForExamination()}
            rowKey='campaignId'
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Họ tên học sinh', dataIndex: 'studentName', key: 'studentName' },
              { title: 'Mã số HS', dataIndex: 'studentCode', key: 'studentCode' },
              { title: 'Lớp', dataIndex: 'className', key: 'className' },
              { 
                title: 'Trạng thái', 
                key: 'isParticipated', 
                render: (_, record) => getParticipationStatus(record)
              },
            ]}
          />
        )}
      </Modal>
    </div>
  )
}

export default ScheduleHealthCheck