import { useState, useEffect } from 'react'
import { Table, Tag, Button, Space, Modal, Tabs, Typography, Select, Row, Col, Card } from 'antd'
import type { TabsProps } from 'antd'
import { getAllClasses } from '../../../apis/class'
import { getAllHealthRecords } from '../../../apis/healthRecord'
import { getStudentById } from '../../../apis/student'
import { Class } from '../../../apis/class'

const { Title, Text } = Typography
const { Option } = Select

interface HealthRecord {
  key: string
  name: string
  class: string
  dob: string
  gender: string
  studentId: string
  studentCode: string
  status: string
  height?: number
  weight?: number
  bmi?: number
  nutritionStatus?: string
  note?: string
  classId: number
  allergies?: string[]
  medicalHistory?: string[]
  vaccinationHistory?: {
    date: string
    vaccine: string
    notes: string
  }[]
  parentNotes?: string
}

const grades = [
  { value: '1', label: 'Khối 1' },
  { value: '2', label: 'Khối 2' },
  { value: '3', label: 'Khối 3' },
  { value: '4', label: 'Khối 4' },
  { value: '5', label: 'Khối 5' }
]

const HealthRecordCensorship: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string>('1')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredData, setFilteredData] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      await fetchClasses()
      await fetchAllHealthRecords()
    }
    init()
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
    if (selectedClass) {
      const filtered = records.filter(record => record.classId === selectedClass.classId)
      setFilteredData(filtered)
    } else if (selectedGrade) {
      const filtered = records.filter(record => record.class.startsWith(selectedGrade))
      setFilteredData(filtered)
    } else {
      setFilteredData(records)
    }
  }, [selectedGrade, selectedClass, records])

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses()
      setClasses(response.data.$values)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchAllHealthRecords = async () => {
    try {
      setLoading(true)
      const response = await getAllHealthRecords()
      const healthRecordsData = response.data.$values

      const transformedRecords: HealthRecord[] = []

      for (let i = 0; i < healthRecordsData.length; i++) {
        const record = healthRecordsData[i]
        try {
          const studentResponse = await getStudentById(record.studentId)
          const student = studentResponse.data
          const studentClass = classes.find(cls => cls.classId === student.classId)

          transformedRecords.push({
            key: record.healthRecordId?.toString() || i.toString(),
            name: record.studentName || student.fullname,
            class: studentClass?.className || 'Unknown',
            dob: new Date(record.dateOfBirth || student.dateOfBirth).toLocaleDateString('vi-VN'),
            gender: record.gender === 'Male' ? 'Nam' : 'Nữ',
            studentId: record.studentId.toString(),
            studentCode: record.studentCode || student.studentCode,
            height: record.height,
            weight: record.weight,
            bmi: record.bmi,
            nutritionStatus: record.nutritionStatus,
            note: record.note,
            classId: student.classId || 0,
            status: 'Active',
            allergies: [],
            medicalHistory: [],
            vaccinationHistory: [],
            parentNotes: record.note
          })
        } catch (error) {
          console.error(`Failed to fetch student ${record.studentId}`, error)
        }
      }
      
      transformedRecords.sort((a, b) => a.classId - b.classId)
      setRecords(transformedRecords)
      setFilteredData(transformedRecords)
    } catch (error) {
      console.error('Error fetching health records:', error)
    } finally {
      setLoading(false)
    }
  }

  const showModal = (record: HealthRecord) => {
    setSelectedRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedRecord(null)
  }

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value)
    setSelectedClass(null)
  }

  const getFilteredClasses = () => {
    if (!selectedGrade) return classes
    return classes.filter(cls => cls.className.startsWith(selectedGrade))
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin sức khỏe',
      children: (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Text strong>Chiều cao:</Text>
              <Text className='ml-2'>{selectedRecord?.height ? `${selectedRecord.height} cm` : 'Chưa có thông tin'}</Text>
            </div>
            <div>
              <Text strong>Cân nặng:</Text>
              <Text className='ml-2'>{selectedRecord?.weight ? `${selectedRecord.weight} kg` : 'Chưa có thông tin'}</Text>
            </div>
            <div>
              <Text strong>BMI:</Text>
              <Text className='ml-2'>{selectedRecord?.bmi ? selectedRecord.bmi.toFixed(2) : 'Chưa có thông tin'}</Text>
            </div>
            <div>
              <Text strong>Tình trạng dinh dưỡng:</Text>
              <Text className='ml-2'>
                {selectedRecord?.nutritionStatus ? (
                  <Tag color={
                    selectedRecord.nutritionStatus === 'Normal' ? 'green' : 
                    selectedRecord.nutritionStatus === 'Underweight' ? 'orange' : 'red'
                  }>
                    {selectedRecord.nutritionStatus === 'Underweight' ? 'Thiếu cân' : 
                     selectedRecord.nutritionStatus === 'Normal' ? 'Bình thường' :
                     selectedRecord.nutritionStatus === 'Overweight' ? 'Thừa cân' : 
                     selectedRecord.nutritionStatus}
                  </Tag>
                ) : 'Chưa có thông tin'}
              </Text>
            </div>
          </div>
          <div>
            <Text strong>Ghi chú: </Text>
            <Text>{selectedRecord?.note}</Text>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: 'Lịch sử tiêm',
      children: (
        <div className='space-y-4 text-center'>
          {selectedRecord?.vaccinationHistory && selectedRecord.vaccinationHistory.length > 0 ? (
            <Table
              dataSource={selectedRecord.vaccinationHistory}
              columns={[
                {
                  title: 'Ngày tiêm',
                  dataIndex: 'date',
                  key: 'date'
                },
                {
                  title: 'Vaccine',
                  dataIndex: 'vaccine',
                  key: 'vaccine'
                },
                {
                  title: 'Ghi chú',
                  dataIndex: 'notes',
                  key: 'notes'
                }
              ]}
              pagination={false}
            />
          ) : (
            <Text type='secondary'>Chưa có lịch sử tiêm</Text>
          )}
        </div>
      )
    }
  ]

  const columns = [
    {
      title: 'Họ tên học sinh',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: HealthRecord, b: HealthRecord) => a.name.localeCompare(b.name)
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Mã số học sinh',
      dataIndex: 'studentCode',
      key: 'studentCode'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HealthRecord) => (
        <Space>
          <Button type='link' onClick={() => showModal(record)}>
            Xem chi tiết
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card>
        <Space direction='vertical' style={{ width: '100%' }} size="large">
          <Row gutter={16}>
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
            <Col>
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

          <Title level={4}>Hồ sơ sức khỏe lớp {selectedClass?.className} ({filteredData.length} học sinh)</Title>
          
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            pagination={{ pageSize: 10 }} 
            loading={loading}
            scroll={{ x: 800 }}
          />
        </Space>
      </Card>

      <Modal
        title='Chi tiết hồ sơ sức khỏe'
        open={isModalOpen}
        onCancel={handleCancel}
        closable={false}
        width={800}
        footer={[
          <Button key='close' onClick={handleCancel}>
            Đóng
          </Button>
        ]}
      >
        {selectedRecord && <Tabs defaultActiveKey='1' items={items} />}
      </Modal>
    </div>
  )
}

export default HealthRecordCensorship