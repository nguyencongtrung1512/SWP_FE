import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Descriptions, message } from 'antd'
import { FileTextOutlined, HistoryOutlined, CalendarOutlined, MedicineBoxOutlined, HeartOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { FaRegBell } from 'react-icons/fa'
import HistoryVaccination from './HistoryVaccination'
import HistoryHealthCheck from './HistoryHealthCheck'
import { getParentNotifications, VaccinationConsent, sendConsent } from '../../../apis/vaccination'
import { getHealthCheckNotifications, HealthCheckNotification } from '../../../apis/healthCheck'
import { getAllStudents } from '../../../apis/student'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface Child {
  studentId: number
  studentName: string
  studentCode: string
  className: string
}

const VaccinationSchedule: React.FC = () => {
  const [vaccinationData, setVaccinationData] = useState<VaccinationConsent[]>([])
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<VaccinationConsent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [isHealthCheck, setIsHealthCheck] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchVaccinationData()
      await fetchHealthCheckData()
    }
    fetchData()
  }, [refreshKey])

  useEffect(() => {
    if (childrenList.length > 0 && !selectedChild) {
      setSelectedChild(childrenList[0])
    }
  }, [childrenList, selectedChild])

  const fetchVaccinationData = async () => {
    try {
      setLoading(true)
      const res = await getParentNotifications()
      const mapped = res.data.$values.map((item) => ({
        ...item,
        key: item.consentId.toString()
      }))
      setVaccinationData(mapped)

      const childrenFromVaccination = extractChildren(mapped, 'vaccination')
      updateChildrenList(await childrenFromVaccination)
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
      console.log('Fetched data:', res.data)
      setHealthCheckData(res.data.$values)
      
      const childrenFromHealthCheck = extractChildren(res.data.$values, 'healthcheck')
      updateChildrenList(await childrenFromHealthCheck)
    } catch (err) {
      console.error(err)
      message.error('Lấy dữ liệu lịch khám thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const extractChildren = async (data: any[], type: 'vaccination' | 'healthcheck'): Promise<Child[]> => {
    const children: Child[] = []
    const seen = new Set()
    
    // Fetch all students
    let allStudentsData: any[] = []
    try {
      const res = await getAllStudents()
      allStudentsData = res.data.$values || res.data || []
    } catch (err) {
      console.error('Error fetching all students:', err)
    }
    
    data.forEach((item) => {
      const studentId = type === 'vaccination' ? item.studentId : item.studentID
      const studentName = type === 'vaccination' ? item.studentName : item.studentName
      
      if (!seen.has(studentId) && studentId && studentName) {
        // Find matching student from fetched students
        const matchingStudent = allStudentsData.find(student => student.studentId === studentId)
        
        children.push({
          studentId,
          studentName,
          studentCode: matchingStudent?.studentCode || 'N/A',
          className: matchingStudent?.className || 'N/A'
        })
        seen.add(studentId)
      }
    })
    
    return children
  }

  const updateChildrenList = (newChildren: Child[]) => {
    setChildrenList(prevChildren => {
      const existingIds = new Set(prevChildren.map(child => child.studentId))
      const childrenToAdd = newChildren.filter(child => !existingIds.has(child.studentId))
      return [...prevChildren, ...childrenToAdd]
    })
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
      setRefreshKey((prev) => prev + 1)
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
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      render: (text: string) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Y tá phụ trách',
      dataIndex: 'nurseID',
      key: 'nurseID',
    }
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
                  {child.studentName.charAt(0)}
                </div>
                <div className='flex-1'>
                  <h3 className='text-gray-800 text-sm font-bold'>{child.studentName}</h3>
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

      <div className='flex-1 p-6 overflow-y-hidden'>
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
                  rowKey='healthCheckId'
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
                  rowKey='key'
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
              <h2 className='text-xl font-semibold text-gray-600 mb-2'>Chọn một học sinh</h2>
              <p className='text-gray-500'>Chọn một học sinh từ thanh bên để xem lịch y tế của các em</p>
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