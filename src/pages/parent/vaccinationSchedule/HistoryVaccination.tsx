import React, { useEffect, useState } from 'react'
import { Table, Card, Select, message, Spin } from 'antd'
import { getRecordsByStudent } from '../../../apis/vaccination'

const { Option } = Select

interface VaccinationRecord {
  recordId: number
  campaignName: string
  dateInjected: string
  result: string
  immediateReaction: string
  note: string
}

interface Child {
  studentId: number
  studentName: string
}

interface HistoryVaccinationProps {
  childrenList: Child[]
}

const columns = [
  { title: 'Chiến dịch', dataIndex: 'campaignName', key: 'campaignName' },
  {
    title: 'Ngày tiêm',
    dataIndex: 'dateInjected',
    key: 'dateInjected',
    render: (date: string) => (date ? new Date(date).toLocaleString('vi-VN') : '')
  },
  { title: 'Kết quả', dataIndex: 'result', key: 'result' },
  { title: 'Phản ứng ngay', dataIndex: 'immediateReaction', key: 'immediateReaction' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' }
]

const HistoryVaccination: React.FC<HistoryVaccinationProps> = ({ childrenList }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>(childrenList[0]?.studentId)
  const [records, setRecords] = useState<VaccinationRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedStudentId) return
    setLoading(true)
    getRecordsByStudent(selectedStudentId)
      .then((res) => setRecords(res.data))
      .catch(() => message.error('Không lấy được lịch sử tiêm!'))
      .finally(() => setLoading(false))
  }, [selectedStudentId])

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>Chọn học sinh:</span>
        <Select style={{ width: 220 }} value={selectedStudentId} onChange={setSelectedStudentId}>
          {childrenList.map((child) => (
            <Option key={child.studentId} value={child.studentId}>
              {child.studentName}
            </Option>
          ))}
        </Select>
      </div>
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
