import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Button, Card, Typography, Space, Row, Col, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { createMedicalEvent } from '../../../apis/medicalEvent'
import { getAllStudents, Student } from '../../../apis/student'
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
  const [studentOptions, setStudentOptions] = useState<{ value: number; label: string }[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [foundStudent, setFoundStudent] = useState<Student | null>(null)
  const [medicationOptions, setMedicationOptions] = useState<{ value: number; label: string; type: string }[]>([])
  const [medicalSupplyOptions, setMedicalSupplyOptions] = useState<{ value: number; label: string; type: string }[]>([])
  const [selectedMedications, setSelectedMedications] = useState<{ medicationId: number; quantityUsed: number }[]>([])
  const [selectedMedicalSupplies, setSelectedMedicalSupplies] = useState<{ medicalSupplyId: number; quantityUsed: number }[]>([])
  
  const getMedicationUnit = (type: string): string => {
    const typeUpper = type.toUpperCase()
    switch (typeUpper) {
      case 'TABLET':
        return 'viên'
      case 'CAPSULE':
        return 'viên'
      case 'SYRUP':
        return 'lọ'
      case 'CREAM':
        return 'tuýp'
      case 'OINTMENT':
        return 'tuýp'
      case 'SOLUTION':
        return 'lọ'
      case 'INJECTION':
        return 'ống'
      case 'EYE DROPS':
        return 'lọ'
      case 'POWDER':
        return 'gói'
      default:
        return 'đơn vị'
    }
  }

  const getMedicalSupplyUnit = (type: string, name: string): string => {
    const typeUpper = type.toUpperCase()
    const nameUpper = name.toUpperCase()
    
    if (typeUpper === 'VẬT TƯ TIÊU HAO') {
      if (nameUpper.includes('BÔNG Y TẾ')) {
        return 'gói'
      }
      return 'chiếc'
    }
    
    switch (typeUpper) {
      case 'THIẾT BỊ ĐO':
        return 'thiết bị'
      case 'THIẾT BỊ HỖ TRỢ':
        return 'thiết bị'
      case 'BỘ DỤNG CỤ':
        return 'bộ'
      case 'DỤNG CỤ':
        return 'chiếc'
      default:
        return 'đơn vị'
    }
  }

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await getAllMedications()
        if (response.data && response.data.$values) {
          const options = response.data.$values.map((med: Medication) => ({
            value: med.medicationId,
            label: med.name,
            type: med.type
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
            type: supply.type
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

    const fetchStudents = async () => {
      try {
        const response = await getAllStudents()
        if (response.data && response.data.$values) {
          setAllStudents(response.data.$values)
          setStudentOptions(response.data.$values.map((stu: Student) => ({ value: stu.studentId, label: stu.fullname })))
        }
      } catch {
        toast.error('Lỗi khi tải danh sách học sinh!')
      }
    }
    fetchStudents()
  }, [])

  const onFinish = async (values: Record<string, unknown>) => {
    if (!foundStudent) return
    try {
      setIsSubmitting(true)
      const data = {
        studentId: Number(values.studentId),
        type: String(values.type),
        description: String(values.description),
        note: values.note ? String(values.note) : 'Không có ghi chú',
        date: dayjs(values.date as unknown as string | number | Date | dayjs.Dayjs | null | undefined).toISOString(),
        medications: selectedMedications,
        medicalSupplies: selectedMedicalSupplies
      }
      console.log('Data gửi lên:', data)
      await createMedicalEvent(data)
      toast.success('Tạo báo cáo sự kiện y tế thành công!')
      form.resetFields()
      setFoundStudent(null)
      setSelectedMedications([])
      setSelectedMedicalSupplies([])
      onSuccess?.()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Lỗi tạo sự kiện y tế:', error)
        const err = error as unknown
        if (typeof err === 'object' && err && 'response' in err) {
          const res = (err as { response?: { status?: unknown; data?: unknown } }).response
          if (res) {
            console.error('Status:', res.status)
            console.error('Data:', res.data)
          }
        }
        toast.error(`Không thể tạo sự kiện y tế: ${error.message}`)
      } else {
        console.error('Lỗi không xác định:', error)
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
                <DatePicker
                  placeholder='Chọn thời gian xảy ra sự kiện'
                  showTime
                  format='DD/MM/YYYY HH:mm'
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    const today = dayjs().startOf('day')
                    const twoWeeksAgo = today.subtract(7, 'day')
                    return (
                      current && (current < twoWeeksAgo || current > today)
                    )
                  }}
                  disabledTime={() => ({
                    disabledHours: () =>
                      Array.from({ length: 24 }, (_, i) => i).filter(
                        (hour) => hour < 7 || hour > 17
                      ),
                    disabledMinutes: () => [],
                    disabledSeconds: () => [],
                  })}
                />
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
                  placeholder='Chọn loại sự kiện'
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Tên học sinh' rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}>
                <Select
                  showSearch
                  placeholder='Tìm kiếm tên học sinh'
                  options={studentOptions}
                  filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false}
                  onChange={(studentId) => {
                    const stu = allStudents.find(s => s.studentId === studentId)
                    setFoundStudent(stu || null)
                    form.setFieldsValue({ studentId })
                  }}
                  value={foundStudent?.studentId}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {foundStudent && (
                <div style={{ marginTop: 8 }}>
                  <div>
                    <b>Lớp:</b> {foundStudent.className}
                  </div>
                  <div>
                    <b>Mã học sinh:</b>{' '} {foundStudent.studentCode}
                  </div>
                  <div>
                    <b>Giới tính:</b>{' '}
                    {foundStudent.gender === 'Male'
                      ? 'Nam'
                      : foundStudent.gender === 'Female'
                        ? 'Nữ'
                        : foundStudent.gender}
                  </div>
                  <div>
                    <b>Ngày sinh:</b>{' '}
                    {foundStudent.dateOfBirth ? dayjs(foundStudent.dateOfBirth).format('DD/MM/YYYY') : ''}
                  </div>
                  <div>
                    <b>Phụ Huynh:</b> {foundStudent.parentName}
                  </div>
                </div>
              )}
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

          <Form.Item label='Thuốc sử dụng' required>
            <Select
              mode='multiple'
              placeholder='Chọn thuốc'
              options={medicationOptions}
              value={selectedMedications.map((m) => m.medicationId)}
              onChange={(ids: number[]) => {
                setSelectedMedications(
                  ids.map((id) => {
                    const exist = selectedMedications.find((m) => m.medicationId === id)
                    return exist || { medicationId: id, quantityUsed: 1 }
                  })
                )
              }}
            />
            {selectedMedications.map((item) => {
              const medication = medicationOptions.find((opt) => opt.value === item.medicationId)
              const unitName = medication ? getMedicationUnit(medication.type) : 'đơn vị'
              
              return (
                <div key={item.medicationId} style={{ margin: '8px 0 0 0' }}>
                  <span>{medication?.label}:</span>
                  <span style={{ marginLeft: 8 }}>Số lượng ({unitName}):</span>
                  <InputNumber
                    placeholder='Nhập số lượng'
                    min={1}
                    max={10}
                    style={{ width: 100, marginLeft: 8 }}
                    value={item.quantityUsed}
                    onChange={(val) => {
                      setSelectedMedications(
                        selectedMedications.map((m) =>
                          m.medicationId === item.medicationId ? { ...m, quantityUsed: typeof val === 'number' && !isNaN(val) ? val : 1 } : m
                        )
                      )
                    }}
                  />
                </div>
              )
            })}
          </Form.Item>

          <Form.Item 
            required
            label='Vật tư y tế sử dụng'
            rules={[{ required: true, message: 'Vui lòng chọn vật tư y tế đã sử dụng!' }]}
          >
            <Select
              mode='multiple'
              placeholder='Chọn vật tư y tế'
              options={medicalSupplyOptions}
              value={selectedMedicalSupplies.map((m) => m.medicalSupplyId)}
              onChange={(ids: number[]) => {
                setSelectedMedicalSupplies(
                  ids.map((id) => {
                    const exist = selectedMedicalSupplies.find((m) => m.medicalSupplyId === id)
                    return exist || { medicalSupplyId: id, quantityUsed: 1 }
                  })
                )
              }}
            />
            {selectedMedicalSupplies.map((item) => {
              const supply = medicalSupplyOptions.find((opt) => opt.value === item.medicalSupplyId)
              const unitName = supply ? getMedicalSupplyUnit(supply.type, supply.label) : 'đơn vị'
              
              return (
                <div key={item.medicalSupplyId} style={{ margin: '8px 0 0 0' }}>
                  <span>{supply?.label}:</span>
                  <span style={{ marginLeft: 8 }}>Số lượng ({unitName}):</span>
                  <InputNumber
                    placeholder='Nhập số lượng'
                    min={1}
                    max={50}
                    style={{ width: 100, marginLeft: 8 }}
                    value={item.quantityUsed}
                    onChange={(val) => {
                      setSelectedMedicalSupplies(
                        selectedMedicalSupplies.map((m) =>
                          m.medicalSupplyId === item.medicalSupplyId
                            ? { ...m, quantityUsed: typeof val === 'number' && !isNaN(val) ? val : 1 }
                            : m
                        )
                      )
                    }}
                  />
                </div>
              )
            })}
          </Form.Item>
        </Form>
      </Space>
      <Row justify='space-between' align='middle'>
        <Col>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => form.submit()} loading={isSubmitting}>
            Tạo báo cáo
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CreateEvent