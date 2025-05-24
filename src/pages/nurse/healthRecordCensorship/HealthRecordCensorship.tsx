import React, { useState } from 'react'
import { Table, Tag, Button, Space, Modal, Tabs, Form, Input, Typography } from 'antd'
import type { TabsProps } from 'antd'

const { TextArea } = Input
const { Title, Text } = Typography

interface HealthRecord {
  key: string
  name: string
  class: string
  dob: string
  gender: string
  studentId: string
  status: string
  allergies?: string[]
  medicalHistory?: string[]
  vaccinationHistory?: {
    date: string
    vaccine: string
    notes: string
  }[]
  parentNotes?: string
}

const data: HealthRecord[] = [
  {
    key: '1',
    name: 'Nguyễn Văn An',
    class: '5A',
    dob: '15/05/2012',
    gender: 'Nam',
    studentId: 'HS2024001',
    status: 'pending',
    allergies: ['Đậu phộng', 'Hải sản'],
    medicalHistory: ['Hen suyễn'],
    vaccinationHistory: [
      {
        date: '15/03/2023',
        vaccine: 'Cúm mùa',
        notes: 'Không có phản ứng phụ'
      },
      {
        date: '20/06/2023',
        vaccine: 'Viêm não Nhật Bản',
        notes: 'Sốt nhẹ sau tiêm'
      }
    ],
    parentNotes: 'Bé hay bị dị ứng với thời tiết, cần chú ý khi thời tiết thay đổi'
  },
  {
    key: '2',
    name: 'Nguyễn Thị Bình',
    class: '3B',
    dob: '22/09/2014',
    gender: 'Nữ',
    studentId: 'HS2024002',
    status: 'approved',
    allergies: ['Sữa bò'],
    medicalHistory: [],
    vaccinationHistory: [
      {
        date: '10/01/2024',
        vaccine: 'Cúm mùa',
        notes: 'Không có phản ứng phụ'
      }
    ],
    parentNotes: 'Bé cần uống sữa đặc biệt, không uống sữa bò'
  }
]

const HealthRecordCensorship: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null)

  const showModal = (record: HealthRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedRecord(null)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Chi tiết cá nhân',
      children: (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Text strong>Họ và tên:</Text>
              <Text className='ml-2'>{selectedRecord?.name}</Text>
            </div>
            <div>
              <Text strong>Mã học sinh:</Text>
              <Text className='ml-2'>{selectedRecord?.studentId}</Text>
            </div>
            <div>
              <Text strong>Lớp:</Text>
              <Text className='ml-2'>{selectedRecord?.class}</Text>
            </div>
            <div>
              <Text strong>Ngày sinh:</Text>
              <Text className='ml-2'>{selectedRecord?.dob}</Text>
            </div>
            <div>
              <Text strong>Giới tính:</Text>
              <Text className='ml-2'>{selectedRecord?.gender}</Text>
            </div>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: 'Dị ứng, bệnh lý',
      children: (
        <div className='space-y-4'>
          <div>
            <Title level={5}>Dị ứng</Title>
            {selectedRecord?.allergies && selectedRecord.allergies.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {selectedRecord.allergies.map((allergy, index) => (
                  <Tag key={index} color='red'>
                    {allergy}
                  </Tag>
                ))}
              </div>
            ) : (
              <Text type='secondary'>Không có</Text>
            )}
          </div>
          <div>
            <Title level={5}>Bệnh lý</Title>
            {selectedRecord?.medicalHistory && selectedRecord.medicalHistory.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {selectedRecord.medicalHistory.map((disease, index) => (
                  <Tag key={index} color='orange'>
                    {disease}
                  </Tag>
                ))}
              </div>
            ) : (
              <Text type='secondary'>Không có</Text>
            )}
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: 'Lịch sử tiêm',
      children: (
        <div className='space-y-4'>
          {selectedRecord?.vaccinationHistory && selectedRecord.vaccinationHistory.length > 0 ? (
            <Table
              dataSource={selectedRecord.vaccinationHistory}
              columns={[
                {
                  title: 'Ngày tiêm',
                  dataIndex: 'date',
                  key: 'date'
                },
                {
                  title: 'Vaccine',
                  dataIndex: 'vaccine',
                  key: 'vaccine'
                },
                {
                  title: 'Ghi chú',
                  dataIndex: 'notes',
                  key: 'notes'
                }
              ]}
              pagination={false}
            />
          ) : (
            <Text type='secondary'>Không có lịch sử tiêm</Text>
          )}
        </div>
      )
    },
    {
      key: '4',
      label: 'Ghi chú của phụ huynh',
      children: (
        <div className='space-y-4'>
          {selectedRecord?.parentNotes ? (
            <TextArea value={selectedRecord.parentNotes} autoSize={{ minRows: 4, maxRows: 6 }} readOnly />
          ) : (
            <Text type='secondary'>Không có ghi chú</Text>
          )}
        </div>
      )
    }
  ]

  const columns = [
    {
      title: 'Họ tên học sinh',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Mã số học sinh',
      dataIndex: 'studentId',
      key: 'studentId'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'pending' ? <Tag color='orange'>Chờ duyệt</Tag> : <Tag color='green'>Đã duyệt</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HealthRecord) => (
        <Space>
          <Button type='link' onClick={() => showModal(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type='primary' className='bg-green-500'>
                Duyệt
              </Button>
              <Button danger>Từ chối</Button>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Nhận và kiểm duyệt hồ sơ sức khỏe</h2>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        title='Chi tiết hồ sơ sức khỏe'
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key='close' onClick={handleCancel}>
            Đóng
          </Button>
        ]}
      >
        {selectedRecord && <Tabs defaultActiveKey='1' items={items} />}
      </Modal>
    </div>
  )
}

export default HealthRecordCensorship
