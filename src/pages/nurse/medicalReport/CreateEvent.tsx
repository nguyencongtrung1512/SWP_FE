import type React from 'react'
import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
  InputNumber,
  Divider,
  Tag,
  Alert,
  Descriptions
} from 'antd'
import {
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { createMedicalEvent } from '../../../apis/medicalEvent.api'
import { getAllStudents, type Student } from '../../../apis/student.api'
import { getAllMedications, type Medication } from '../../../apis/medication.api'
import medicalSupplyApi, { type MedicalSupply } from '../../../apis/medicalSupply.api'
import { toast } from 'react-toastify'

const { Text } = Typography
const { TextArea } = Input

interface CreateEventProps {
  onSuccess?: () => void
}

const CreateEvent: React.FC<CreateEventProps> = ({ onSuccess }) => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [foundStudent, setFoundStudent] = useState<Student | null>(null)
  const [medicationOptions, setMedicationOptions] = useState<
    { value: number; label: string; type: string; quantity: number }[]
  >([])
  const [medicalSupplyOptions, setMedicalSupplyOptions] = useState<
    { value: number; label: string; type: string; quantity: number }[]
  >([])
  const [selectedMedications, setSelectedMedications] = useState<{ medicationId: number; quantityUsed: number }[]>([])
  const [selectedMedicalSupplies, setSelectedMedicalSupplies] = useState<
    { medicalSupplyId: number; quantityUsed: number }[]
  >([])

  console.log('Da chon', selectedMedicalSupplies)

  // Check if form can be submitted based on quantities
  const canSubmit = () => {
    // Check medications
    for (const selectedMed of selectedMedications) {
      const medication = medicationOptions.find((opt) => opt.value === selectedMed.medicationId)
      if (!medication || medication.quantity === 0) {
        return false
      }
    }

    // Check medical supplies
    for (const selectedSupply of selectedMedicalSupplies) {
      const supply = medicalSupplyOptions.find((opt) => opt.value === selectedSupply.medicalSupplyId)
      if (!supply || supply.quantity === 0) {
        return false
      }
    }

    return true
  }

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
            type: med.type,
            quantity: med.quantity
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
            value: supply.medicalSupplyId,
            label: supply.name,
            type: supply.type,
            quantity: supply.quantity
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
        }
      } catch {
        toast.error('Lỗi khi tải danh sách học sinh!')
      }
    }

    fetchStudents()
  }, [])

  const onFinish = async (values: Record<string, unknown>) => {
    if (!foundStudent) return

    // Validate quantities before submission
    if (!canSubmit()) {
      toast.error('Không thể tạo báo cáo vì có thuốc hoặc vật tư y tế đã hết hàng!')
      return
    }

    try {
      setIsSubmitting(true)

      const data = {
        studentId: foundStudent.studentId,
        studentCode: String(values.studentCode),
        type: String(values.type),
        description: String(values.description),
        note: values.note ? String(values.note) : 'Không có ghi chú',
        date: dayjs(values.date as unknown as string | number | Date | dayjs.Dayjs | null | undefined).format(
          'YYYY-MM-DDTHH:mm:ss'
        ),
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
        toast.error(`Không thể tạo sự kiện y tế hãy kiểm tra lại form gửi thuốc`)
      } else {
        console.error('Lỗi không xác định:', error)
        toast.error('Không thể tạo sự kiện y tế')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            initialValues={{
              date: dayjs()
            }}
          >
            {/* Thông tin cơ bản */}
            <Card
              title={
                <Space>
                  <InfoCircleOutlined />
                  <span>Thông tin cơ bản</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size='small'
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='date'
                    label={
                      <Space>
                        <CalendarOutlined />
                        <span>Thời gian sự kiện</span>
                      </Space>
                    }
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                  >
                    <DatePicker
                      placeholder='Chọn thời gian xảy ra sự kiện'
                      showTime
                      format='DD/MM/YYYY HH:mm'
                      style={{ width: '100%' }}
                      size='large'
                      disabledDate={(current) => {
                        const today = dayjs().startOf('day')
                        const twoWeeksAgo = today.subtract(7, 'day')
                        return current && (current < twoWeeksAgo || current > today)
                      }}
                      disabledTime={() => ({
                        disabledHours: () =>
                          Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < 7 || hour > 17),
                        disabledMinutes: () => [],
                        disabledSeconds: () => []
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='type'
                    label='Loại sự kiện'
                    rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
                  >
                    <Select
                      options={[
                        { value: 'Sốt', label: '🌡️ Sốt' },
                        { value: 'Tai nạn', label: '⚠️ Tai nạn' },
                        { value: 'Dịch bệnh', label: '🦠 Dịch bệnh' },
                        { value: 'Khác', label: '📋 Khác' }
                      ]}
                      placeholder='Chọn loại sự kiện'
                      size='large'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Thông tin học sinh */}
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Thông tin học sinh</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size='small'
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='studentCode'
                    label='Mã học sinh'
                    rules={[{ required: true, message: 'Vui lòng nhập mã học sinh!' }]}
                  >
                    <Input
                      placeholder='Nhập mã học sinh'
                      size='large'
                      prefix={<UserOutlined />}
                      onChange={(e) => {
                        const code = e.target.value.trim().toLowerCase()
                        const stu = allStudents.find((s) => s.studentCode.toLowerCase() === code)
                        setFoundStudent(stu || null)
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  {foundStudent ? (
                    <Alert
                      message='Thông tin học sinh'
                      description={
                        <Descriptions size='small' column={1}>
                          <Descriptions.Item label='Tên'>{foundStudent.fullname}</Descriptions.Item>
                          <Descriptions.Item label='Lớp'>
                            <Tag color='blue'>{foundStudent.className}</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label='Giới tính'>
                            <Tag color={foundStudent.gender === 'Male' ? 'cyan' : 'pink'}>
                              {foundStudent.gender === 'Male'
                                ? 'Nam'
                                : foundStudent.gender === 'Female'
                                  ? 'Nữ'
                                  : foundStudent.gender}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label='Ngày sinh'>
                            {foundStudent.dateOfBirth ? dayjs(foundStudent.dateOfBirth).format('DD/MM/YYYY') : ''}
                          </Descriptions.Item>
                          <Descriptions.Item label='Phụ huynh'>{foundStudent.parentName}</Descriptions.Item>
                        </Descriptions>
                      }
                      type='success'
                      showIcon
                    />
                  ) : (
                    <Alert
                      message='Chưa tìm thấy học sinh'
                      description='Vui lòng nhập mã học sinh để hiển thị thông tin'
                      type='info'
                      showIcon
                    />
                  )}
                </Col>
              </Row>
            </Card>

            {/* Mô tả sự kiện */}
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Mô tả sự kiện</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size='small'
            >
              <Row gutter={[24, 16]}>
                <Col span={24}>
                  <Form.Item
                    name='description'
                    label='Mô tả chi tiết'
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                  >
                    <TextArea rows={4} placeholder='Nhập mô tả chi tiết về sự kiện...' showCount maxLength={500} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name='note' label='Ghi chú thêm'>
                    <TextArea rows={3} placeholder='Nhập ghi chú thêm nếu cần...' showCount maxLength={300} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Thuốc và vật tư y tế */}
            <Card
              title={
                <Space>
                  <MedicineBoxOutlined />
                  <span>Thuốc và vật tư y tế sử dụng</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
              size='small'
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Form.Item label='Thuốc sử dụng'>
                    <Select
                      mode='multiple'
                      showSearch
                      optionFilterProp='label'
                      placeholder='Chọn thuốc đã sử dụng'
                      options={medicationOptions.map((option) => ({
                        ...option,
                        disabled: option.quantity === 0,
                        label: `${option.label} ${option.quantity === 0 ? '(Hết hàng)' : `(Còn: ${option.quantity})`}`
                      }))}
                      value={selectedMedications.map((m) => m.medicationId)}
                      size='large'
                      onChange={(ids: number[]) => {
                        // Filter out medications with 0 quantity
                        const validIds = ids.filter((id) => {
                          const medication = medicationOptions.find((opt) => opt.value === id)
                          return medication && medication.quantity > 0
                        })

                        setSelectedMedications(
                          validIds.map((id) => {
                            const exist = selectedMedications.find((m) => m.medicationId === id)
                            return exist || { medicationId: id, quantityUsed: 1 }
                          })
                        )
                      }}
                    />
                    <div style={{ marginTop: 16 }}>
                      {selectedMedications.map((item) => {
                        const medication = medicationOptions.find((opt) => opt.value === item.medicationId)
                        const unitName = medication ? getMedicationUnit(medication.type) : 'đơn vị'
                        const isOutOfStock = medication && medication.quantity === 0

                        return (
                          <Card
                            key={item.medicationId}
                            size='small'
                            style={{
                              marginBottom: 8,
                              backgroundColor: isOutOfStock ? '#fff2f0' : undefined,
                              borderColor: isOutOfStock ? '#ffccc7' : undefined
                            }}
                          >
                            <Row align='middle' justify='space-between'>
                              <Col>
                                <Text strong style={{ color: isOutOfStock ? '#ff4d4f' : undefined }}>
                                  {medication?.label}
                                </Text>
                                {medication && (
                                  <div style={{ color: isOutOfStock ? '#ff4d4f' : '#888', fontSize: 12 }}>
                                    {isOutOfStock
                                      ? 'Hết hàng!'
                                      : `Số lượng còn lại: ${medication.quantity} ${unitName}`}
                                  </div>
                                )}
                              </Col>
                              <Col>
                                <Space>
                                  <Text>Số lượng ({unitName}):</Text>
                                  <InputNumber
                                    min={1}
                                    max={medication?.quantity ?? 10}
                                    value={item.quantityUsed}
                                    disabled={isOutOfStock}
                                    onChange={(val) => {
                                      setSelectedMedications(
                                        selectedMedications.map((m) =>
                                          m.medicationId === item.medicationId
                                            ? { ...m, quantityUsed: typeof val === 'number' && !isNaN(val) ? val : 1 }
                                            : m
                                        )
                                      )
                                    }}
                                  />
                                </Space>
                              </Col>
                            </Row>
                          </Card>
                        )
                      })}
                    </div>
                  </Form.Item>
                </Col>

                <Col xs={24} lg={12}>
                  <Form.Item
                    label='Vật tư y tế sử dụng'
                    rules={[{ required: true, message: 'Vui lòng chọn vật tư y tế đã sử dụng!' }]}
                  >
                    <Select
                      mode='multiple'
                      showSearch
                      optionFilterProp='label'
                      placeholder='Chọn vật tư y tế đã sử dụng'
                      options={medicalSupplyOptions.map((option) => ({
                        ...option,
                        disabled: option.quantity === 0,
                        label: `${option.label} ${option.quantity === 0 ? '(Hết hàng)' : `(Còn: ${option.quantity})`}`
                      }))}
                      value={selectedMedicalSupplies.map((m) => m.medicalSupplyId)}
                      size='large'
                      onChange={(ids: number[]) => {
                        // Filter out supplies with 0 quantity
                        const validIds = ids.filter((id) => {
                          const supply = medicalSupplyOptions.find((opt) => opt.value === id)
                          return supply && supply.quantity > 0
                        })

                        setSelectedMedicalSupplies(
                          validIds.map((id) => {
                            const exist = selectedMedicalSupplies.find((m) => m.medicalSupplyId === id)
                            return exist || { medicalSupplyId: id, quantityUsed: 1 }
                          })
                        )
                      }}
                    />
                    <div style={{ marginTop: 16 }}>
                      {selectedMedicalSupplies.map((item) => {
                        const supply = medicalSupplyOptions.find((opt) => opt.value === item.medicalSupplyId)
                        const unitName = supply ? getMedicalSupplyUnit(supply.type, supply.label) : 'đơn vị'
                        const isOutOfStock = supply && supply.quantity === 0

                        return (
                          <Card
                            key={item.medicalSupplyId}
                            size='small'
                            style={{
                              marginBottom: 8,
                              backgroundColor: isOutOfStock ? '#fff2f0' : undefined,
                              borderColor: isOutOfStock ? '#ffccc7' : undefined
                            }}
                          >
                            <Row align='middle' justify='space-between'>
                              <Col>
                                <Text strong style={{ color: isOutOfStock ? '#ff4d4f' : undefined }}>
                                  {supply?.label}
                                </Text>
                                {supply && (
                                  <div style={{ color: isOutOfStock ? '#ff4d4f' : '#888', fontSize: 12 }}>
                                    {isOutOfStock ? 'Hết hàng!' : `Số lượng còn lại: ${supply.quantity} ${unitName}`}
                                  </div>
                                )}
                              </Col>
                              <Col>
                                <Space>
                                  <Text>Số lượng ({unitName}):</Text>
                                  <InputNumber
                                    min={1}
                                    max={supply?.quantity ?? 50}
                                    value={item.quantityUsed}
                                    disabled={isOutOfStock}
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
                                </Space>
                              </Col>
                            </Row>
                          </Card>
                        )
                      })}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Show warning if any selected items are out of stock */}
            {!canSubmit() && (selectedMedications.length > 0 || selectedMedicalSupplies.length > 0) && (
              <Alert
                message='Cảnh báo'
                description='Có thuốc hoặc vật tư y tế đã hết hàng. Vui lòng bỏ chọn các mục đã hết hàng để có thể tạo báo cáo.'
                type='warning'
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <Divider />

            <Row justify='center'>
              <Col>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => form.submit()}
                  loading={isSubmitting}
                  disabled={!canSubmit() || !foundStudent}
                  size='large'
                  style={{
                    height: 48,
                    paddingLeft: 32,
                    paddingRight: 32,
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  {isSubmitting ? 'Đang tạo báo cáo...' : 'Tạo báo cáo sự kiện y tế'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Space>
    </div>
  )
}

export default CreateEvent
