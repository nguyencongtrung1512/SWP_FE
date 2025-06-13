import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Button, Modal, Typography, Space, message, Row, Col } from 'antd'
import dayjs from 'dayjs'
import {
  updateMedicalEvent,
  getMedicalEventById,
  MedicalEvent,
  CreateMedicalEventRequest
} from '../../../apis/medicalEvent'
import { getStudentByCode, getStudentById, Student } from '../../../apis/student'
import { getAllMedications, Medication } from '../../../apis/medication'

const { Text } = Typography
const { TextArea } = Input

interface UpdateEventProps {
  eventId: number
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const UpdateEvent: React.FC<UpdateEventProps> = ({ eventId, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [studentCode, setStudentCode] = useState<string>('')
  const [foundStudent, setFoundStudent] = useState<Student | null>(null)
  const [medicationOptions, setMedicationOptions] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await getAllMedications()
        if (response.data && response.data.$values) {
          const options = response.data.$values.map((med: Medication) => ({
            value: med.medicationId,
            label: med.name
          }))
          setMedicationOptions(options)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching medications:', error)
          message.error(`Lỗi khi tải danh sách thuốc: ${error.message}`)
        } else {
          console.error('Unknown error fetching medications:', error)
          message.error('Lỗi khi tải danh sách thuốc.')
        }
      }
    }
    fetchMedications()
  }, [])

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (visible && eventId) {
        try {
          setLoading(true)
          const response = await getMedicalEventById(eventId)
          const eventData: MedicalEvent = response.data

          // Fetch student details by studentId from the medical event
          if (eventData.studentId) {
            const studentResponse = await getStudentById(eventData.studentId)
            setFoundStudent(studentResponse.data)
            setStudentCode(studentResponse.data.studentCode.trim())
          } else {
            setFoundStudent(null)
            setStudentCode('')
          }

          form.setFieldsValue({
            studentId: eventData.studentId,
            type: eventData.type,
            description: eventData.description,
            note: eventData.note,
            date: dayjs(eventData.date),
            medicationIds: eventData.medicationIds.$values
          })
        } catch (error: unknown) {
          if (error instanceof Error) {
            message.error(`Không thể tải thông tin sự kiện: ${error.message}`)
          } else {
            message.error('Không thể tải thông tin sự kiện')
          }
          onCancel()
        } finally {
          setLoading(false)
        }
      }
    }
    fetchEventDetails()
  }, [visible, eventId, form, onCancel])

  // Debounce student code search
  useEffect(() => {
    const fetchStudentByCode = async () => {
      if (studentCode && foundStudent?.studentCode !== studentCode) {
        // Only search if code changed or no student found
        try {
          const response = await getStudentByCode(studentCode)
          const studentData = response.data
          setFoundStudent(studentData)
          form.setFieldsValue({ studentId: studentData.studentId })
        } catch (error: unknown) {
          if (error instanceof Error) {
            message.error(`Lỗi khi tìm học sinh: ${error.message}`)
          } else {
            message.error('Lỗi khi tìm học sinh.')
          }
          setFoundStudent(null)
          form.setFieldsValue({ studentId: undefined })
        }
      } else if (!studentCode) {
        setFoundStudent(null)
        form.setFieldsValue({ studentId: undefined })
      }
    }
    const handler = setTimeout(() => {
      fetchStudentByCode()
    }, 500) // Debounce search
    return () => clearTimeout(handler)
  }, [studentCode, form, foundStudent])

  const onFinish = async (values: {
    studentId: number
    type: string
    description: string
    note: string
    date: string
    medicationIds: number[]
  }) => {
    if (!foundStudent) {
      message.error('Vui lòng nhập mã học sinh hợp lệ.')
      return
    }
    try {
      setLoading(true)
      const data: CreateMedicalEventRequest = {
        studentId: values.studentId,
        type: values.type,
        description: values.description,
        note: values.note,
        date: values.date,
        medicationIds: values.medicationIds
      }
      await updateMedicalEvent(eventId, data)
      message.success('Cập nhật sự kiện y tế thành công!')
      onSuccess()
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(`Không thể cập nhật sự kiện y tế: ${error.message}`)
      } else {
        message.error('Không thể cập nhật sự kiện y tế')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title='Chỉnh sửa sự kiện y tế' open={visible} onCancel={onCancel} width={800} footer={null}>
      <Form form={form} layout='vertical' onFinish={onFinish} disabled={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='date'
              label='Thời gian sự kiện'
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime format='DD/MM/YYYY HH:mm' style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='type'
              label='Loại sự kiện'
              rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
            >
              <Select
                options={[
                  { value: 'Sốt', label: 'Sốt' },
                  { value: 'Tai nạn', label: 'Tai nạn' },
                  { value: 'Dịch bệnh', label: 'Dịch bệnh' },
                  { value: 'Khác', label: 'Khác' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Mã học sinh'>
          <Input value={studentCode} onChange={(e) => setStudentCode(e.target.value.trim().toUpperCase())} readOnly />
        </Form.Item>

        {foundStudent && (
          <Form.Item label='Tên học sinh'>
            <Text strong>{foundStudent.fullname}</Text>
            <Form.Item name='studentId' noStyle>
              <Input type='hidden' />
            </Form.Item>
          </Form.Item>
        )}

        <Form.Item
          name='description'
          label='Mô tả chi tiết'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TextArea rows={4} placeholder='Nhập mô tả chi tiết về sự kiện...' />
        </Form.Item>

        <Form.Item name='note' label='Ghi chú thêm'>
          <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' />
        </Form.Item>

        <Form.Item
          name='medicationIds'
          label='Thuốc sử dụng'
          rules={[{ required: true, message: 'Vui lòng chọn thuốc!' }]}
        >
          <Select mode='multiple' placeholder='Chọn thuốc' options={medicationOptions} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit' loading={loading}>
              Lưu thay đổi
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateEvent
