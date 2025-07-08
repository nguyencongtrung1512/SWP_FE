import { useState, useEffect } from 'react'
import { Card, Row, Col, Select, Space, Statistic, Spin } from 'antd'
import { LineChart, Line, XAxis, YAxis,CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpOutlined, MedicineBoxOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { getTrends } from "../../../apis/dashboard.api"
import { DashboardTrends } from '../../../apis/dashboard.api'

interface ChartData {
  date: string
  rawDate: string
  healthChecks: number
  medicalEvents: number
  consultations: number
  vaccinations: number
}

const DashBoardAdmin = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '3months' | '1year'>('7days')
  const [loading, setLoading] = useState<boolean>(true)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [stats, setStats] = useState({
    totalHealthChecks: 0,
    totalMedicalEvents: 0,
    totalConsultations: 0,
    totalVaccinations: 0
  })

  const transformDataForChart = (data: DashboardTrends): ChartData[] => {
    const dateMap = new Map<string, ChartData>()
    const allDates = new Set<string>()
    
    data.healthChecks?.$values?.forEach(item => allDates.add(item.date))
    data.medicalEvents?.$values?.forEach(item => allDates.add(item.date))
    data.consultations?.$values?.forEach(item => allDates.add(item.date))
    data.vaccinations?.$values?.forEach(item => allDates.add(item.date))
    
    allDates.forEach(date => {
      dateMap.set(date, {
        date: formatDate(date),
        rawDate: date,
        healthChecks: 0,
        medicalEvents: 0,
        consultations: 0,
        vaccinations: 0
      })
    })
    
    data.healthChecks?.$values?.forEach(item => {
      const existing = dateMap.get(item.date)
      if (existing) {
        existing.healthChecks = item.count
      }
    })
    
    data.medicalEvents?.$values?.forEach(item => {
      const existing = dateMap.get(item.date)
      if (existing) {
        existing.medicalEvents = item.count
      }
    })
    
    data.consultations?.$values?.forEach(item => {
      const existing = dateMap.get(item.date)
      if (existing) {
        existing.consultations = item.count
      }
    })
    
    data.vaccinations?.$values?.forEach(item => {
      const existing = dateMap.get(item.date)
      if (existing) {
        existing.vaccinations = item.count
      }
    })
    
    const sortedData = Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    )
    
    const getExpectedDays = (period: string) => {
      switch (period) {
        case '7days': return 7
        case '30days': return 30
        case '3months': return 90
        case '1year': return 365
        default: return 7
      }
    }
    
    const expectedDays = getExpectedDays(timeRange)
    
    if (sortedData.length > expectedDays) {
      return sortedData.slice(-expectedDays)
    }
    
    return sortedData
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    
    if (timeRange === '3months' || timeRange === '1year') {
      return date.toLocaleDateString('vi-VN', { 
        month: 'short', 
        year: '2-digit'
      })
    }
    
    return date.toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const calculateStats = (data: DashboardTrends) => {
    const totalHealthChecks = data.healthChecks?.$values?.reduce((sum, item) => sum + item.count, 0) || 0
    const totalMedicalEvents = data.medicalEvents?.$values?.reduce((sum, item) => sum + item.count, 0) || 0
    const totalConsultations = data.consultations?.$values?.reduce((sum, item) => sum + item.count, 0) || 0
    const totalVaccinations = data.vaccinations?.$values?.reduce((sum, item) => sum + item.count, 0) || 0
    
    setStats({
      totalHealthChecks,
      totalMedicalEvents,
      totalConsultations,
      totalVaccinations
    })
  }

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true)
      try {
        const response = await getTrends(timeRange)
        const data : DashboardTrends = response.data
        console.log('API Response:', data)
        console.log('Time Range:', timeRange)
        const transformedData = transformDataForChart(data)
        console.log('Transformed Data:', transformedData)
        
        const getExpectedDays = (period: string) => {
          switch (period) {
            case '7days': return 7
            case '30days': return 30
            case '3months': return 90
            case '1year': return 365
            default: return 7
          }
        }
        
        const expectedDays = getExpectedDays(timeRange)
        if (transformedData.length !== expectedDays) {
          console.warn(`Expected ${expectedDays} days for ${timeRange}, but got ${transformedData.length} days`)
        }
        
        setChartData(transformedData)
        calculateStats(data)
      } catch (error) {
        console.error("Error fetching trends data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrends()
  }, [timeRange])

  const pieChartData = [
    { name: 'Khám sức khỏe', value: stats.totalHealthChecks, color: '#1890ff' },
    { name: 'Sự kiện y tế', value: stats.totalMedicalEvents, color: '#ff4d4f' },
    { name: 'Tư vấn', value: stats.totalConsultations, color: '#52c41a' },
    { name: 'Tiêm chủng', value: stats.totalVaccinations, color: '#faad14' }
  ].filter(item => item.value > 0)

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Card>
          <Row gutter={16} align='middle'>
            <Col>
              <Select
                value={timeRange}
                style={{ width: 120 }}
                onChange={value => setTimeRange(value)}
                options={[
                  { value: '7days', label: '7 ngày' },
                  { value: '30days', label: '30 ngày' },
                  { value: '3months', label: '3 tháng' },
                  { value: '1year', label: '1 năm' }
                ]}
              />
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title='Tổng khám sức khỏe'
                value={stats.totalHealthChecks}
                valueStyle={{ color: '#1890ff' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Sự kiện y tế'
                value={stats.totalMedicalEvents}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<MedicineBoxOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Tư vấn'
                value={stats.totalConsultations}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title='Tiêm chủng'
                value={stats.totalVaccinations}
                valueStyle={{ color: '#faad14' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Card title='Thống kê theo thời gian'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis 
                    dataKey='date'
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type='monotone' 
                    dataKey='healthChecks' 
                    stroke='#1890ff' 
                    name='Khám sức khỏe' 
                    strokeWidth={2}
                  />
                  <Line 
                    type='monotone' 
                    dataKey='medicalEvents' 
                    stroke='#ff4d4f' 
                    name='Sự kiện y tế' 
                    strokeWidth={2}
                  />
                  <Line 
                    type='monotone' 
                    dataKey='consultations' 
                    stroke='#52c41a' 
                    name='Tư vấn' 
                    strokeWidth={2}
                  />
                  <Line 
                    type='monotone' 
                    dataKey='vaccinations' 
                    stroke='#faad14' 
                    name='Tiêm chủng' 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Phân bố hoạt động'>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  )
}

export default DashBoardAdmin