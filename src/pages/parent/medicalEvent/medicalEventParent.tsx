import React, { useEffect, useState } from 'react'
import { Card, Table, Tag, Typography, Button, Modal, Timeline, Row, Col, Statistic } from 'antd'
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getAccountInfo } from '../../../api/parent.api'
import { getMedicalEventByParentId, MedicalEvent } from '../../../apis/medicalEvent'
import { getStudentById } from '../../../apis/student'
import MedicalEventDetail from './medicalEventDetail'

const { Text } = Typography

interface Student {
  $id: string
  $values?: any[]
  id: number
  fullname: string
  studentCode: string
  dateOfBirth: string
  gender: string
  address: string
  parentID: number
  parent: null
  classID: number
  _class: null
  healthRecords: any[]
  medicalEvents: any[]
  vaccinationSchedules: any[]
  medicalReports: any[]
}

interface AccountInfo {
  $id: string
  id: number
  fullname: string
  email: string
  phoneNumber: string
  address: string
  role: string
  status: boolean
  parent: null
  nurse: null
  admin: null
  student: Student[]
}

const MedicalEventParent: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [studentDetail, setStudentDetail] = useState<any>(null)

  useEffect(() => {
    const fetchAccountInfoAndMedicalEvents = async () => {
      setLoading(true)
      try {
        const accountRes = await getAccountInfo()

        if (accountRes.success && accountRes.data) {
          setAccountInfo(accountRes.data)
          const parentId = accountRes.data.accountID
          const medicalEventsRes = await getMedicalEventByParentId(parentId)
          if (medicalEventsRes.data && Array.isArray(medicalEventsRes.data.$values)) {
            setMedicalEvents(medicalEventsRes.data.$values)
            console.log('téttét', medicalEventsRes.data)
            setError(null)
          } else {
            setError('Failed to fetch medical events.')
          }
        } else {
          setError(accountRes.message || 'Failed to fetch account info ấấ.')
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAccountInfoAndMedicalEvents()
  }, [])

  const handleViewDetails = async (record: MedicalEvent) => {
    setSelectedEvent(record)
    setIsModalVisible(true)
    try {
      if (record.studentId) {
        const studentRes = await getStudentById(record.studentId)
        setStudentDetail(studentRes.data)
      } else {
        setStudentDetail(null)
      }
    } catch {
      setStudentDetail(null)
    }
  }

  const columns: ColumnsType<MedicalEvent> = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const types: { [key: string]: { color: string; text: string } } = {
          fever: { color: 'red', text: 'Sốt' },
          accident: { color: 'orange', text: 'Tai nạn' },
          epidemic: { color: 'purple', text: 'Dịch bệnh' },
          other: { color: 'blue', text: 'Khác' }
        }
        const { color, text } = types[type] || { color: 'default', text: type }
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
          Xem chi tiết
        </Button>
      )
    }
  ]

  const currentEvents = medicalEvents
  const historyEvents = medicalEvents

  const feverCount = medicalEvents.filter((e) => e.type === 'Sốt').length
  const accidentCount = medicalEvents.filter((e) => e.type === 'Tai nạn').length
  const pandemicCount = medicalEvents.filter((e) => e.type === 'Dịch bệnh').length
  const diferentCount = medicalEvents.filter((e) => e.type !== 'Sốt' && e.type !== 'Tai nạn' && e.type !== 'Dịch bệnh').length
  if (loading) {
    return <div className='p-6 text-center'>Đang tải dữ liệu...</div>
  }

  if (error) {
    return <div className='p-6 text-center text-red-500'>Lỗi: {error}</div>
  }

  return (
    <div className='p-6 space-y-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <AlertOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Báo cáo y tế hiện tại</h1>
        </div>

        <Row gutter={[16, 16]} className='mb-6'>
          <Col span={6}>
            <Card className='bg-red-50'>
              <Statistic
                title='Sốt'
                value={feverCount}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className='bg-orange-50'>
              <Statistic
                title='Tai nạn'
                value={accidentCount}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className='bg-green-50'>
              <Statistic
                title='Dịch bệnh'
                value={pandemicCount}
                valueStyle={{ color: '#52c41a' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className='bg-blue-100'>
              <Statistic
                title='Khác'
                value={diferentCount}
                valueStyle={{ color: '#0066cc' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card className='shadow-md'>
          <Table columns={columns} dataSource={currentEvents} rowKey='medicalEventId' pagination={false} />
        </Card>
      </div>

      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch sử báo cáo y tế</h1>
        </div>

        <Timeline
          items={historyEvents.map((event) => ({
            color: event.type === 'fever' ? 'red' : event.type === 'accident' ? 'orange' : 'blue',
            children: (
              <Card className='mb-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <Text strong className='text-lg'>
                      {event.type === 'Sốt'
                        ? 'Sốt'
                        : event.type === 'Tai nạn'
                          ? 'Tai nạn'
                          : event.type === 'Dịch bệnh'
                            ? 'Dịch bệnh'
                            : 'Khác'}
                    </Text>
                    <div className='text-gray-600 mt-2'>{new Date(event.date).toLocaleString()}</div>
                    <div className='mt-2'>{event.description}</div>
                    {event.note && <div className='mt-2 text-gray-600'>Ghi chú: {event.note}</div>}
                  </div>
                  <Tag color='green' icon={<CheckCircleOutlined />}>
                    Đã hoàn thành
                  </Tag>
                </div>
              </Card>
            )
          }))}
        />
      </div>

      <Modal
        title='Chi tiết báo cáo y tế'
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key='close' onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedEvent && <MedicalEventDetail selectedEvent={selectedEvent} studentDetail={studentDetail} />}
      </Modal>
    </div>
  )
}

export default MedicalEventParent
