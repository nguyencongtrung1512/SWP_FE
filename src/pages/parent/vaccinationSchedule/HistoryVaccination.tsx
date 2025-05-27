import React from 'react'
import { Card, Timeline, Tag, Typography } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface VaccinationRecord {
  id: string
  year: string
  date: string
  vaccineName: string
  status: 'completed' | 'scheduled'
  location: string
  notes?: string
}

const mockHistoryData: VaccinationRecord[] = [
  {
    id: '1',
    year: '2024',
    date: '15/03/2024',
    vaccineName: 'Vaccine 5 trong 1',
    status: 'completed',
    location: 'Trung tâm Y tế Quận 1',
    notes: 'Không có phản ứng phụ'
  },
  {
    id: '2',
    year: '2024',
    date: '20/04/2024',
    vaccineName: 'Vaccine 6 trong 1',
    status: 'scheduled',
    location: 'Trung tâm Y tế Quận 1'
  },
  {
    id: '3',
    year: '2023',
    date: '10/12/2023',
    vaccineName: 'Vaccine Sởi - Quai bị - Rubella',
    status: 'completed',
    location: 'Trung tâm Y tế Quận 1',
    notes: 'Sốt nhẹ 1 ngày'
  },
  {
    id: '4',
    year: '2023',
    date: '05/09/2023',
    vaccineName: 'Vaccine Viêm não Nhật Bản',
    status: 'completed',
    location: 'Trung tâm Y tế Quận 1'
  }
]

const HistoryVaccination: React.FC = () => {
  const groupedByYear = mockHistoryData.reduce((acc, record) => {
    if (!acc[record.year]) {
      acc[record.year] = []
    }
    acc[record.year].push(record)
    return acc
  }, {} as Record<string, VaccinationRecord[]>)

  return (
    <div className='space-y-6'>
      {Object.entries(groupedByYear).map(([year, records]) => (
        <Card key={year} className='bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'>
          <Title level={4} className='mb-4'>
            Năm {year}
          </Title>
          <Timeline
            items={records.map((record) => ({
              color: record.status === 'completed' ? 'green' : 'blue',
              children: (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Text strong>{record.vaccineName}</Text>
                    <Tag color={record.status === 'completed' ? 'green' : 'blue'} icon={record.status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                      {record.status === 'completed' ? 'Đã tiêm' : 'Đã lên lịch'}
                    </Tag>
                  </div>
                  <div className='text-gray-600'>
                    <div>Ngày: {record.date}</div>
                    <div>Địa điểm: {record.location}</div>
                    {record.notes && <div>Ghi chú: {record.notes}</div>}
                  </div>
                </div>
              )
            }))}
          />
        </Card>
      ))}
    </div>
  )
}

export default HistoryVaccination
