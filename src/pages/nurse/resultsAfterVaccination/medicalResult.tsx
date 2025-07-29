import React, { useState } from 'react'
import { Typography, Tabs, Card, Row, Col } from 'antd'
import type { TabsProps } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ResultsAfterVaccination from './ResultsAfterVaccination'
import ResultsAfterHealthCheck from './ResultAfterHealthCheck'
import { FormOutlined } from '@ant-design/icons'
dayjs.extend(utc)

const { Title } = Typography

const MedicalResult: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1' | '2'>('1')

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tiêm chủng',
      children: <ResultsAfterVaccination />
    },
    {
      key: '2',
      label: 'Khám sức khỏe',
      children: <ResultsAfterHealthCheck />
    }
  ]

  const handleTabChange = (key: string) => {
    setActiveTab(key as '1' | '2')
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Card style={{ background: 'linear-gradient(135deg, #06b6d4 100%)' }}>
        <Row justify='space-between' align='middle'>
          <Col>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              <FormOutlined style={{ marginRight: 12 }} />
              Ghi nhận kết quả y tế
            </Title>
          </Col>
        </Row>
      </Card>
      <Tabs activeKey={activeTab} items={items} onChange={handleTabChange} />
    </div>
  )
}

export default MedicalResult
