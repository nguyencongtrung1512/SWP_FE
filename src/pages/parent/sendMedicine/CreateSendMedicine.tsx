import React from 'react'
import { Form, Input, Select, DatePicker, Button, Checkbox } from 'antd'
import { sendMedicationToStudent } from '../../../apis/parentMedicationRequest'
import { getMyChildren } from '../../../api/parent.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const { TextArea } = Input
const { Option } = Select

interface FormValues {
  studentId: string
  reason: string
  medicineName: string
  medicineType: string
  timing: string
  dosage: string
  expiryDate?: dayjs.Dayjs
  specialNotes?: string
  agreement1: boolean
  agreement2: boolean
}

const CreateSendMedicine: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm()
  const [students, setStudents] = React.useState<{ id: number; fullname: string }[]>([])

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getMyChildren()
        if (res.success && res.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const studentList = res.data.map((s: any) => ({
            id: s.studentId,
            fullname: s.fullname
          }))
          setStudents(studentList)
        }
      } catch (error) {
        console.error('Failed to fetch students:', error)
        toast.error('Không thể tải danh sách học sinh.')
      }
    }
    fetchStudents()
  }, [])

  const onFinish = async (values: FormValues) => {
    try {
      // Chuẩn hóa dữ liệu gửi đi
      const data = {
        studentId: Number(values.studentId),
        parentNote: values.reason,
        medications: [
          {
            name: values.medicineName,
            type: values.medicineType,
            usage: values.timing,
            dosage: values.dosage,
            expiredDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '',
            note: values.specialNotes || ''
          }
        ]
      }
      await sendMedicationToStudent(data)
      toast.success('Gửi thông tin thuốc thành công!')
      form.resetFields()
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Failed to send medicine:', err)
      toast.error('Gửi thông tin thuốc thất bại!')
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-xl p-8'>
      <div className='flex items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Form Gửi Thuốc</h1>
      </div>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        {/* 1. Thông tin học sinh */}
        <div className='bg-gray-50 p-6 rounded-xl mb-6'>
          <h2 className='text-lg font-semibold mb-4'>1. Thông tin học sinh</h2>
          <div className='grid grid-cols-2 gap-6'>
            <Form.Item
              name='studentId'
              label='Học sinh'
              rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
            >
              <Select placeholder='Chọn học sinh'>
                {students.map((student) => (
                  <Option key={student.id} value={String(student.id)}>
                    {student.fullname}
                  </Option>
                ))}
              </Select>
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
              <Input placeholder='các thuốc để gửi' />
            </Form.Item>
            <Form.Item
              name='dosage'
              label='Liều lượng mỗi lần uống'
              rules={[{ required: true, message: 'Vui lòng nhập liều lượng!' }]}
            >
              <Input placeholder='VD: 1 viên, 5ml' />
            </Form.Item>
            <Form.Item
              name='timing'
              label='Thời gian uống cụ thể'
              rules={[{ required: true, message: 'Vui lòng nhập thời gian uống!' }]}
            >
              <Input placeholder='VD: Sau bữa trưa' />
            </Form.Item>
            <Form.Item
              name='expiryDate'
              label='Ngày gửi thuốc'
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve()
                    if (value.isBefore(dayjs(), 'day')) {
                      return Promise.reject(new Error('Ngày gửi thuốc không được nhỏ hơn ngày hiện tại!'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <DatePicker
                className='w-full'
                format='DD/MM/YYYY'
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </div>
        </div>
        {/* 3. Lý do dùng thuốc */}
        <div className='bg-gray-50 p-6 rounded-xl mb-6'>
          <h2 className='text-lg font-semibold mb-4'>3. Lý do dùng thuốc</h2>
          <div className='grid grid-cols-2 gap-6'>
            <Form.Item
              name='reason'
              label='Lý do dùng thuốc'
              rules={[{ required: true, message: 'Vui lòng nhập lý do dùng thuốc!' }]}
            >
              <TextArea rows={3} placeholder='VD: Hạ sốt, kháng sinh điều trị viêm họng' />
            </Form.Item>
          </div>
        </div>
        {/* 4. Xác nhận và cam kết */}
        <div className='bg-gray-50 p-6 rounded-xl mb-6'>
          <h2 className='text-lg font-semibold mb-4'>4. Xác nhận và cam kết</h2>
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
              Tôi cam kết thông tin trên là chính xác, thuốc còn hạn sử dụng và không gây hại đến sức khỏe của con tôi.
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
  )
}

export default CreateSendMedicine
