import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Card, Row, Col, Space, InputNumber } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getRecordsByNurse, HealthCheckRecord, updateHealthCheck } from '../../../apis/healthCheck'
import { getAllStudents } from '../../../apis/student'
import { Class, getAllClasses } from '../../../apis/class'

const { Option } = Select

interface FormValues {
  result: string
  height: number
  weight: number
  leftEye: number
  rightEye: number
}

interface EnrichedHealthCheckRecord extends HealthCheckRecord {
  studentName?: string
  classId?: number
  className?: string
}

const grades = [
  { value: '1', label: 'Khối 1' },
  { value: '2', label: 'Khối 2' },
  { value: '3', label: 'Khối 3' },
  { value: '4', label: 'Khối 4' },
  { value: '5', label: 'Khối 5' }
]

function ResultsAfterHealthCheck() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [records, setRecords] = useState<EnrichedHealthCheckRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<EnrichedHealthCheckRecord[]>([])
  const [recordId, setRecordId] = useState<number | null>(null)
  const [nurseId, setNurseId] = useState<number | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('1')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchClasses(),
          fetchStudents(),
          fetchAllRecords()
        ])
      } finally {
        setLoading(false)
      }
    }
    init()
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setNurseId(user.accountID)
    }
  }, [])
  
  useEffect(() => {
    if (classes.length > 0 && !selectedClass && selectedGrade) {
      const defaultClass = classes.find(cls => 
        cls.className.startsWith(selectedGrade)
      )
      if (defaultClass) {
        setSelectedClass(defaultClass)
      }
    }
  }, [classes, selectedClass, selectedGrade])

  useEffect(() => {
    let filtered = records
    if (selectedClass) {
      filtered = records.filter(record => record.classId === selectedClass.classId)
    } else if (selectedGrade) {
      filtered = records.filter(record => 
        record.className && record.className.startsWith(selectedGrade)
      )
    }
    
    setFilteredRecords(filtered)
  }, [selectedGrade, selectedClass, records])

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses()
      setClasses(response.data.$values)
    } catch (error) {
      console.error('Error fetching classes:', error)
      message.error('Không tải được danh sách lớp!')
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents()
      setStudents(response.data.$values)
    } catch (error) {
      console.error('Error fetching students:', error)
      message.error('Không tải được danh sách học sinh!')
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setNurseId(user.accountID)
    }
  }, [])

  const fetchAllRecords = async () => {
    try {
      const res = await getRecordsByNurse(nurseId || 0)
      if (res.data) {
        const healthCheckRecords = res.data.$values
        
        const recordsWithNames = healthCheckRecords.map((record: HealthCheckRecord) => {
          const student = students.find(s => s.studentId === record.studentID)
          const studentClass = student ? classes.find(c => c.classId === student.classId) : null
          
          return {
            ...record,
            studentName: student?.fullname || '',
            classId: student?.classId,
            className: studentClass?.className || ''
          }
        })
        setRecords(recordsWithNames)
      }
    } catch (error) {
      console.error(error)
      message.error('Không tải được danh sách chiến dịch!')
    }
  }

  useEffect(() => {
    if (students.length > 0 && classes.length > 0) {
      fetchAllRecords()
    }
  }, [students, classes])

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value)
    setSelectedClass(null)
  }

  const getFilteredClasses = () => {
    if (!selectedGrade) return classes
    return classes.filter(cls => cls.className.startsWith(selectedGrade))
  }

  const checkIfCompleted = (record: EnrichedHealthCheckRecord) => {
    return record.result && record.height != null && record.weight != null && record.leftEye != null && record.rightEye != null
  }

  const columns: ColumnsType<EnrichedHealthCheckRecord> = [
    { 
      title: 'Học sinh', 
      dataIndex: 'studentName', 
      key: 'studentName',
      render: (text) => text || 'Unknown Student'
    },
    { 
      title: 'Lớp', 
      dataIndex: 'className', 
      key: 'className',
      render: (text) => text || 'Unknown Class'
    },
    { 
      title: 'Thời gian', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => date ? dayjs(new Date(date)).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (value: string) => value ?? 'Chưa cập nhật',
      align: 'center' as const
    },
    {
      title: 'Chiều cao',
      dataIndex: 'height',
      key: 'height',
      render: (height: number) =>
        height != null ? `${height} cm` : 'Chưa cập nhật',
      align: 'center' as const
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) =>
        weight != null ? `${weight} kg` : 'Chưa cập nhật',
      align: 'center' as const
    },
    {
      title: 'Mắt trái',
      dataIndex: 'leftEye',
      key: 'leftEye',
      render: (value: number | string) =>
        value != null && value !== '' ? `${value}/10` : 'Chưa cập nhật',
      align: 'center' as const
    },
    {
      title: 'Mắt phải',
      dataIndex: 'rightEye',
      key: 'rightEye',
      render: (value: number | string) =>
        value != null && value !== '' ? `${value}/10` : 'Chưa cập nhật',
      align: 'center' as const
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        if (checkIfCompleted(record)) {
          return <span style={{ color: 'green', fontWeight: 600 }}>Hoàn Thành</span>
        }
        return (
          <Button type='link' onClick={() => openAddModal(record)}>
            Thêm bản ghi
          </Button>
        )
      }
    }
  ]

  const openAddModal = (record: EnrichedHealthCheckRecord) => {
    setRecordId(record.healthCheckID)
    setIsModalVisible(true)
  }

  const currentRecord = records.find((r) => r.healthCheckID === recordId)

  const handleAddRecord = async (values: FormValues) => {
    if (recordId === null || nurseId === null) {
      message.error('Thiếu thông tin cần thiết để gửi lên server!')
      return
    }

    const payload = {
      result: values.result,
      height: values.height,
      weight: values.weight,
      leftEye: values.leftEye,
      rightEye: values.rightEye,
    }

    try {
      await updateHealthCheck(payload, recordId)
      message.success('Đã lưu bản ghi thành công!')
      form.resetFields()
      setIsModalVisible(false)
      setRecordId(null)
      fetchAllRecords()
    } catch (err) {
      console.error('Lỗi khi lưu bản ghi:', err)
      message.error('Lưu bản ghi thất bại!')
    }
  }

  return (
    <div>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }} size="large">

        </Space>
        <Row justify='end' align='middle' style={{ marginBottom: 16 }}>
          <Col>
            <Select
              placeholder='Chọn khối'
              style={{ width: 120 }}
              onChange={handleGradeChange}
              value={selectedGrade || undefined}
              allowClear
            >
              {grades.map(grade => (
                <Option key={grade.value} value={grade.value}>
                  {grade.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col className='ml-3'>
            <Select
              placeholder="Chọn lớp"
              style={{ width: 150 }}
              onChange={(value) => {
                const found = classes.find((cls) => cls.classId === value)
                setSelectedClass(found || null)
              }}
              value={selectedClass?.classId}
              disabled={!selectedGrade}
              allowClear
            >
              {getFilteredClasses().map((cls) => (
                <Option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredRecords} 
          pagination={false} 
          loading={loading}
          rowKey="healthCheckID"
        />

        <Modal
          title={`Thêm bản ghi cho ${currentRecord?.studentName || 'học sinh'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            setRecordId(null)
            form.resetFields()
          }}
          footer={null}
        >
          <Form form={form} onFinish={handleAddRecord} layout='vertical'>
            <Form.Item name='result' label='Kết quả' rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name='height'
              label={
                <span className='flex items-center space-x-2'>
                  Chiều cao (cm)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập chiều cao!' },
                { type: 'number', min: 110, max: 160, message: 'Chiều cao phải từ 110-160cm!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Chiều cao phải là số!' }
              ]}
            >
              <InputNumber
                placeholder='Nhập chiều cao'
                style={{ width: '100%' }}
                step={1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              name='weight'
              label={
                <span className='flex items-center space-x-2'>
                  Cân nặng (kg)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập cân nặng!' },
                { type: 'number', min: 20, max: 70, message: 'Cân nặng phải từ 20-70kg!' }
              ]}
            >
              <InputNumber
                placeholder='Nhập cân nặng'
                style={{ width: '100%' }}
                step={1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              name='leftEye'
              label={
                <span className='flex items-center space-x-2'>
                  Mắt trái (trên thang điểm 10 - VD: 10/10)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin cho mắt trái!' },
                { type: 'number', min: 0, max: 10, message: 'Thị lực đo được phải từ 0-10!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Thị lực đo được phải là số!' }
              ]}
            >
              <InputNumber
                placeholder='Nhập mắt trái'
                style={{ width: '100%' }}
                step={1}
                precision={1}
              />
            </Form.Item>

            <Form.Item
              name='rightEye'
              label={
                <span className='flex items-center space-x-2'>
                  Mắt phải (trên thang điểm 10 - VD: 10/10)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin cho mắt phải!' },
                { type: 'number', min: 0, max: 10, message: 'Thị lực đo được phải từ 0-10!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Thị lực đo được phải là số!' }
              ]}
            >
              <InputNumber
                placeholder='Nhập mắt phải'
                style={{ width: '100%' }}
                step={1}
                precision={1}
              />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default ResultsAfterHealthCheck