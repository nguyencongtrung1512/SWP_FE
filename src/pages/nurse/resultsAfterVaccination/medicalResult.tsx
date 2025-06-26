import React, { useState } from 'react'
import { Typography, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ResultsAfterVaccination from './ResultsAfterVaccination'
import ResultsAfterHealthCheck from './ResultAfterHealthCheck'
dayjs.extend(utc)

const { Title } = Typography

const MedicalResult: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1' | '2'>('1')

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tiêm chủng',
      children: (
        <ResultsAfterVaccination />
      )
    },
    {
      key: '2',
      label: 'Khám sức khỏe',
      children: (
        <ResultsAfterHealthCheck />
      )
    }
  ]

  const handleTabChange = (key: string) => {
    setActiveTab(key as '1' | '2')
  }

  return (
    <div>
      <Title level={3}>Ghi nhận kết quả y tế</Title>
      <Tabs activeKey={activeTab} items={items} onChange={handleTabChange}/>
    </div>
  )
}

export default MedicalResult
