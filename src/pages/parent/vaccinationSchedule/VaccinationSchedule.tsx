import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Descriptions, message } from 'antd'
import { FileTextOutlined, HistoryOutlined, CalendarOutlined, MedicineBoxOutlined, HeartOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { FaRegBell } from 'react-icons/fa'
import HistoryVaccination from './HistoryVaccination'
import HistoryHealthCheck from './HistoryHealthCheck'
import { getParentNotifications, VaccinationConsent, sendConsent } from '../../../apis/vaccination'
import { getHealthCheckNotifications, HealthCheckNotification } from '../../../apis/healthCheck'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getAccountInfo } from '../../../api/parent.api'

dayjs.extend(utc)

interface Child {
  studentId: number
  fullname: string
  studentCode: string
  className: string
}

const VaccinationSchedule: React.FC = () => {
  const [vaccinationData, setVaccinationData] = useState<VaccinationConsent[]>([])
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<VaccinationConsent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [isHealthCheck, setIsHealthCheck] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchChildrenList()
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (childrenList.length > 0) {
      fetchVaccinationData()
      fetchHealthCheckData()
    }
  }, [childrenList])

  const fetchChildrenList = async () => {
    try {
      setLoading(true)
      const res = await getAccountInfo()
      const students = res.data.students.$values || []
      const children: Child[] = students.map((student: any) => ({
        studentId: student.studentId,
        fullname: student.fullname || 'N/A',
        studentCode: student.studentCode || 'N/A',
        className: student.className || 'N/A'
      }))
      console.log('Fetched children list:', children)
      setChildrenList(children)
    } catch (err) {
      console.error(err)
      message.error('Lấy danh sách học sinh thất bại!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (childrenList.length > 0 && !selectedChild) {
      setSelectedChild(childrenList[0])
    }
  }, [childrenList, selectedChild])

  const fetchVaccinationData = async () => {
    try {
      setLoading(true)
      const res = await getParentNotifications()
      const allVaccinationData = res.data.$values || []
      
      const childrenIds = childrenList.map(child => child.studentId)
      const filteredData = allVaccinationData.filter((item: VaccinationConsent) => 
        childrenIds.includes(item.studentId)
      )
      
      const mapped = filteredData.map((item: VaccinationConsent) => ({
        ...item,
        key: item.consentId.toString()
      }))
      
      setVaccinationData(mapped)
    } catch (err) {
      console.error(err)
      message.error('Lấy dữ liệu lịch tiêm thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const fetchHealthCheckData = async () => {
    try {
      setLoading(true)
      const res = await getHealthCheckNotifications()
      console.log('Fetched health check data:', res.data)
      const allHealthCheckData = res.data.$values || []
      
      const childrenIds = childrenList.map(child => child.studentId)
      const filteredData = allHealthCheckData.filter((item: HealthCheckNotification) => 
        childrenIds.includes(item.studentID)
      )
      console.log('Filtered health check data:', filteredData)
      setHealthCheckData(filteredData)
    } catch (err) {
      console.error(err)
      message.error('Lấy dữ liệu lịch khám thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleConsent = async (record: VaccinationConsent, isAgreed: boolean) => {
    try {
      const note = isAgreed ? 'Phụ huynh đồng ý' : 'Phụ huynh từ chối'
      await sendConsent({
        campaignId: record.campaignId,
        studentId: record.studentId,
        isAgreed,
        note
      })
      message.success(isAgreed ? 'Đã đồng ý tiêm!' : 'Đã từ chối tiêm!')
      await fetchVaccinationData()
    } catch (err) {
      console.error(err)
      message.error('Xử lý thất bại!')
    }
  }

  const handleViewDetails = (record: VaccinationConsent) => {
    setSelectedSchedule(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child)
  }

  const handleSwitchChange = (isHealthCheckMode: boolean) => {
    setIsHealthCheck(isHealthCheckMode)
  }

  const filteredVaccinationData = selectedChild 
    ? vaccinationData.filter(item => item.studentId === selectedChild.studentId)
    : vaccinationData

  const filteredHealthCheckData = selectedChild 
    ? healthCheckData.filter(item => item.studentID === selectedChild.studentId)
    : healthCheckData

  const columns: ColumnsType<VaccinationConsent> = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAgreed',
      key: 'isAgreed',
      render: (isAgreed: boolean | null) => {
        if (isAgreed === true) return <Tag color='green'>Đã đồng ý</Tag>
        if (isAgreed === false) return <Tag color='red'>Đã từ chối</Tag>
        return <Tag color='orange'>Chờ phản hồi</Tag>
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.isAgreed === null && (
            <>
              <Button type='primary' className='bg-green-500' onClick={() => handleConsent(record, true)}>
                Đồng ý
              </Button>
              <Button type='primary' danger onClick={() => handleConsent(record, false)}>
                Từ chối
              </Button>
            </>
          )}
          <Button type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
        </Space>
      )
    }
  ]
  
  const healthCheckColumns: ColumnsType<HealthCheckNotification> = [
    {
      title: 'Mô tả',
      dataIndex: 'healthCheckDescription',
      key: 'healthCheckDescription',
      align: 'center' as const,
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        if (!date) return 'N/A'
        const parsedDate = dayjs(date)
        return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY HH:mm') : 'Invalid Date'
      },
      sorter: (a, b) => {
        const dateA = dayjs(a.date)
        const dateB = dayjs(b.date)
        
        if (!dateA.isValid() && !dateB.isValid()) return 0
        if (!dateA.isValid()) return 1
        if (!dateB.isValid()) return -1
        
        return dateA.unix() - dateB.unix()
      },
      align: 'center' as const,
    },
  ]

  return (
    <div
      className={`flex ${
        isHealthCheck
          ? 'bg-gradient-to-br from-blue-100 via-red-100 to-purple-100'
          : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'
      }`}
    >
      <div className='w-80 bg-gray-50 shadow-lg p-6 overflow-y-auto'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Danh sách con</h2>
          <p className='text-lg text-gray-500'>Chọn để xem lịch y tế</p>
        </div>

        <div className='space-y-3'>
          {childrenList.map((child) => (
            <div
              key={child.studentId}
              onClick={() => handleChildSelect(child)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                selectedChild?.studentId === child.studentId
                  ? 'border-blue-500 bg-white shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
              }`}
            >
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                    selectedChild?.studentId === child.studentId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-500'
                  }`}
                >
                  {child.fullname.trim().split(' ').pop()?.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <h3 className='text-gray-800 text-sm font-bold'>{child.fullname}</h3>
                  <div className='flex flex-col'>
                    <span className='text-sm text-gray-500'>Mã HS: {child.studentCode}</span>
                    <span className='text-sm text-gray-500'>Lớp: {child.className}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-1 p-12 overflow-y-hidden'>
        {selectedChild ? (
          <>
            <div className='mb-6'>
              <div className='flex justify-start mb-6 space-x-4'>
                <button
                  onClick={() => handleSwitchChange(false)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                    !isHealthCheck
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      !isHealthCheck ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-500'
                    }`}
                  >
                    <MedicineBoxOutlined />
                  </div>
                  <span className='font-medium text-md'>Tiêm chủng</span>
                </button>
                
                <button
                  onClick={() => handleSwitchChange(true)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                    isHealthCheck
                      ? 'bg-red-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-red-50 shadow-md'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isHealthCheck ? 'bg-white text-red-500' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    <HeartOutlined />
                  </div>
                  <span className='font-medium text-md'>Khám sức khỏe</span>
                </button>
              </div>
            </div>

            {!isHealthCheck ? (
              <>
                {filteredVaccinationData.some(item => item.isAgreed === null) && (
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
                    <div className='flex items-center'>
                      <div className='w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3'>
                        <span className='text-white text-sm font-bold'>!</span>
                      </div>
                      <span className='text-yellow-800 text-sm'>
                        Có {filteredVaccinationData.filter(item => item.isAgreed === null).length} sự kiện y tế cần được xác nhận
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
              </>
            )}

            <Card className='mb-6 shadow-sm'>
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3'>
                  <FaRegBell className='text-lg text-white' />
                </div>
                <h2 className='text-lg font-semibold text-gray-800'>Thông báo lịch {isHealthCheck? 'khám sức khỏe' : 'tiêm'}</h2>
              </div>

              { isHealthCheck ? (
                <Table
                  columns={healthCheckColumns}
                  dataSource={filteredHealthCheckData}
                  loading={loading}
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} kế hoạch`
                  }}
                  rowKey={(record : HealthCheckNotification) => record.healthCheckID.toString()}
                />
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredVaccinationData}
                  loading={loading}
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} kế hoạch`
                  }}
                  rowKey={(record : VaccinationConsent) => record.campaignId.toString()}
                />
              )}
            </Card>

            <Card className='shadow-sm'>
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3'>
                  <HistoryOutlined className='text-white text-lg' />
                </div>
                <h2 className='text-lg font-semibold text-gray-800'>Lịch sử {isHealthCheck? 'khám sức khỏe' : 'tiêm'}</h2>
              </div>

              { !isHealthCheck ? (
                <HistoryVaccination 
                  key={selectedChild.studentId}
                  studentId={selectedChild.studentId} 
                />
              ) : (
                <HistoryHealthCheck 
                  key={selectedChild.studentId}
                  studentId={selectedChild.studentId}
                />
              )}
            </Card>
          </>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <CalendarOutlined className='text-3xl text-gray-400' />
              </div>
              <div className='text-gray-500 text-xl font-medium'>Danh sách học sinh trống</div>
              <p className='text-gray-400 mt-2 text-lg mb-6'>Vui lòng thêm thông tin con của bạn để bắt đầu xem lịch y tế</p>
              <a href='/parent/profile' className='px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors'>
                Đi đến hồ sơ
              </a>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={isHealthCheck ? 'Chi tiết kế hoạch khám' : 'Chi tiết kế hoạch tiêm'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <Button key='close' onClick={handleCloseModal}>
            Đóng
          </Button>
        ]}
      >
        {selectedSchedule && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label={isHealthCheck ? 'Tên kế hoạch khám' : 'Tên chiến dịch'}>
              {selectedSchedule.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label='Học sinh'>{selectedSchedule.studentName}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>
              {selectedSchedule.isAgreed === true && 'Đã đồng ý'}
              {selectedSchedule.isAgreed === false && 'Đã từ chối'}
              {selectedSchedule.isAgreed === null && 'Chờ phản hồi'}
            </Descriptions.Item>
            <Descriptions.Item label='Ghi chú'>{selectedSchedule.note ? selectedSchedule.note : 'Không có'}</Descriptions.Item>
            <Descriptions.Item label='Ngày xác nhận'>
              {selectedSchedule.dateConfirmed
                ? dayjs.utc(selectedSchedule.dateConfirmed).local().format('DD/MM/YYYY HH:mm')
                : 'Chưa xác nhận'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default VaccinationSchedule