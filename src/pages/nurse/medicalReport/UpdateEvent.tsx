import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Button, Modal, Typography, Space, Row, Col } from 'antd'
import dayjs from 'dayjs'
import {
  updateMedicalEvent,
  getMedicalEventById,
  MedicalEvent,
  CreateMedicalEventRequest
} from '../../../apis/medicalEvent'
import { getStudentByCode, getStudentById, Student } from '../../../apis/student'
import { getAllMedications, Medication } from '../../../apis/medication'
import medicalSupplyApi, { MedicalSupply } from '../../../apis/medicalSupply'
import { toast } from 'react-toastify'

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
  const [medicalSupplyOptions, setMedicalSupplyOptions] = useState<{ value: number; label: string }[]>([])
  const [selectedMedications, setSelectedMedications] = useState<{ medicationId: number; quantityUsed: number }[]>([])
  const [selectedMedicalSupplies, setSelectedMedicalSupplies] = useState<{ medicalSupplyId: number; quantityUsed: number }[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const medResponse = await getAllMedications()
        if (medResponse.data && medResponse.data.$values) {
          const options = medResponse.data.$values.map((med: Medication) => ({
            value: med.medicationId,
            label: med.name
          }))
          setMedicationOptions(options)
        }

        const supplyResponse = await medicalSupplyApi.getAll()
        if (supplyResponse.data && supplyResponse.data.$values) {
          const options = supplyResponse.data.$values.map((supply: MedicalSupply) => ({
            value: supply.medicalSupplyId,
            label: supply.name
          }))
          setMedicalSupplyOptions(options)
        }
      } catch (error: unknown) {
        console.error('Error fetching options:', error)
        toast.error('Lỗi khi tải danh sách thuốc hoặc vật tư y tế.')
      }
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (visible && eventId) {
        setLoading(true)
        try {
          const response = await getMedicalEventById(eventId)
          const eventData: MedicalEvent = response.data

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
            date: dayjs(eventData.date)
          })

          if (eventData.medications && eventData.medications.$values) {
            setSelectedMedications(
              eventData.medications.$values.map((med: { medicationId: number; quantityUsed?: number }) => ({
                medicationId: med.medicationId,
                quantityUsed: med.quantityUsed || 1
              }))
            )
          } else if (eventData.medicationIds && eventData.medicationIds.$values) {
            setSelectedMedications(
              eventData.medicationIds.$values.map((id: number) => ({ medicationId: id, quantityUsed: 1 }))
            )
          } else {
            setSelectedMedications([])
          }
          if (eventData.medicalSupplies && eventData.medicalSupplies.$values) {
            setSelectedMedicalSupplies(
              eventData.medicalSupplies.$values.map((sup: { medicalSupplyId: number; quantityUsed?: number }) => ({
                medicalSupplyId: sup.medicalSupplyId,
                quantityUsed: sup.quantityUsed || 1
              }))
            )
          } else if (eventData.medicalSupplyIds && eventData.medicalSupplyIds.$values) {
            setSelectedMedicalSupplies(
              eventData.medicalSupplyIds.$values.map((id: number) => ({ medicalSupplyId: id, quantityUsed: 1 }))
            )
          } else {
            setSelectedMedicalSupplies([])
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(`Không thể tải thông tin sự kiện`)
          } else {
            toast.error('Không thể tải thông tin sự kiện')
          }
          onCancel()
        } finally {
          setLoading(false)
        }
      }
    }
    fetchEventDetails()
  }, [visible, eventId, form, onCancel])

  useEffect(() => {
    const fetchStudentByCode = async () => {
      if (studentCode && foundStudent?.studentCode !== studentCode) {
        try {
          const response = await getStudentByCode(studentCode)
          const studentArr = response.data.$values
          const studentData = studentArr && studentArr.length > 0 ? studentArr[0] : null
          setFoundStudent(studentData)
          form.setFieldsValue({ studentId: studentData?.studentId })
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(`Lỗi khi tìm học sinh`)
          } else {
            toast.error('Lỗi khi tìm học sinh.')
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
    }, 500)
    return () => clearTimeout(handler)
  }, [studentCode, form, foundStudent])

  const onFinish = async (values: {
    studentId: number
    type: string
    description: string
    note: string
    date: string
  }) => {
    if (!foundStudent) {
      toast.error('Vui lòng nhập mã học sinh hợp lệ.')
      return
    }
    try {
      setLoading(true)
      const data: CreateMedicalEventRequest = {
        studentId: values.studentId,
        type: values.type,
        description: values.description,
        note: values.note,
        date: dayjs(values.date as unknown as string | number | Date | dayjs.Dayjs | null | undefined).toISOString(),
        medications: selectedMedications,
        medicalSupplies: selectedMedicalSupplies
      }
      await updateMedicalEvent(eventId, data)
      toast.success('Cập nhật sự kiện y tế thành công!')
      onSuccess()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Không thể cập nhật sự kiện y tế: ${error.message}`)
      } else {
        toast.error('Không thể cập nhật sự kiện y tế')
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
            <div style={{ marginTop: 8 }}>
              <b>Lớp:</b> {foundStudent.className}
            </div>
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
          {selectedMedications.map((item) => (
            <div key={item.medicationId} style={{ margin: '8px 0 0 0' }}>
              <span>{medicationOptions.find((opt) => opt.value === item.medicationId)?.label}:</span>
              <Input
                type='number'
                min={1}
                style={{ width: 100, marginLeft: 8 }}
                value={item.quantityUsed}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setSelectedMedications(
                    selectedMedications.map((m) =>
                      m.medicationId === item.medicationId ? { ...m, quantityUsed: val } : m
                    )
                  )
                }}
              />
            </div>
          ))}
        </Form.Item>

        <Form.Item label='Vật tư y tế sử dụng' required>
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
          {selectedMedicalSupplies.map((item) => (
            <div key={item.medicalSupplyId} style={{ margin: '8px 0 0 0' }}>
              <span>{medicalSupplyOptions.find((opt) => opt.value === item.medicalSupplyId)?.label}:</span>
              <Input
                type='number'
                min={1}
                style={{ width: 100, marginLeft: 8 }}
                value={item.quantityUsed}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setSelectedMedicalSupplies(
                    selectedMedicalSupplies.map((m) =>
                      m.medicalSupplyId === item.medicalSupplyId ? { ...m, quantityUsed: val } : m
                    )
                  )
                }}
              />
            </div>
          ))}
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
