import React, { useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, TimePicker, message, Card, Typography, Space, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'

const { Title } = Typography
const { Option } = Select

interface Student {
  id: string
  name: string
  grade: string
  class: string
  parentName: string
  parentPhone: string
}

interface HealthRecord {
  key: string
  studentId: string
  studentName: string
  grade: string
  class: string
  reason: string
  result: string
  medication: string
  time: string
  note: string
}

interface FormValues {
  studentId: string
  reason: string
  result: string
  medication: string
  time: Dayjs
  note?: string
}

// Dữ liệu mẫu
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    grade: '1',
    class: '1A',
    parentName: 'Nguyễn Văn Bố',
    parentPhone: '0123456789'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    grade: '1',
    class: '1A',
    parentName: 'Trần Văn Mẹ',
    parentPhone: '0987654321'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    grade: '2',
    class: '2B',
    parentName: 'Lê Văn Cha',
    parentPhone: '0123456788'
  }
]

const mockRecords: HealthRecord[] = [
  {
    key: '1',
    studentId: '1',
    studentName: 'Nguyễn Văn A',
    grade: '1',
    class: '1A',
    reason: 'Tiêm phòng cúm',
    result: 'Không sốt',
    medication: 'Không',
    time: '10:15',
    note: 'Bình thường'
  }
]

function ResultsAfterVaccination() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [records, setRecords] = useState<HealthRecord[]>(mockRecords)
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')

  // Lấy danh sách khối lớp duy nhất
  const grades = Array.from(new Set(mockStudents.map(student => student.grade)))

  // Lấy danh sách lớp theo khối đã chọn
  const classes = Array.from(
    new Set(
      mockStudents
        .filter(student => student.grade === selectedGrade)
        .map(student => student.class)
    )
  )

  const columns: ColumnsType<HealthRecord> = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Khối',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class'
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result'
    },
    {
      title: 'Uống thuốc',
      dataIndex: 'medication',
      key: 'medication'
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note'
    }
  ]

  const handleAddRecord = (values: FormValues) => {
    const student = mockStudents.find(s => s.id === values.studentId)
    if (!student) return

    const newRecord: HealthRecord = {
      key: Date.now().toString(),
      studentId: values.studentId,
      studentName: student.name,
      grade: student.grade,
      class: student.class,
      reason: values.reason,
      result: values.result,
      medication: values.medication,
      time: values.time.format('HH:mm'),
      note: values.note || ''
    }

    setRecords([...records, newRecord])
    setIsModalVisible(false)
    form.resetFields()
    message.success('Đã thêm bản ghi mới')
  }

  // Lọc học sinh theo khối và lớp
  const filteredStudents = mockStudents.filter(student => {
    if (selectedGrade && student.grade !== selectedGrade) return false
    if (selectedClass && student.class !== selectedClass) return false
    return true
  })

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col>
              <Select
                placeholder='Chọn khối'
                style={{ width: 120 }}
                onChange={value => {
                  setSelectedGrade(value)
                  setSelectedClass('')
                }}
                value={selectedGrade || undefined}
              >
                {grades.map(grade => (
                  <Option key={grade} value={grade}>
                    Khối {grade}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                placeholder='Chọn lớp'
                style={{ width: 120 }}
                onChange={value => setSelectedClass(value)}
                value={selectedClass || undefined}
                disabled={!selectedGrade}
              >
                {classes.map(classItem => (
                  <Option key={classItem} value={classItem}>
                    Lớp {classItem}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row justify='space-between' align='middle'>
            <Col>
              <Title level={4}>Ghi nhận kết quả sau tiêm</Title>
            </Col>
            <Col>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Thêm bản ghi
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={records.filter(record => {
              if (selectedGrade && record.grade !== selectedGrade) return false
              if (selectedClass && record.class !== selectedClass) return false
              return true
            })}
          />

          <Modal title='Thêm bản ghi mới' open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
            <Form form={form} onFinish={handleAddRecord} layout='vertical'>
              <Form.Item name='studentId' label='Học sinh' rules={[{ required: true, message: 'Vui lòng chọn học sinh' }]}>
                <Select>
                  {filteredStudents.map(student => (
                    <Option key={student.id} value={student.id}>
                      {student.name} - Lớp {student.class}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name='reason' label='Lý do' rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                <Input />
              </Form.Item>

              <Form.Item name='result' label='Kết quả' rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name='medication'
                label='Uống thuốc'
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái uống thuốc' }]}
              >
                <Select>
                  <Option value='Có'>Có</Option>
                  <Option value='Không'>Không</Option>
                </Select>
              </Form.Item>

              <Form.Item name='time' label='Thời gian' rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
                <TimePicker format='HH:mm' />
              </Form.Item>

              <Form.Item name='note' label='Ghi chú'>
                <Input.TextArea />
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </Card>
    </div>
  )
}

export default ResultsAfterVaccination
