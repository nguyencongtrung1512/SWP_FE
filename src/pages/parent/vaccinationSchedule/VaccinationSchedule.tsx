import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Table, Tag, Space, Button as AntButton, Modal, Descriptions } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { History, Calendar, Pill, Heart, AlertTriangle, Bell, User } from 'lucide-react'
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import HistoryVaccination from './HistoryVaccination'
import HistoryHealthCheck from './HistoryHealthCheck'
import { getParentNotifications, VaccinationConsent, sendConsent } from '../../../apis/vaccinatapi.api'
import { getHealthCheckNotifications, HealthCheckNotification } from '../../../apis/healthCheck.api'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getAccountInfo } from '../../../apis/parent.api'
import { toast } from 'react-toastify'

const { confirm } = Modal

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
      toast.error('Lấy danh sách học sinh thất bại!')
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
      const childrenIds = childrenList.map((child) => child.studentId)
      const filteredData = allVaccinationData.filter((item: VaccinationConsent) => childrenIds.includes(item.studentId))
      const mapped = filteredData.map((item: VaccinationConsent) => ({
        ...item,
        key: item.consentId.toString()
      }))
      setVaccinationData(mapped)
    } catch (err) {
      console.error(err)
      toast.error("Lấy dữ liệu lịch tiêm thất bại!")
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

      const childrenIds = childrenList.map((child) => child.studentId)
      const filteredData = allHealthCheckData.filter((item: HealthCheckNotification) =>
        childrenIds.includes(item.studentID)
      )
      console.log('Filtered health check data:', filteredData)
      setHealthCheckData(filteredData)
    } catch (err) {
      console.error(err)
      toast.error('Lấy dữ liệu lịch khám thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const showConsentConfirm = (record: VaccinationConsent, isAgreed: boolean) => {
    const actionText = isAgreed ? 'đồng ý' : 'từ chối'
    const actionColor = isAgreed ? '#52c41a' : '#ff4d4f'

    confirm({
      title: `Xác nhận ${actionText}`,
      icon: <ExclamationCircleOutlined style={{ color: actionColor }} />,
      content: (
        <div>
          <p>
            Bạn có chắc chắn muốn <strong>{actionText}</strong> cho:
          </p>
          <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
            <p>
              <strong>Chiến dịch:</strong> {record.campaignName}
            </p>
            <p>
              <strong>Học sinh:</strong> {record.studentName}
            </p>
          </div>
          <p style={{ marginTop: 12, color: '#666' }}>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: `Xác nhận ${actionText}`,
      cancelText: 'Hủy bỏ',
      okButtonProps: {
        style: { backgroundColor: actionColor, borderColor: actionColor }
      },
      onOk: () => handleConsent(record, isAgreed)
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
      toast.success(isAgreed ? 'Đã đồng ý tiêm!' : 'Đã từ chối tiêm!')
      await fetchVaccinationData()
    } catch (err) {
      console.error(err)
      toast.error('Xử lý thất bại!')
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
    ? vaccinationData.filter((item) => item.studentId === selectedChild.studentId)
    : vaccinationData

  const filteredHealthCheckData = selectedChild
    ? healthCheckData.filter((item) => item.studentID === selectedChild.studentId)
    : healthCheckData

  const columns: ColumnsType<VaccinationConsent> = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName',
      align: 'center' as const
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
              <AntButton type='primary' className='bg-green-500' onClick={() => showConsentConfirm(record, true)}>
                Đồng ý
              </AntButton>
              <AntButton type='primary' danger onClick={() => showConsentConfirm(record, false)}>
                Từ chối
              </AntButton>
            </>
          )}
          <AntButton type='link' icon={<FileTextOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </AntButton>
        </Space>
      )
    }
  ]

  const healthCheckColumns: ColumnsType<HealthCheckNotification> = [
    {
      title: 'Mô tả',
      dataIndex: 'healthCheckDescription',
      key: 'healthCheckDescription',
      align: 'center' as const
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
      align: 'center' as const
    }
  ]

  return (
    <div
      className={`flex min-h-screen ${
        isHealthCheck
          ? 'bg-gradient-to-br from-blue-100 via-red-100 to-purple-100'
          : 'bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100'
      }`}
    >
      <div className='w-80 bg-white/90 backdrop-blur-sm shadow-2xl p-6 overflow-y-auto border-r border-gray-200'>
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-gray-800 flex items-center'>
            <div className='w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg'>
              <User className='text-white w-6 h-6' />
            </div>
            Danh sách con
          </h2>
        </div>
        
        <div className='space-y-3'>
          {childrenList.map((child) => (
            <div
              key={child.studentId}
              onClick={() => handleChildSelect(child)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 shadow-sm hover:shadow-md ${
                selectedChild?.studentId === child.studentId
                  ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 bg-white/80 hover:border-cyan-300 hover:bg-white'
              }`}
            >
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                    selectedChild?.studentId === child.studentId
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                      : 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700'
                  }`}
                >
                  {child.fullname.trim().split(" ").pop()?.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <h3 className='text-gray-800 text-sm font-bold'>{child.fullname}</h3>
                  <div className='flex flex-col space-y-1'>
                    <span className='text-xs text-gray-600'>Mã HS: {child.studentCode}</span>
                    <span className='text-xs text-gray-600'>Lớp: {child.className}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-1 p-8 overflow-y-auto'>
        {selectedChild ? (
          <>
            <div className='mb-6'>
              <div className='flex justify-start mb-6 space-x-4'>
                <Button
                  onClick={() => handleSwitchChange(false)}
                  variant={!isHealthCheck ? 'default' : 'outline'}
                  className={`px-6 py-3 h-auto transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105 hover:shadow-lg ${
                    !isHealthCheck
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl border-0'
                      : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border-cyan-200 hover:border-cyan-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      !isHealthCheck
                        ? 'bg-white text-cyan-600 shadow-md'
                        : 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700'
                    }`}
                  >
                    <Pill className='w-4 h-4' />
                  </div>
                  <span className='font-semibold'>Tiêm chủng</span>
                </Button>
                <Button
                  onClick={() => handleSwitchChange(true)}
                  variant={isHealthCheck ? 'default' : 'outline'}
                  className={`px-6 py-3 h-auto transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105 hover:shadow-lg ${
                    isHealthCheck
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl border-0'
                      : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md border-red-200 hover:border-red-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isHealthCheck
                        ? 'bg-white text-red-600 shadow-md'
                        : 'bg-gradient-to-br from-red-100 to-pink-100 text-red-700'
                    }`}
                  >
                    <Heart className='w-4 h-4' />
                  </div>
                  <span className='font-semibold'>Khám sức khỏe</span>
                </Button>
              </div>
            </div>

            {!isHealthCheck && filteredVaccinationData.some((item) => item.isAgreed === null) && (
              <Alert className='mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm flex items-center space-x-3'>
                <div className='w-5 h-5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0'>
                  <AlertTriangle className='text-white w-3 h-3' />
                </div>
                <AlertDescription className='font-medium text-amber-800'>
                  Có {filteredVaccinationData.filter((item) => item.isAgreed === null).length} sự kiện y tế cần được xác nhận
                </AlertDescription>
              </Alert>
            )}

            <Card className='mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm'>
              <CardHeader className='pb-4'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 shadow-lg'>
                    <Bell className='text-white w-5 h-5' />
                  </div>
                  <h2 className='text-lg font-bold text-gray-800'>
                    Thông báo lịch {isHealthCheck ? 'khám sức khỏe' : 'tiêm chủng'}
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                {isHealthCheck ? (
                  <Table
                    columns={healthCheckColumns}
                    dataSource={filteredHealthCheckData}
                    loading={loading}
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng số ${total} kế hoạch`
                    }}
                    locale={{
                      triggerDesc: 'Nhấn để sắp xếp giảm dần',
                      triggerAsc: 'Nhấn để sắp xếp tăng dần',
                      cancelSort: 'Hủy sắp xếp',
                      emptyText: 'Không có dữ liệu',
                    }}
                    rowKey={(record: HealthCheckNotification) => record.healthCheckID.toString()}
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
                    locale={{
                      triggerDesc: 'Nhấn để sắp xếp giảm dần',
                      triggerAsc: 'Nhấn để sắp xếp tăng dần',
                      cancelSort: 'Hủy sắp xếp',
                      emptyText: 'Không có dữ liệu',
                    }}
                    rowKey={(record: VaccinationConsent) => record.campaignId.toString()}
                  />
                )}
              </CardContent>
            </Card>

            <Card className='shadow-xl border-0 bg-white/95 backdrop-blur-sm'>
              <CardHeader className='pb-4'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-lg'>
                    <History className='text-white w-5 h-5' />
                  </div>
                  <h2 className='text-lg font-bold text-gray-800'>
                    Lịch sử {isHealthCheck ? 'khám sức khỏe' : 'tiêm'}
                  </h2>
                </div>
              </CardHeader>
              {!isHealthCheck ? (
                <HistoryVaccination key={selectedChild.studentId} studentId={selectedChild.studentId} />
              ) : (
                <HistoryHealthCheck key={selectedChild.studentId} studentId={selectedChild.studentId} />
              )}
            </Card>
          </>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg'>
                <Calendar className='text-3xl text-gray-400' />
              </div>
              <div className='text-gray-600 text-xl font-bold'>Danh sách học sinh trống</div>
              <p className='text-gray-500 mt-2 text-sm mb-6'>
                Vui lòng thêm thông tin con của bạn để bắt đầu xem lịch y tế
              </p>
              <Button
                asChild
                className='bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
              >
                <a href='/parent/profile'>Đi đến hồ sơ</a>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        title={isHealthCheck ? 'Chi tiết kế hoạch khám' : 'Chi tiết kế hoạch tiêm'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <AntButton key='close' onClick={handleCloseModal}>
            Đóng
          </AntButton>
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
            <Descriptions.Item label='Ghi chú'>
              {selectedSchedule.note ? selectedSchedule.note : 'Không có'}
            </Descriptions.Item>
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