import { Modal, Form, Input, Spin, Button } from 'antd'
import React from 'react'
import { addStudent, getStudentInfo } from '../../api/parent.api'
import { toast } from 'react-toastify'
import { translateMessage } from '../../utils/message'

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSuccess: () => void
}

interface StudentInfo {
  sid: string
  fullname: string
  studentCode: string
  gender: string
  dateOfBirth: string
  className: string
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [checking, setChecking] = React.useState(false)
  const [studentInfo, setStudentInfo] = React.useState<StudentInfo | null>(null)
  const [studentCode, setStudentCode] = React.useState('')

  const handleCheckStudent = async () => {
    const code = form.getFieldValue('studentCode')
    if (!code) {
      toast.warning('Vui lòng nhập mã học sinh!')
      return
    }
    setChecking(true)
    setStudentInfo(null)
    try {
      const res = await getStudentInfo(code)
      if (res.success && res.data) {
        setStudentInfo(res.data as StudentInfo)
        setStudentCode(code)
      } else {
        setStudentInfo(null)
        toast.error(translateMessage(res.message, 'parent'))
      }
    } catch {
      setStudentInfo(null)
      toast.error('Đã xảy ra lỗi khi kiểm tra mã học sinh.')
    } finally {
      setChecking(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const response = await addStudent({ studentCode })
      if (response.success) {
        toast.success(translateMessage(response.message, 'parent') || 'Liên kết học sinh thành công!')
        form.resetFields()
        setStudentInfo(null)
        setStudentCode('')
        onAddSuccess()
        onClose()
      } else {
        toast.error(translateMessage(response.message, 'parent'))
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi liên kết con.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setStudentInfo(null)
    setStudentCode('')
    form.resetFields()
    onClose()
  }

  return (
    <Modal title='Thêm con' open={isOpen} onCancel={handleCancel} footer={null}>
      <Spin spinning={loading || checking}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='studentCode'
            label='Mã học sinh'
            rules={[{ required: true, message: 'Vui lòng nhập mã học sinh!' }]}
            className='mb-6'
          >
            <Input disabled={!!studentInfo} />
          </Form.Item>
          {!studentInfo && (
            <Form.Item>
              <Button type='primary' className='w-full' onClick={handleCheckStudent} loading={checking}>
                Kiểm tra
              </Button>
            </Form.Item>
          )}
        </Form>
        {studentInfo && (
          <div className='bg-gray-50 rounded-lg p-4 my-4'>
            <div>
              <b>Họ tên:</b> {studentInfo.fullname}
            </div>
            <div>
              <b>Mã học sinh:</b> {studentInfo.studentCode}
            </div>
            <div>
              <b>Giới tính:</b> {studentInfo.gender}
            </div>
            <div>
              <b>Ngày sinh:</b> {studentInfo.dateOfBirth?.split('T')[0]}
            </div>
            <div>
              <b>Lớp:</b> {studentInfo.className}
            </div>
            <div className='flex gap-2 mt-4'>
              <Button type='primary' onClick={handleConfirm} loading={loading}>
                Xác nhận liên kết
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  )
}

export default AddStudentModal
