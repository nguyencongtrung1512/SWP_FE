import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
  Space,
  InputNumber,
  DatePicker
} from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { getRecordsByNurse, type HealthCheckRecord, updateHealthCheck } from '../../../apis/healthCheck.api'
import { getAllStudents } from '../../../apis/student.api'
import { type Class, getAllClasses } from '../../../apis/class.api'

const { Option } = Select

interface FormValues {
  result: string
  height: number
  weight: number
  leftEye: number
  rightEye: number
  healthCheckDescription: string
}

interface FullHealthCheckRecord extends HealthCheckRecord {
  healthCheckDescription:string
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
  const [records, setRecords] = useState<FullHealthCheckRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<FullHealthCheckRecord[]>([])
  const [recordId, setRecordId] = useState<number | null>(null)
  const [nurseId, setNurseId] = useState<number | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('1')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [healthCheckDescriptionFilter, setHealthCheckDescriptionFilter] = useState<string>('') // New state for description filter
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchClasses(), fetchStudents(), fetchAllRecords()])
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
      const defaultClass = classes.find((cls) => cls.className.startsWith(selectedGrade))
      if (defaultClass) {
        setSelectedClass(defaultClass)
      }
    }
  }, [classes, selectedClass, selectedGrade])

  useEffect(() => {
    let filtered = records
    if (selectedClass) {
      filtered = filtered.filter((record) => record.classId === selectedClass.classId)
    } else if (selectedGrade) {
      filtered = filtered.filter((record) => record.className && record.className.startsWith(selectedGrade))
    }
    if (selectedDate) {
      filtered = filtered.filter((record) => {
        const recordDate = dayjs(record.date).format('YYYY-MM-DD')
        return recordDate === selectedDate
      })
    }
    // Apply healthCheckDescription filter
    if (healthCheckDescriptionFilter) {
      filtered = filtered.filter(
        (record) =>
          record.healthCheckDescription &&
          record.healthCheckDescription.toLowerCase().includes(healthCheckDescriptionFilter.toLowerCase())
      )
    }
    setFilteredRecords(filtered)
  }, [selectedGrade, selectedClass, records, selectedDate, healthCheckDescriptionFilter]) // Add healthCheckDescriptionFilter to dependencies

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
      console.log(res.data)
      if (res.data) {
        const healthCheckRecords = res.data.$values
        const recordsWithNames = healthCheckRecords.map((record: HealthCheckRecord) => {
          const student = students.find((s) => s.studentId === record.studentID)
          const studentClass = student ? classes.find((c) => c.classId === student.classId) : null
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
    return classes.filter((cls) => cls.className.startsWith(selectedGrade))
  }

  const checkIfCompleted = (record: FullHealthCheckRecord) => {
    return (
      record.result &&
      record.height != null &&
      record.weight != null &&
      record.leftEye != null &&
      record.rightEye != null
    )
  }

  // Hàm xuất Excel cho toàn bộ danh sách
  const exportToExcel = () => {
    try {
      const dataToExport = filteredRecords.map((record, index) => ({
        STT: index + 1,
        'Học sinh': record.studentName || 'Unknown Student',
        Lớp: record.className || 'Unknown Class',
        'Thời gian': record.date ? dayjs(record.date).format('DD/MM/YYYY HH:mm') : '',
        'Kết quả': record.result || 'Chưa cập nhật',
        'Chiều cao (cm)': record.height != null ? record.height : 'Chưa cập nhật',
        'Cân nặng (kg)': record.weight != null ? record.weight : 'Chưa cập nhật',
        'Mắt trái': record.leftEye != null && record.leftEye !== '' ? `${record.leftEye}/10` : 'Chưa cập nhật',
        'Mắt phải': record.rightEye != null && record.rightEye !== '' ? `${record.rightEye}/10` : 'Chưa cập nhật',
        'Sự kiện': record.healthCheckDescription || 'Chưa cập nhật', // Added description
        'Trạng thái': checkIfCompleted(record) ? 'Hoàn thành' : 'Chưa hoàn thành'
      }))
      const ws = XLSX.utils.json_to_sheet(dataToExport)
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Học sinh
        { wch: 10 }, // Lớp
        { wch: 18 }, // Thời gian
        { wch: 15 }, // Kết quả
        { wch: 12 }, // Chiều cao
        { wch: 12 }, // Cân nặng
        { wch: 12 }, // Mắt trái
        { wch: 12 }, // Mắt phải
        { wch: 25 }, // Mô tả khám
        { wch: 15 } // Trạng thái
      ]
      ws['!cols'] = colWidths
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả khám sức khỏe')
      // Tạo tên file với thời gian hiện tại
      const fileName = `ket-qua-kham-suc-khoe-${dayjs().format('DD-MM-YYYY-HH-mm')}.xlsx`
      XLSX.writeFile(wb, fileName)
      message.success('Xuất file Excel thành công!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      message.error('Xuất file Excel thất bại!')
    }
  }

  const columns: ColumnsType<FullHealthCheckRecord> = [
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
      render: (date) => (date ? dayjs(new Date(date)).format('DD/MM/YYYY HH:mm') : '')
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
      render: (height: number) => (height != null ? `${height} cm` : 'Chưa cập nhật'),
      align: 'center' as const
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => (weight != null ? `${weight} kg` : 'Chưa cập nhật'),
      align: 'center' as const
    },
    {
      title: 'Mắt trái',
      dataIndex: 'leftEye',
      key: 'leftEye',
      render: (value: number | string) => (value != null && value !== '' ? `${value}/10` : 'Chưa cập nhật'),
      align: 'center' as const
    },
    {
      title: 'Mắt phải',
      dataIndex: 'rightEye',
      key: 'rightEye',
      render: (value: number | string) => (value != null && value !== '' ? `${value}/10` : 'Chưa cập nhật'),
      align: 'center' as const
    },
    {
      title: 'Sự kiện', // New column for healthCheckDescription
      dataIndex: 'healthCheckDescription',
      key: 'healthCheckDescription',
      render: (value: string) => value ?? 'Chưa cập nhật'
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

  const openAddModal = (record: FullHealthCheckRecord) => {
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
      rightEye: values.rightEye
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
        <Space direction='vertical' style={{ width: '100%' }} size='large'></Space>
        <Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
          <Col>
            <Button
              size='large'
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              disabled={filteredRecords.length === 0}
            >
              Xuất Excel
            </Button>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder='Chọn khối'
                style={{ width: 120 }}
                onChange={handleGradeChange}
                value={selectedGrade || undefined}
                allowClear
              >
                {grades.map((grade) => (
                  <Option key={grade.value} value={grade.value}>
                    {grade.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder='Chọn lớp'
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
              <DatePicker
                placeholder='Ngày diễn ra'
                format='DD/MM/YYYY'
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(date) => {
                  setSelectedDate(date ? date.format('YYYY-MM-DD') : null)
                }}
                allowClear
              />
              <Input
                placeholder='Mô tả khám sức khỏe'
                style={{ width: 200 }}
                value={healthCheckDescriptionFilter}
                onChange={(e) => setHealthCheckDescriptionFilter(e.target.value)}
                allowClear
              />
            </Space>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredRecords}
          pagination={false}
          loading={loading}
          rowKey='healthCheckID'
        />
        <Modal
          title={`Thêm bản ghi cho học sinh ${currentRecord?.studentName || ''}`}
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
              <Input placeholder='Nhập kết quả' />
            </Form.Item>
            <Form.Item
              name='height'
              label={<span className='flex items-center space-x-2'>Chiều cao (cm)</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập chiều cao!' },
                { type: 'number', min: 110, max: 160, message: 'Chiều cao phải từ 110-160cm!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Chiều cao phải là số dương!' }
              ]}
            >
              <InputNumber placeholder='Nhập chiều cao' style={{ width: '100%' }} step={1} precision={1} />
            </Form.Item>
            <Form.Item
              name='weight'
              label={<span className='flex items-center space-x-2'>Cân nặng (kg)</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập cân nặng!' },
                { type: 'number', min: 20, max: 70, message: 'Cân nặng phải từ 20-70kg!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Cân nặng phải là số dương!' }
              ]}
            >
              <InputNumber placeholder='Nhập cân nặng' style={{ width: '100%' }} step={1} precision={1} />
            </Form.Item>
            <Form.Item
              name='leftEye'
              label={<span className='flex items-center space-x-2'>Mắt trái (trên thang điểm 10 - VD: 10/10)</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin cho mắt trái!' },
                { type: 'number', min: 0, max: 10, message: 'Thị lực đo được phải từ 0-10!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Thị lực đo được phải là số dương!' }
              ]}
            >
              <InputNumber placeholder='Nhập mắt trái' style={{ width: '100%' }} step={1} precision={1} />
            </Form.Item>
            <Form.Item
              name='rightEye'
              label={<span className='flex items-center space-x-2'>Mắt phải (trên thang điểm 10 - VD: 10/10)</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin cho mắt phải!' },
                { type: 'number', min: 0, max: 10, message: 'Thị lực đo được phải từ 0-10!' },
                { pattern: /^\d+(\.\d+)?$/, message: 'Thị lực đo được phải là số dương!' }
              ]}
            >
              <InputNumber placeholder='Nhập mắt phải' style={{ width: '100%' }} step={1} precision={1} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Lưu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default ResultsAfterHealthCheck
