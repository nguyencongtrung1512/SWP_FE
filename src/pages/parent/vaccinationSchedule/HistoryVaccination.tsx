import React, { useEffect, useState } from 'react'
import { Table, Card, Spin } from 'antd'
import { getRecordsByStudent, VaccinationRecord } from '../../../apis/vaccination'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ColumnsType } from 'antd/es/table'
dayjs.extend(utc)

interface HistoryVaccinationProps {
  studentId: number
}

const columns: ColumnsType<VaccinationRecord> = [
  { title: 'Chiến dịch', dataIndex: 'campaignName', key: 'campaignName' },
  {
    title: 'Ngày tiêm',
    dataIndex: 'dateInjected',
    key: 'dateInjected',
    render: (date: string) => (date ? dayjs.utc(date).local().format('DD/MM/YYYY HH:mm') : ''),
    sorter: (a, b) => dayjs(a.dateInjected).unix() - dayjs(b.dateInjected).unix(),
  },
  { title: 'Kết quả', dataIndex: 'result', key: 'result' },
  { title: 'Phản ứng ngay', dataIndex: 'immediateReaction', key: 'immediateReaction' },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    render: (note: string | null | undefined) =>
      note && note.trim() !== '' ? note : 'Không có'
  }
]

const HistoryVaccination: React.FC<HistoryVaccinationProps> = ({ studentId }) => {
  const [records, setRecords] = useState<VaccinationRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (studentId) {
      fetchRecords(studentId)
    }
  }, [studentId])

  const fetchRecords = async (studentId: number) => {
    try {
      const response = await getRecordsByStudent(studentId)
      if (response.data) 
        setRecords(response?.data?.$values|| [])
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

export default HistoryVaccination
