import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Table,
  Typography,
  Space,
  Statistic,
  Progress,
  Tag
} from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ArrowUpOutlined, ArrowDownOutlined, MedicineBoxOutlined } from '@ant-design/icons'

const { Title } = Typography
const { RangePicker } = DatePicker

interface MedicalEvent {
  id: string
  date: string
  type: 'fever' | 'accident' | 'allergy' | 'medicine'
  studentName: string
  class: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

const DashBoardNurse: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Mock data - sau này sẽ lấy từ API
  const medicalEvents: MedicalEvent[] = [
    {
      id: '1',
      date: '2024-03-20',
      type: 'fever',
      studentName: 'Nguyễn Văn A',
      class: '5A',
      description: 'Sốt cao 39 độ',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-03-19',
      type: 'accident',
      studentName: 'Trần Thị B',
      class: '3B',
      description: 'Té ngã trong giờ ra chơi',
      status: 'in_progress'
    }
  ]

  // Dữ liệu cho biểu đồ đường
  const lineChartData = [
    { name: 'T2', fever: 4, accident: 2, allergy: 1, medicine: 5 },
    { name: 'T3', fever: 3, accident: 1, allergy: 2, medicine: 4 },
    { name: 'T4', fever: 5, accident: 3, allergy: 1, medicine: 6 },
    { name: 'T5', fever: 2, accident: 1, allergy: 3, medicine: 3 },
    { name: 'T6', fever: 4, accident: 2, allergy: 2, medicine: 5 }
  ]

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = [
    { name: 'Sốt', value: 18 },
    { name: 'Tai nạn', value: 9 },
    { name: 'Dị ứng', value: 9 },
    { name: 'Uống thuốc', value: 23 }
  ]

  const COLORS = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff']

  // Thống kê tổng quan
  const stats = {
    totalEvents: medicalEvents.length,
    feverCount: medicalEvents.filter(e => e.type === 'fever').length,
    accidentCount: medicalEvents.filter(e => e.type === 'accident').length,
    allergyCount: medicalEvents.filter(e => e.type === 'allergy').length,
    medicineCount: medicalEvents.filter(e => e.type === 'medicine').length
  }

  // Cột cho bảng báo cáo
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const types = {
          fever: { color: 'red', text: 'Sốt' },
          accident: { color: 'orange', text: 'Tai nạn' },
          allergy: { color: 'green', text: 'Dị ứng' },
          medicine: { color: 'blue', text: 'Uống thuốc' }
        }
        const { color, text } = types[type as keyof typeof types]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: MedicalEvent) => (
        <div>
          {text}
          <br />
          <small>Lớp {record.class}</small>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statuses = {
          pending: { color: 'blue', text: 'Chờ xử lý' },
          in_progress: { color: 'orange', text: 'Đang xử lý' },
          completed: { color: 'green', text: 'Đã hoàn thành' }
        }
        const { color, text } = statuses[status as keyof typeof statuses]
        return <Tag color={color}>{text}</Tag>
      }
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Bộ lọc */}
        <Card>
          <Row gutter={16} align='middle'>
            <Col>
              <Select
                defaultValue='week'
                style={{ width: 120 }}
                onChange={value => setTimeRange(value)}
                options={[
                  { value: 'day', label: 'Theo ngày' },
                  { value: 'week', label: 'Theo tuần' },
                  { value: 'month', label: 'Theo tháng' }
                ]}
              />
            </Col>
            <Col>
              <Select
                defaultValue='all'
                style={{ width: 120 }}
                onChange={value => setSelectedClass(value)}
                options={[
                  { value: 'all', label: 'Tất cả lớp' },
                  { value: '5A', label: 'Lớp 5A' },
                  { value: '3B', label: 'Lớp 3B' }
                ]}
              />
            </Col>
            <Col>
              <Select
                defaultValue='all'
                style={{ width: 120 }}
                onChange={value => setSelectedType(value)}
                options={[
                  { value: 'all', label: 'Tất cả loại' },
                  { value: 'fever', label: 'Sốt' },
                  { value: 'accident', label: 'Tai nạn' },
                  { value: 'allergy', label: 'Dị ứng' },
                  { value: 'medicine', label: 'Uống thuốc' }
                ]}
              />
            </Col>
            <Col>
              <RangePicker />
            </Col>
          </Row>
        </Card>

        {/* Thống kê tổng quan */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title='Tổng số sự kiện'
                value={stats.totalEvents}
                prefix={<MedicineBoxOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Số học sinh sốt'
                value={stats.feverCount}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Số tai nạn'
                value={stats.accidentCount}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Số lượt uống thuốc'
                value={stats.medicineCount}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ */}
        <Row gutter={16}>
          <Col span={16}>
            <Card title='Thống kê theo thời gian'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='fever' stroke='#ff4d4f' name='Sốt' />
                  <Line type='monotone' dataKey='accident' stroke='#faad14' name='Tai nạn' />
                  <Line type='monotone' dataKey='allergy' stroke='#52c41a' name='Dị ứng' />
                  <Line type='monotone' dataKey='medicine' stroke='#1890ff' name='Uống thuốc' />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Phân bố loại sự kiện'>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Bảng báo cáo */}
        <Card title='Báo cáo chi tiết'>
          <Table
            columns={columns}
            dataSource={medicalEvents}
            rowKey='id'
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Space>
    </div>
  )
}

export default DashBoardNurse

