import React, { useEffect, useState } from 'react'
import { Table, Card, Spin } from 'antd'
import { getRecordsByStudent, HealthCheckRecord } from '../../../apis/healthCheck'
import dayjs from 'dayjs'

interface HistoryHealthCheckProps {
  studentId: number
}

import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<HealthCheckRecord> = [
  {
    title: 'Y tá phụ trách',
    dataIndex: 'nurseID',
    key: 'nurseID'
  },
  {
    title: 'Ngày khám',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) =>
      date ? dayjs(date).format('DD/MM/YYYY HH:mm') : ''
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    key: 'result',
    align: 'center' as const
  },
  {
    title: 'Chiều cao',
    dataIndex: 'height',
    key: 'height',
    render: (height: number) => (height != null ? `${height} cm` : ''),
    align: 'center' as const
  },
  {
    title: 'Cân nặng',
    dataIndex: 'weight',
    key: 'weight',
    render: (weight: number) => (weight != null ? `${weight} kg` : ''),
    align: 'center' as const
  },
  {
    title: 'Mắt trái',
    dataIndex: 'leftEye',
    key: 'leftEye',
    render: (value: number | string) => (value != null ? `${value}/10` : ''),
    align: 'center' as const
  },
  {
    title: 'Mắt phải',
    dataIndex: 'rightEye',
    key: 'rightEye',
    render: (value: number | string) => (value != null ? `${value}/10` : ''),
    align: 'center' as const
  }
]


const HistoryHealthCheck: React.FC<HistoryHealthCheckProps> = ({ studentId }) => {
  const [records, setRecords] = useState<HealthCheckRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (studentId) {
      fetchRecords(studentId)
    }
  }, [studentId])

  const fetchRecords = async (studentId: number) => {
    try {
      const response = await getRecordsByStudent(studentId)
      if (response.data) {
        const allRecords = response?.data?.$values || []

        const filtered = allRecords.filter((record) =>
          record.result?.trim() ||
          record.height != null ||
          record.weight != null ||
          record.leftEye?.toString().trim() ||
          record.rightEye?.toString().trim()
        )

        setRecords(filtered)
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={Array.isArray(records) ? records : []}
          rowKey='recordId'
          pagination={false}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Spin>
    </Card>
  )
}

export default HistoryHealthCheck
