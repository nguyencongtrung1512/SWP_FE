import { Modal, Form, Input, Button } from 'antd'
import { categoryApi, Category } from '../../../apis/category.api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

interface UpdateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentCategory: Category | null
}

const UpdateCategoryModal = ({ isOpen, onClose, onSuccess, currentCategory }: UpdateCategoryModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        name: currentCategory.name
      })
    } else {
      form.resetFields()
    }
  }, [currentCategory, form])

  const handleSubmit = async (values: { name: string; description?: string }) => {
    if (!currentCategory) return

    try {
      await categoryApi.updateCategoryById(currentCategory.categoryID, values)
      toast.success('Cập nhật danh mục thành công')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return (
    <Modal title='Cập nhật danh mục' open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item name='name' label='Tên danh mục' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}>
          <Input placeholder='Nhập tên danh mục' />
        </Form.Item>

        <Form.Item>
          <div className='flex justify-end gap-2'>
            <Button onClick={onClose}>Hủy</Button>
            <Button type='primary' htmlType='submit'>
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateCategoryModal
