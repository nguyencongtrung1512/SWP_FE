import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Space, Button, Modal, Descriptions, message } from 'antd'
import { FileTextOutlined, HistoryOutlined, CalendarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import HistoryVaccination from './HistoryVaccination'
import { getParentNotifications, VaccinationConsent, sendConsent } from '../../../apis/vaccination'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface Child {
  studentId: number
  studentName: string
}

const VaccinationSchedule: React.FC = () => {
  const [data, setData] = useState<VaccinationConsent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<VaccinationConsent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [childrenList, setChildrenList] = useState<Child[]>([])

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getParentNotifications()
      const mapped = res.data.$values.map((item) => ({
        ...item,
        key: item.consentId.toString()
      }))
      setData(mapped)

      const uniqueChildren: Child[] = []
      const seen = new Set()
      mapped.forEach((item) => {
        if (!seen.has(item.studentId)) {
          uniqueChildren.push({
            studentId: item.studentId,
            studentName: item.studentName
          })
          seen.add(item.studentId)
        }
      })
      setChildrenList(uniqueChildren)
    } catch (err) {
      console.error(err)
      message.error('Lấy dữ liệu lịch tiêm thất bại!')
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

  const columns: ColumnsType<VaccinationConsent> = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName'
    },
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
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

  return (
    <div className='p-6 space-y-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <CalendarOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch tiêm chủng / khám sức khỏe</h1>
        </div>

        <Card className='shadow-md'>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} kế hoạch`
            }}
            rowKey='key'
          />
        </Card>
      </div>

      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Lịch sử tiêm của con</h1>
        </div>
        <HistoryVaccination childrenList={childrenList} />
      </div>

      <Modal
        title='Chi tiết kế hoạch'
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
            <Descriptions.Item label='Tên chiến dịch'>{selectedSchedule.campaignName}</Descriptions.Item>
            <Descriptions.Item label='Học sinh'>{selectedSchedule.studentName}</Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>
              {selectedSchedule.isAgreed === true && 'Đã đồng ý'}
              {selectedSchedule.isAgreed === false && 'Đã từ chối'}
              {selectedSchedule.isAgreed === null && 'Chờ phản hồi'}
            </Descriptions.Item>
            <Descriptions.Item label='Ghi chú'>{selectedSchedule.note || 'Không có'}</Descriptions.Item>
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
