import React, { useState } from 'react'
import { Table, Tag, Button, Modal, Form, DatePicker, Input, message, Space } from 'antd'
import { CheckOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'

const { TextArea } = Input

interface ConsultationRequest {
  id: string
  studentName: string
  reason: string
  proposedTime: string
  type: 'direct' | 'phone'
  status: 'pending' | 'confirmed' | 'completed'
}

interface RescheduleFormValues {
  newDateTime: Dayjs
  note: string
}

const PrivateConsultation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [form] = Form.useForm<RescheduleFormValues>()

  // Mock data
  const consultationRequests: ConsultationRequest[] = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      reason: 'Kiểm tra mắt bất thường',
      proposedTime: '10:00 25/05/2024',
      type: 'direct',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Nguyễn Thị Bình',
      reason: 'Tư vấn về chế độ ăn uống',
      proposedTime: '14:30 26/05/2024',
      type: 'phone',
      status: 'confirmed'
    },
    {
      id: '3',
      studentName: 'Trần Văn Cường',
      reason: 'Theo dõi chiều cao cân nặng',
      proposedTime: '09:00 24/05/2024',
      type: 'direct',
      status: 'completed'
    }
  ]

  const handleConfirm = (record: ConsultationRequest) => {
    message.success(`Bạn đã xác nhận lịch tư vấn với nhân viên y tế vào lúc ${record.proposedTime}`)
  }

  const showRescheduleModal = (record: ConsultationRequest) => {
    setSelectedRequest(record)
    setIsModalOpen(true)
  }

  const handleReschedule = (values: RescheduleFormValues) => {
    if (selectedRequest) {
      console.log('Reschedule request:', {
        requestId: selectedRequest.id,
        newDateTime: values.newDateTime.format('HH:mm DD/MM/YYYY'),
        note: values.note
      })
      message.success('Đã gửi đề xuất lịch mới thành công!')
      setIsModalOpen(false)
      form.resetFields()
    }
  }

  const columns = [
    {
      title: 'Họ tên học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Lý do tư vấn',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Thời gian đề xuất',
      dataIndex: 'proposedTime',
      key: 'proposedTime'
    },
    {
      title: 'Hình thức',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'direct' ? 'blue' : 'purple'}>{type === 'direct' ? 'Trực tiếp' : 'Điện thoại'}</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue'
        let text = 'Chờ xác nhận'

        switch (status) {
          case 'confirmed':
            color = 'orange'
            text = 'Đã xác nhận'
            break
          case 'completed':
            color = 'green'
            text = 'Đã hoàn thành'
            break
        }

        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: ConsultationRequest) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type='primary'
                icon={<CheckOutlined />}
                onClick={() => handleConfirm(record)}
                className='bg-green-500 hover:bg-green-600'
              >
                Xác nhận
              </Button>
              <Button icon={<EditOutlined />} onClick={() => showRescheduleModal(record)}>
                Đề xuất lại lịch
              </Button>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className='p-6 space-y-8'>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md'>
        <div className='flex items-center mb-6'>
          <MessageOutlined className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl font-bold text-gray-800'>Danh sách yêu cầu tư vấn</h1>
        </div>

        <Table columns={columns} dataSource={consultationRequests} rowKey='id' pagination={{ pageSize: 5 }} />

        <Modal
          title='Đề xuất lại lịch tư vấn'
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false)
            form.resetFields()
          }}
          footer={null}
        >
          <Form form={form} layout='vertical' onFinish={handleReschedule} className='mt-4'>
            <Form.Item
              name='newDateTime'
              label='Thời gian đề xuất mới'
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime format='HH:mm DD/MM/YYYY' className='w-full' placeholder='Chọn ngày và giờ' />
            </Form.Item>

            <Form.Item name='note' label='Ghi chú' rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}>
              <TextArea rows={4} placeholder='Ví dụ: Tôi bận sáng, xin đổi sang chiều' />
            </Form.Item>

            <Form.Item className='mb-0 text-right'>
              <Space>
                <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button type='primary' htmlType='submit' className='bg-blue-500'>
                  Gửi đề xuất
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default PrivateConsultation
