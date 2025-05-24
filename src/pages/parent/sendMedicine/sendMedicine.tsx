import React, { useState } from 'react'
import { Form, Input, Select, DatePicker, Upload, Checkbox, Button, message, Table, Tag, Space } from 'antd'
import { UploadOutlined, MedicineBoxOutlined, HistoryOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
const { RangePicker } = DatePicker

interface Student {
  id: string
  name: string
  class: string
}

interface MedicineRequest {
  id: string
  studentName: string
  medicineName: string
  sendDate: string
  status: 'pending' | 'received' | 'in_progress' | 'completed'
  duration: string
}

interface FormValues {
  studentId: string
  class: string
  sendDate: dayjs.Dayjs
  senderName: string
  emergencyPhone: string
  medicineName: string
  medicineType: string
  dosage: string
  frequency: string
  timing: string
  duration: [dayjs.Dayjs, dayjs.Dayjs]
  storage: string
  expiryDate?: dayjs.Dayjs
  reason: string
  specialNotes?: string
  images?: UploadFile[]
  agreement1: boolean
  agreement2: boolean
}

const SendMedicine: React.FC = () => {
  const [form] = Form.useForm<FormValues>()
  const [imageList, setImageList] = useState<UploadFile[]>([])

  // Mock data - sau này sẽ lấy từ API
  const studentsList: Student[] = [
    { id: '1', name: 'Nguyễn Văn An', class: '5A' },
    { id: '2', name: 'Nguyễn Thị Bình', class: '3B' }
  ]

  // Mock data cho lịch sử đơn thuốc
  const medicineHistory: MedicineRequest[] = [
    {
      id: '1',
      studentName: 'Nguyễn Văn An',
      medicineName: 'Paracetamol',
      sendDate: '20/03/2024',
      status: 'completed',
      duration: '20/03/2024 - 22/03/2024'
    },
    {
      id: '2',
      studentName: 'Nguyễn Văn An',
      medicineName: 'Vitamin C',
      sendDate: '18/03/2024',
      status: 'in_progress',
      duration: '18/03/2024 - 25/03/2024'
    },
    {
      id: '3',
      studentName: 'Nguyễn Thị Bình',
      medicineName: 'Thuốc ho',
      sendDate: '15/03/2024',
      status: 'pending',
      duration: '15/03/2024 - 18/03/2024'
    }
  ]

  // Cấu hình cột cho bảng lịch sử
  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'medicineName',
      key: 'medicineName'
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'sendDate',
      key: 'sendDate'
    },
    {
      title: 'Thời gian sử dụng',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue'
        let text = 'Chờ xác nhận'

        switch (status) {
          case 'received':
            color = 'cyan'
            text = 'Đã nhận thuốc'
            break
          case 'in_progress':
            color = 'orange'
            text = 'Đang thực hiện'
            break
          case 'completed':
            color = 'green'
            text = 'Đã hoàn thành'
            break
          default:
            color = 'blue'
            text = 'Chờ xác nhận'
        }

        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: MedicineRequest) => (
        <Space size='middle'>
          <Button type='link' onClick={() => message.info('Xem chi tiết ' + record.id)}>
            Xem chi tiết
          </Button>
        </Space>
      )
    }
  ]

  const handleStudentChange = (studentId: string) => {
    const student = studentsList.find((s) => s.id === studentId)
    if (student) {
      form.setFieldsValue({
        class: student.class
      })
    }
  }

  const onFinish = (values: FormValues) => {
    console.log('Form values:', values)
    message.success('Gửi thông tin thuốc thành công!')
  }

  const normFile = (e: { fileList: UploadFile[] }) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12'>
      <div className='w-full mx-auto px-20'>
        {/* Phần lịch sử đơn thuốc */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
          <div className='flex items-center mb-6'>
            <HistoryOutlined className='text-3xl text-blue-500 mr-3' />
            <h1 className='text-2xl font-bold text-gray-800'>Lịch sử gửi thuốc</h1>
          </div>
          <Table
            columns={columns}
            dataSource={medicineHistory}
            rowKey='id'
            pagination={{ pageSize: 5 }}
            className='bg-white'
          />
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='flex items-center mb-6'>
            <MedicineBoxOutlined className='text-3xl text-blue-500 mr-3' />
            <h1 className='text-2xl font-bold text-gray-800'>Form Gửi Thuốc</h1>
          </div>

          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            initialValues={{
              sendDate: dayjs()
            }}
          >
            {/* 1. Thông tin học sinh */}
            <div className='bg-gray-50 p-6 rounded-xl mb-6'>
              <h2 className='text-lg font-semibold mb-4'>1. Thông tin học sinh</h2>
              <div className='grid grid-cols-2 gap-6'>
                <Form.Item
                  name='studentId'
                  label='Họ và tên học sinh'
                  rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
                >
                  <Select
                    placeholder='Chọn học sinh'
                    onChange={handleStudentChange}
                    options={studentsList.map((student) => ({
                      value: student.id,
                      label: student.name
                    }))}
                  />
                </Form.Item>

                <Form.Item name='class' label='Lớp'>
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name='sendDate'
                  label='Ngày gửi thuốc'
                  rules={[{ required: true, message: 'Vui lòng chọn ngày gửi thuốc!' }]}
                >
                  <DatePicker className='w-full' format='DD/MM/YYYY' />
                </Form.Item>

                <Form.Item
                  name='senderName'
                  label='Người gửi thuốc'
                  rules={[{ required: true, message: 'Vui lòng nhập tên người gửi thuốc!' }]}
                >
                  <Input placeholder='Họ tên phụ huynh' />
                </Form.Item>

                <Form.Item
                  name='emergencyPhone'
                  label='Số điện thoại liên hệ khẩn'
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input placeholder='Số điện thoại' />
                </Form.Item>
              </div>
            </div>

            {/* 2. Thông tin thuốc */}
            <div className='bg-gray-50 p-6 rounded-xl mb-6'>
              <h2 className='text-lg font-semibold mb-4'>2. Thông tin thuốc</h2>
              <div className='grid grid-cols-2 gap-6'>
                <Form.Item
                  name='medicineName'
                  label='Tên thuốc'
                  rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
                >
                  <Input placeholder='Nhập tên thuốc' />
                </Form.Item>

                <Form.Item
                  name='medicineType'
                  label='Dạng thuốc'
                  rules={[{ required: true, message: 'Vui lòng chọn dạng thuốc!' }]}
                >
                  <Select
                    placeholder='Chọn dạng thuốc'
                    options={[
                      { value: 'vien', label: 'Viên' },
                      { value: 'siro', label: 'Siro' },
                      { value: 'bot', label: 'Bột pha' },
                      { value: 'nho_mat', label: 'Thuốc nhỏ mắt' },
                      { value: 'khac', label: 'Dạng khác' }
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name='dosage'
                  label='Liều lượng mỗi lần uống'
                  rules={[{ required: true, message: 'Vui lòng nhập liều lượng!' }]}
                >
                  <Input placeholder='VD: 1 viên, 5ml' />
                </Form.Item>

                <Form.Item
                  name='frequency'
                  label='Số lần uống mỗi ngày'
                  rules={[{ required: true, message: 'Vui lòng nhập số lần uống!' }]}
                >
                  <Input placeholder='VD: 2 lần sáng - chiều' />
                </Form.Item>

                <Form.Item
                  name='timing'
                  label='Thời gian uống cụ thể'
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian uống!' }]}
                >
                  <Input placeholder='VD: Sau bữa trưa' />
                </Form.Item>

                <Form.Item
                  name='duration'
                  label='Thời gian sử dụng'
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian sử dụng!' }]}
                >
                  <RangePicker className='w-full' format='DD/MM/YYYY' />
                </Form.Item>

                <Form.Item
                  name='storage'
                  label='Cách bảo quản'
                  rules={[{ required: true, message: 'Vui lòng chọn cách bảo quản!' }]}
                >
                  <Select
                    placeholder='Chọn cách bảo quản'
                    options={[
                      { value: 'normal', label: 'Nhiệt độ thường' },
                      { value: 'cold', label: 'Bảo quản lạnh' }
                    ]}
                  />
                </Form.Item>

                <Form.Item name='expiryDate' label='Hạn sử dụng thuốc'>
                  <DatePicker className='w-full' format='DD/MM/YYYY' />
                </Form.Item>
              </div>
            </div>

            {/* 3. Lý do dùng thuốc */}
            <div className='bg-gray-50 p-6 rounded-xl mb-6'>
              <h2 className='text-lg font-semibold mb-4'>3. Lý do dùng thuốc</h2>
              <Form.Item
                name='reason'
                label='Lý do dùng thuốc'
                rules={[{ required: true, message: 'Vui lòng nhập lý do dùng thuốc!' }]}
              >
                <TextArea rows={3} placeholder='VD: Hạ sốt, kháng sinh điều trị viêm họng' />
              </Form.Item>

              <Form.Item name='specialNotes' label='Ghi chú đặc biệt'>
                <TextArea rows={3} placeholder='VD: Dị ứng, cần uống với sữa, không dùng khi đau bụng' />
              </Form.Item>
            </div>

            {/* 4. Tải hình ảnh */}
            <div className='bg-gray-50 p-6 rounded-xl mb-6'>
              <h2 className='text-lg font-semibold mb-4'>4. Tải hình ảnh thuốc</h2>
              <Form.Item name='images' valuePropName='fileList' getValueFromEvent={normFile}>
                <Upload
                  listType='picture-card'
                  maxCount={3}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setImageList(fileList)}
                >
                  <div>
                    <UploadOutlined />
                    <div className='mt-2'>Tải ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            {/* 5. Xác nhận và cam kết */}
            <div className='bg-gray-50 p-6 rounded-xl mb-6'>
              <h2 className='text-lg font-semibold mb-4'>5. Xác nhận và cam kết</h2>
              <Form.Item
                name='agreement1'
                valuePropName='checked'
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận cam kết!'))
                  }
                ]}
              >
                <Checkbox>
                  Tôi cam kết thông tin trên là chính xác, thuốc còn hạn sử dụng và không gây hại đến sức khỏe của con
                  tôi.
                </Checkbox>
              </Form.Item>

              <Form.Item
                name='agreement2'
                valuePropName='checked'
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận đồng ý!'))
                  }
                ]}
              >
                <Checkbox>
                  Tôi đồng ý để nhân viên y tế nhà trường hỗ trợ cho con tôi uống thuốc theo thông tin trên.
                </Checkbox>
              </Form.Item>
            </div>

            <Form.Item>
              <Button type='primary' htmlType='submit' className='bg-blue-500 w-full h-12 text-lg'>
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SendMedicine
