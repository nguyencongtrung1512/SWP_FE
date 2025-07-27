import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Card, Row, Col, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import * as XLSX from 'xlsx'
import {
  createVaccinationRecord,
  getConsentsByCampaign,
  getAllVaccinationCampaigns,
  VaccinationCampaign,
  getVaccinationRecordsByCampaign
} from '../../../apis/vaccinatapi.api'

dayjs.extend(utc)

const { Option } = Select

interface HealthRecord {
  key: string
  consentId: number
  studentId: number
  studentName: string
  result: string
  immediateReaction: string
  medication: string
  time: string
  note: string
  recordId?: number
  isCompleted?: boolean
}

interface FormValues {
  result: string
  immediateReaction: string
  medication: string
  time: Dayjs
  note?: string
}

function ResultsAfterVaccination() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [selectedConsent, setSelectedConsent] = useState<HealthRecord | null>(null)
  const [campaignId, setCampaignId] = useState<number | null>(null)
  const [campaigns, setCampaigns] = useState<VaccinationCampaign[]>([])
  const [nurseId, setNurseId] = useState<number | null>(null)

  useEffect(() => {
    fetchAllCampaigns()
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setNurseId(user.accountID)
    }
  }, [])

  useEffect(() => {
    if (campaignId !== null) {
      fetchConsents(campaignId)
    }
  }, [campaignId])

  const fetchAllCampaigns = async () => {
    try {
      const res = await getAllVaccinationCampaigns()
      setCampaigns(res.data.$values || [])
    } catch (error) {
      console.error(error)
      message.error('Không tải được danh sách chiến dịch!')
    }
  }

  const fetchConsents = async (campaignId: number) => {
    try {
      const [consentsRes, recordsRes] = await Promise.all([
        getConsentsByCampaign(campaignId),
        getVaccinationRecordsByCampaign(campaignId)
      ])
      const agreed = consentsRes.data.$values.filter((item) => item.isAgreed === true)
      const recordsMap = new Map<number, any>()
      recordsRes.data.$values.forEach((r) => {
        recordsMap.set(r.studentId, r)
      })

      const mapped = agreed.map((item) => {
        const record = recordsMap.get(item.studentId)
        return {
          key: item.consentId.toString(),
          consentId: item.consentId,
          studentId: item.studentId,
          studentName: item.studentName,
          result: record?.result || 'Chưa cập nhật',
          immediateReaction: record?.immediateReaction || 'Chưa cập nhật',
          medication: record?.medication || 'Chưa cập nhật',
          time: record?.dateInjected,
          note: record?.note || 'Chưa cập nhật',
          recordId: record?.recordId,
          isCompleted: !!record
        }
      })
      setRecords(mapped)
    } catch (err) {
      console.error(err)
      message.error('Lấy danh sách thất bại!')
    }
  }

  // Hàm xuất Excel cho toàn bộ danh sách
  const exportToExcel = () => {
    try {
      if (records.length === 0) {
        message.warning('Không có dữ liệu để xuất!')
        return
      }

      const currentCampaign = campaigns.find((c) => c.campaignId === campaignId)
      const campaignName = currentCampaign?.name || 'Không xác định'

      const dataToExport = records.map((record, index) => ({
        STT: index + 1,
        'Học sinh': record.studentName,
        'Kết quả': record.result,
        'Phản ứng với Vắc-Xin': record.immediateReaction,
        'Thời gian tiêm': record.time ? dayjs.utc(record.time).local().format('DD/MM/YYYY HH:mm') : 'Chưa cập nhật',
        'Ghi chú': record.note && record.note.trim() ? record.note : 'Không có',
        'Trạng thái': record.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'
      }))

      const ws = XLSX.utils.json_to_sheet(dataToExport)

      // Điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Học sinh
        { wch: 15 }, // Kết quả
        { wch: 20 }, // Phản ứng với Vắc-Xin
        { wch: 18 }, // Thời gian tiêm
        { wch: 25 }, // Ghi chú
        { wch: 15 } // Trạng thái
      ]
      ws['!cols'] = colWidths

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả sau tiêm vắc-xin')

      // Tạo tên file với tên chiến dịch và thời gian hiện tại
      const campaignNameForFile = campaignName.replace(/\s+/g, '-').replace(/[^\w\-]/g, '')
      const fileName = `ket-qua-tiem-vac-xin-${campaignNameForFile}-${dayjs().format('DD-MM-YYYY-HH-mm')}.xlsx`
      XLSX.writeFile(wb, fileName)

      message.success('Xuất file Excel thành công!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      message.error('Xuất file Excel thất bại!')
    }
  }

  // Hàm xuất Excel cho một học sinh cụ thể (dùng trong modal)
  // const exportSingleRecordToExcel = (record: HealthRecord) => {
  //   try {
  //     const currentCampaign = campaigns.find((c) => c.campaignId === campaignId)
  //     const campaignName = currentCampaign?.name || 'Không xác định'

  //     const dataToExport = [
  //       {
  //         'Chiến dịch tiêm chủng': campaignName,
  //         'Học sinh': record.studentName,
  //         'Kết quả tiêm chủng': record.result,
  //         'Phản ứng với Vắc-Xin': record.immediateReaction,
  //         'Thời gian tiêm': record.time ? dayjs.utc(record.time).local().format('DD/MM/YYYY HH:mm') : 'Chưa cập nhật',
  //         'Ghi chú': record.note && record.note.trim() ? record.note : 'Không có',
  //         'Trạng thái hồ sơ': record.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành',
  //         'Ngày xuất báo cáo': dayjs().format('DD/MM/YYYY HH:mm')
  //       }
  //     ]

  //     const ws = XLSX.utils.json_to_sheet(dataToExport)

  //     // Điều chỉnh độ rộng cột
  //     const colWidths = [
  //       { wch: 25 }, // Chiến dịch tiêm chủng
  //       { wch: 20 }, // Học sinh
  //       { wch: 18 }, // Kết quả tiêm chủng
  //       { wch: 22 }, // Phản ứng với Vắc-Xin
  //       { wch: 18 }, // Thời gian tiêm
  //       { wch: 30 }, // Ghi chú
  //       { wch: 18 }, // Trạng thái hồ sơ
  //       { wch: 18 } // Ngày xuất báo cáo
  //     ]
  //     ws['!cols'] = colWidths

  //     const wb = XLSX.utils.book_new()
  //     XLSX.utils.book_append_sheet(wb, ws, 'Kết quả tiêm vắc-xin')

  //     // Tạo tên file với tên học sinh và thời gian
  //     const studentName = record.studentName?.replace(/\s+/g, '-') || 'unknown'
  //     const fileName = `tiem-vac-xin-${studentName}-${dayjs().format('DD-MM-YYYY-HH-mm')}.xlsx`
  //     XLSX.writeFile(wb, fileName)

  //     message.success('Xuất file Excel thành công!')
  //   } catch (error) {
  //     console.error('Error exporting to Excel:', error)
  //     message.error('Xuất file Excel thất bại!')
  //   }
  // }

  const columns: ColumnsType<HealthRecord> = [
    { title: 'Học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Kết quả', dataIndex: 'result', key: 'result' },
    { title: 'Phản ứng với Vắc-Xin', dataIndex: 'immediateReaction', key: 'immediateReaction' },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (time ? dayjs.utc(time).local().format('DD/MM/YYYY HH:mm') : 'Chưa cập nhật')
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (value: string) => (value?.trim() ? value : 'Không có')
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        if (record.isCompleted) {
          return <span style={{ color: 'green', fontWeight: 600 }}>Hoàn Thành</span>
        }
        return (
          <Button type='link' onClick={() => openAddModal(record)}>
            Thêm bản ghi
          </Button>
        )
      }
    }
  ]

  const openAddModal = (record: HealthRecord) => {
    setSelectedConsent(record)
    setIsModalVisible(true)
  }

  const currentCampaign = campaigns.find((c) => c.campaignId === campaignId)
  const campaignDate = currentCampaign ? dayjs(currentCampaign.date) : null

  const handleAddRecord = async (values: FormValues) => {
    if (!selectedConsent || campaignId === null || nurseId === null) {
      message.error('Thiếu thông tin cần thiết để gửi lên server!')
      return
    }

    const payload = {
      campaignId: campaignId,
      studentId: selectedConsent.studentId,
      nurseId: nurseId,
      dateInjected: values.time ? values.time.toISOString() : new Date().toISOString(),
      result: values.result,
      immediateReaction: values.immediateReaction,
      note: values.note || ''
    }

    try {
      await createVaccinationRecord(payload)
      message.success('Đã lưu bản ghi thành công!')
      form.resetFields()
      setIsModalVisible(false)
      setSelectedConsent(null)
      if (campaignId !== null) {
        fetchConsents(campaignId)
      }
    } catch (err) {
      console.error('Lỗi khi lưu bản ghi:', err)
      message.error('Lưu bản ghi thất bại!')
    }
  }

  return (
    <div>
      <Card>
        <Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
          <Col>
            <Button

              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              disabled={records.length === 0 || campaignId === null}
            >
              Xuất Excel
            </Button>
          </Col>
          <Col>
            <Select
              placeholder='Chọn chiến dịch tiêm'
              style={{ width: 200 }}
              onChange={(value: number) => setCampaignId(value)}
              value={campaignId || undefined}
            >
              {campaigns.map((c) => (
                <Option key={c.campaignId} value={c.campaignId}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table columns={columns} dataSource={records} pagination={false} />

        <Modal
          title={`Thêm bản ghi cho ${selectedConsent?.studentName}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleAddRecord} layout='vertical'>
            <Form.Item name='result' label='Kết quả' rules={[{ required: true, message: 'Vui lòng nhập kết quả' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name='immediateReaction'
              label='Phản ứng với Vắc-Xin'
              rules={[{ required: true, message: 'Vui lòng nhập phản ứng' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='time' label='Thời gian' rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
              <DatePicker
                showTime
                format='DD/MM/YYYY HH:mm'
                style={{ width: '100%' }}
                disabledDate={(date) => !campaignDate || !date.isSame(campaignDate, 'day')}
                disabledTime={() => ({
                  disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < 8 || hour > 16),
                  disabledMinutes: () => [],
                  disabledSeconds: () => []
                })}
              />
            </Form.Item>
            <Form.Item name='note' label='Ghi chú'>
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button className='bg-green-500' htmlType='submit'>
                  Lưu
                </Button>
                {/* {selectedConsent && (
                  <Button icon={<DownloadOutlined />} onClick={() => exportSingleRecordToExcel(selectedConsent)}>
                    Xuất Excelnha
                  </Button>
                )} */}
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default ResultsAfterVaccination
