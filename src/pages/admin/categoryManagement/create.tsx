import { Modal, Form, Input, Button } from 'antd'
import { categoryApi } from '../../../apis/category.api'
import { toast } from 'react-toastify'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateCategoryModal = ({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: { name: string }) => {
    try {
      await categoryApi.createCategory(values)
      toast.success('Thêm danh mục thành công')
      form.resetFields()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  return (
    <Modal title='Thêm danh mục mới' open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item name='name' label='Tên danh mục' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}>
          <Input placeholder='Nhập tên danh mục' />
        </Form.Item>

        <Form.Item>
          <div className='flex justify-end gap-2'>
            <Button onClick={onClose}>Hủy</Button>
            <Button type='primary' htmlType='submit'>
              Thêm mới
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateCategoryModal
