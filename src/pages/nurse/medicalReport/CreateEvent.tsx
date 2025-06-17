import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Button, Card, Typography, Space, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { createMedicalEvent, CreateMedicalEventRequest } from '../../../apis/medicalEvent'
import { getStudentByCode, Student } from '../../../apis/student'
import { getAllMedications, Medication } from '../../../apis/medication'
import medicalSupplyApi, { MedicalSupply } from '../../../apis/medicalSupply'
import { toast } from 'react-toastify'

const { Title } = Typography
const { TextArea } = Input

interface CreateEventProps {
  onSuccess?: () => void
}

const CreateEvent: React.FC<CreateEventProps> = ({ onSuccess }) => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [studentCode, setStudentCode] = useState<string>('')
  const [foundStudent, setFoundStudent] = useState<Student | null>(null)
  const [medicationOptions, setMedicationOptions] = useState<{ value: number; label: string }[]>([])
  const [medicalSupplyOptions, setMedicalSupplyOptions] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await getAllMedications()
        if (response.data && response.data.$values) {
          const options = response.data.$values.map((med: Medication) => ({
            value: med.medicationId,
            label: med.name,
          }))
          setMedicationOptions(options)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching medications:', error)
          toast.error(`Lỗi khi tải danh sách thuốc: ${error.message}`)
        } else {
          console.error('Unknown error fetching medications:', error)
          toast.error('Lỗi khi tải danh sách thuốc.')
        }
      }
    }
    fetchMedications()

    const fetchMedicalSupplies = async () => {
      try {
        const response = await medicalSupplyApi.getAll()
        if (response.data && response.data.$values) {
          const options = response.data.$values.map((supply: MedicalSupply) => ({
            value: supply.$id!,
            label: supply.name,
          }))
          setMedicalSupplyOptions(options)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching medical supplies:', error)
          toast.error(`Lỗi khi tải danh sách vật tư y tế: ${error.message}`)
        } else {
          console.error('Unknown error fetching medical supplies:', error)
          toast.error('Lỗi khi tải danh sách vật tư y tế.')
        }
      }
    }
    fetchMedicalSupplies()
  }, [])

  useEffect(() => {
    const fetchStudent = async () => {
      const trimmedStudentCode = studentCode.trim().toUpperCase()
      if (trimmedStudentCode) {
        try {
          const response = await getStudentByCode(trimmedStudentCode)
          const studentData = response.data
          setFoundStudent(studentData)
          form.setFieldsValue({ studentId: studentData.studentId })
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error searching for student:', error)
            toast.error(`Lỗi khi tìm học sinh: ${error.message}`)
          } else {
            console.error('Unknown error searching for student:', error)
            toast.error('Lỗi khi tìm học sinh.')
          }
          setFoundStudent(null)
          form.setFieldsValue({ studentId: null })
        }
      } else {
        setFoundStudent(null)
        form.setFieldsValue({ studentId: null })
      }
    }
    const handler = setTimeout(() => {
      fetchStudent()
    }, 1000) // Debounce search
    return () => clearTimeout(handler)
  }, [studentCode, form])

  const onFinish = async (values: {
    studentId: number
    type: string
    description: string
    note: string
    date: string
    medicationIds: number[]
    medicalSupplyIds: number[]
  }) => {
    if (!foundStudent) {
      return
    }
    try {
      setIsSubmitting(true)
      const data: CreateMedicalEventRequest = {
        studentId: values.studentId,
        type: values.type,
        description: values.description,
        note: values.note,
        date: values.date,
        medicationIds: values.medicationIds,
        medicalSupplyIds: values.medicalSupplyIds
      }
      await createMedicalEvent(data)
      toast.success('Tạo báo cáo sự kiện y tế thành công!')
      form.resetFields()
      setStudentCode('') // Reset student code
      setFoundStudent(null) // Reset found student
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Không thể tạo sự kiện y tế: ${error.message}`)
      } else {
        toast.error('Không thể tạo sự kiện y tế')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={4}>Tạo báo cáo sự kiện y tế</Title>
          </Col>
          <Col>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => form.submit()} loading={isSubmitting}>
              Tạo báo cáo
            </Button>
          </Col>
        </Row>

        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            date: dayjs()
          }}
        >
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Mã học sinh' rules={[{ required: true, message: 'Vui lòng nhập mã sinh sinh viên!' }]}>
                <Input
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value.trim().toUpperCase())}
                  placeholder='Nhập mã học sinh'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Tên học sinh'>
                <Input value={foundStudent?.fullname || ''} placeholder='Tên học sinh' readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='studentId' noStyle>
            <Input type='hidden' />
          </Form.Item>

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
            <Select
              mode='multiple'
              placeholder='Chọn thuốc'
              options={medicationOptions}
            />
          </Form.Item>

          <Form.Item
            name='medicalSupplyIds'
            label='Vật tư y tế sử dụng'
            rules={[{ required: true, message: 'Vui lòng chọn vật tư y tế!' }]}
          >
            <Select
              mode='multiple'
              placeholder='Chọn vật tư y tế'
              options={medicalSupplyOptions}
            />
          </Form.Item>
        </Form>
      </Space>
    </Card>
  )
}

export default CreateEvent
