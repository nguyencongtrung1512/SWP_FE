import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Card, Typography, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import {
  createVaccinationRecord,
  getConsentsByCampaign,
  getAllVaccinationCampaigns,
  VaccinationCampaign,
  getVaccinationRecordsByCampaign
} from '../../../apis/vaccination'

const { Title } = Typography
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

  // Lấy danh sách chiến dịch
  const fetchAllCampaigns = async () => {
    try {
      const res = await getAllVaccinationCampaigns()
      setCampaigns(res.data.$values || [])
    } catch (error) {
      console.error(error)
      message.error('Không tải được danh sách chiến dịch!')
    }
  }

  // Lấy consent và record
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
          result: record?.result || '',
          immediateReaction: record?.immediateReaction || '',
          medication: record?.medication || '',
          time: record?.dateInjected ? dayjs(record.dateInjected).format('DD/MM/YYYY HH:mm') : '',
          note: record?.note || '',
          recordId: record?.recordId,
          isCompleted: !!record // Nếu đã có record thì xem là hoàn thành
        }
      })
      setRecords(mapped)
    } catch (err) {
      console.error(err)
      message.error('Lấy danh sách thất bại!')
    }
  }

  const columns: ColumnsType<HealthRecord> = [
    { title: 'Học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Kết quả', dataIndex: 'result', key: 'result' },
    { title: 'Phản ứng với Vắc-Xin', dataIndex: 'immediateReaction', key: 'immediateReaction' },
    // { title: 'Uống thuốc', dataIndex: 'medication', key: 'medication' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center', // Thêm dòng này
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

  // Lấy ngày campaign hiện tại để giới hạn DatePicker
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
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Ghi nhận kết quả sau tiêm</Title>
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

        {/* Modal thêm bản ghi */}
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
            {/* <Form.Item name='medication' label='Uống thuốc' rules={[{ required: true, message: 'Vui lòng chọn' }]}>
              <Select>
                <Option value='Có'>Có</Option>
                <Option value='Không'>Không</Option>
              </Select>
            </Form.Item> */}
            <Form.Item name='time' label='Thời gian' rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}>
              <DatePicker
                showTime
                format='DD/MM/YYYY HH:mm'
                style={{ width: '100%' }}
                disabledDate={(date) => !campaignDate || !date.isSame(campaignDate, 'day')}
              />
            </Form.Item>
            <Form.Item name='note' label='Ghi chú'>
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default ResultsAfterVaccination
