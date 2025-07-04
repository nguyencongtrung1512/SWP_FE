import { Modal, Form, Select, Input, DatePicker, Button } from 'antd'
import { createHealthConsultationBookingByNurse } from '../../../apis/healthConsultationBooking.api'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
const { TextArea } = Input

interface LocalStudent {
  id: string
  name: string
  class: string
  studentCode?: string
  parentId?: number
}

interface CreateConsultationProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  students: LocalStudent[]
  consultationRequests: { scheduledTime: string }[]
}

function CreateConsultation({ visible, onCancel, onSuccess, students, consultationRequests }: CreateConsultationProps) {
  const [form] = Form.useForm()

  const handleCreateRequest = async () => {
    try {
      const values = await form.validateFields()
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const nurseId = user.accountID
      const student = students.find((s) => s.id === values.studentId)
      if (!nurseId || !student) {
        toast.error('Không tìm thấy thông tin y tá hoặc học sinh!')
        return
      }
      const payload = {
        studentId: Number(student.id),
        nurseId: Number(nurseId),
        parentId: student.parentId || 0,
        scheduledTime: values.suggestedTime ? values.suggestedTime.format('YYYY-MM-DDTHH:mm:00') : '',
        reason: values.reason,
        studentCode: student.studentCode || ''
      }
      if (!values.suggestedTime) {
        toast.error('Vui lòng chọn thời gian hợp lệ!')
        return
      }
      console.log('payload gửi BE:', payload)
      await createHealthConsultationBookingByNurse(payload)
      toast.success('Gửi lời mời tư vấn thành công!')
      onSuccess()
      form.resetFields()
    } catch (err: unknown) {
      // Nếu là lỗi validate của antd form thì không hiện toast
      if ((err as { errorFields?: unknown })?.errorFields) return
      toast.error('Gửi lời mời tư vấn thất bại!')
    }
  }

  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00'
  ]

  return (
    <Modal
      title='Tạo lời mời tư vấn'
      open={visible}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      footer={[
        <Button
          key='cancel'
          onClick={() => {
            onCancel()
            form.resetFields()
          }}
        >
          Hủy
        </Button>,
        <Button key='submit' type='primary' onClick={() => form.submit()}>
          Gửi lời mời
        </Button>
      ]}
      width={800}
    >
      <Form form={form} layout='vertical' onFinish={handleCreateRequest}>
        <Form.Item name='studentId' label='Học sinh' rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}>
          <Select
            placeholder='Chọn học sinh'
            options={students.map((student) => ({
              value: student.id,
              label: `${student.name} - Lớp ${student.class}`
            }))}
          />
        </Form.Item>

        <Form.Item name='reason' label='Lý do mời tư vấn' rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
          <TextArea rows={4} placeholder='Nhập lý do mời tư vấn...' />
        </Form.Item>

        <Form.Item
          name='suggestedTime'
          label='Thời gian gợi ý'
          rules={[
            { required: true, message: 'Vui lòng chọn thời gian!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve()
                const hour = value.hour().toString().padStart(2, '0')
                const minute = value.minute().toString().padStart(2, '0')
                const timeStr = `${hour}:${minute}`
                if (!timeSlots.includes(timeStr)) {
                  return Promise.reject('Chỉ được chọn các khung giờ quy định!')
                }
                // Validate trùng giờ trong 1 ngày
                const picked = value.format('YYYY-MM-DD HH:mm')
                const isDuplicate = consultationRequests.some((req) =>
                  dayjs(req.scheduledTime).format('YYYY-MM-DD HH:mm') === picked
                )
                if (isDuplicate) {
                  return Promise.reject('Đã có lịch tư vấn vào khung giờ này trong ngày, vui lòng chọn thời gian khác!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <DatePicker
            showTime={{
              format: 'HH:mm',
              defaultValue: undefined,
              hideDisabledOptions: true,
              disabledHours: () => {
                // Lấy tất cả giờ không có trong timeSlots
                const allowedHours = Array.from(new Set(timeSlots.map((t) => parseInt(t.split(':')[0], 10))))
                return Array.from({ length: 24 }, (_, i) => i).filter((h) => !allowedHours.includes(h))
              },
              disabledMinutes: (selectedHour) => {
                // Chỉ cho phép phút hợp lệ với giờ đã chọn
                const allowedMinutes = timeSlots
                  .filter((t) => parseInt(t.split(':')[0], 10) === selectedHour)
                  .map((t) => parseInt(t.split(':')[1], 10))
                return Array.from({ length: 60 }, (_, i) => i).filter((m) => !allowedMinutes.includes(m))
              }
            }}
            format='DD/MM/YYYY HH:mm'
            style={{ width: '100%' }}
            disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
          />
        </Form.Item>

        <Form.Item name='notes' label='Ghi chú thêm'>
          <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateConsultation
