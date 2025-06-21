import React, { useEffect, useState } from 'react'
import { Spin, Table, Tag, Modal, Button, Form, Input, DatePicker, Descriptions } from 'antd'
import {
  getRequestHistory,
  updateRequest,
  getRequestById,
  MedicationRequestHistory,
  MedicationRequestUpdate,
  Medication
} from '../../../apis/parentMedicationRequest'
import dayjs from 'dayjs'
import { EyeOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

interface DetailedMedicationRequest extends Omit<MedicationRequestHistory, 'medications'> {
  medications: Medication[] | { $values: Medication[] }
  nurseNote?: string
}

function HistorySendMedicine() {
  const [history, setHistory] = useState<MedicationRequestHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; record?: MedicationRequestHistory }>({ open: false })
  const [detailedRecord, setDetailedRecord] = useState<DetailedMedicationRequest | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form] = Form.useForm()

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Tag color='gold'>Chờ duyệt</Tag>
      case 'Approved':
        return <Tag color='green'>Đã duyệt</Tag>
      case 'Rejected':
        return <Tag color='red'>Đã từ chối</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await getRequestHistory()
      setHistory(res.$values || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleOpenModal = async (record: MedicationRequestHistory) => {
    setModal({ open: true, record })
    setIsEditing(false)
    form.resetFields()
    try {
      const detail = await getRequestById(record.requestId)
      setDetailedRecord(detail)
      const meds = Array.isArray(detail.medications) ? detail.medications : detail.medications?.$values || []
      const mappedMeds = meds.map((m: Medication) => ({
        name: m.name,
        type: m.type,
        usage: m.usage,
        dosage: m.dosage,
        expiredDate: m.expiredDate ? dayjs(m.expiredDate) : undefined,
        note: m.note || ''
      }))
      form.setFieldsValue({
        parentNote: detail.parentNote,
        medications: mappedMeds
      })
    } catch (e) {
      console.error(e)
      toast.error('Không thể tải chi tiết.')
    }
  }

  const handleCloseModal = () => {
    setModal({ open: false })
    setIsEditing(false)
    setDetailedRecord(null)
  }

  const handleSaveSubmit = async (values: { parentNote: string; medications: Medication[] }) => {
    if (!modal.record) return
    setIsSaving(true)
    try {
      const data: MedicationRequestUpdate = {
        parentNote: values.parentNote,
        medications: values.medications.map((m) => ({
          ...m,
          expiredDate:
            m.expiredDate && typeof m.expiredDate !== 'string'
              ? dayjs(m.expiredDate).format('YYYY-MM-DD')
              : m.expiredDate || ''
        }))
      }
      await updateRequest(modal.record.requestId, data)
      toast.success('Cập nhật thành công!')
      handleCloseModal()
      fetchHistory()
    } catch (e) {
      console.error(e)
      toast.error('Cập nhật thất bại!')
    } finally {
      setIsSaving(false)
    }
  }

  const columns = [
    {
      title: 'Ngày hết hạn',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    { title: 'Học sinh', dataIndex: 'studentName', key: 'studentName' },
    {
      title: 'Tên thuốc',
      key: 'medicineName',
      render: (_: unknown, record: MedicationRequestHistory) => {
        const meds = Array.isArray(record.medications) ? record.medications : record.medications?.$values || []
        return meds.map((m: Medication) => m.name).join(', ')
      }
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => getStatusTag(status) },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: MedicationRequestHistory) => (
        <Button icon={<EyeOutlined />} onClick={() => handleOpenModal(record)} />
      )
    }
  ]

  const renderModalFooter = () => {
    if (isEditing) {
      return [
        <Button key='cancel' onClick={() => setIsEditing(false)}>
          Hủy
        </Button>,
        <Button key='save' type='primary' loading={isSaving} onClick={() => form.submit()}>
          Lưu
        </Button>
      ]
    }
    return [
      <Button key='close' onClick={handleCloseModal}>
        Đóng
      </Button>,
      <Button
        key='edit'
        type='primary'
        disabled={modal.record?.status !== 'Pending'}
        onClick={() => setIsEditing(true)}
      >
        Chỉnh sửa
      </Button>
    ]
  }

  return (
    <Spin spinning={loading} tip='Đang tải...'>
      <div className='bg-white rounded-2xl shadow-xl p-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Lịch sử gửi thuốc</h1>
        <Table columns={columns} dataSource={history} rowKey='requestId' loading={loading} />
      </div>

      <Modal
        open={modal.open}
        title={isEditing ? 'Chỉnh sửa gửi thuốc' : 'Chi tiết gửi thuốc'}
        onCancel={handleCloseModal}
        footer={renderModalFooter()}
        width={600}
      >
        {isEditing ? (
          // Chế độ chỉnh sửa
          <Form form={form} layout='vertical' onFinish={handleSaveSubmit}>
            <Form.Item name='parentNote' label='Lý do dùng thuốc' rules={[{ required: true, message: 'Nhập lý do!' }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.List name='medications'>
              {(fields) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        label='Tên thuốc'
                        rules={[{ required: true, message: 'Nhập tên thuốc!' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'type']}
                        label='Dạng thuốc'
                        rules={[{ required: true, message: 'Nhập dạng thuốc!' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'dosage']}
                        label='Liều lượng'
                        rules={[{ required: true, message: 'Nhập liều lượng!' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'usage']}
                        label='Cách dùng'
                        rules={[{ required: true, message: 'Nhập cách dùng!' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'expiredDate']} label='Hạn sử dụng'>
                        <DatePicker format='DD/MM/YYYY' />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'note']} label='Ghi chú'>
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        ) : (
          // Chế độ xem chi tiết
          detailedRecord && (
            <Descriptions bordered column={1} layout='vertical'>
              <Descriptions.Item label='Học sinh'>{detailedRecord.studentName}</Descriptions.Item>
              <Descriptions.Item label='Ngày gửi'>
                {dayjs(detailedRecord.dateCreated).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label='Trạng thái'>{getStatusTag(detailedRecord.status)}</Descriptions.Item>
              <Descriptions.Item label='Lý do của phụ huynh'>{detailedRecord.parentNote}</Descriptions.Item>
              {detailedRecord.nurseNote && (
                <Descriptions.Item label='Ghi chú của y tá'>{detailedRecord.nurseNote}</Descriptions.Item>
              )}
              <Descriptions.Item label='Danh sách thuốc'>
                <ul style={{ paddingLeft: 20, listStyle: 'disc' }}>
                  {(Array.isArray(detailedRecord.medications)
                    ? detailedRecord.medications
                    : detailedRecord.medications?.$values || []
                  ).map((m, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      <strong>{m.name}</strong> ({m.type}) - {m.dosage}
                      <br />
                      Cách dùng: {m.usage}
                      <br />
                      HSD: {m.expiredDate && dayjs(m.expiredDate).format('DD/MM/YYYY')}
                      {m.note && (
                        <>
                          <br />
                          Ghi chú: <em>{m.note}</em>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            </Descriptions>
          )
        )}
      </Modal>
    </Spin>
  )
}

export default HistorySendMedicine
