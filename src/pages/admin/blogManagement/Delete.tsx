import React from 'react'
import { Modal, message } from 'antd'
import blogApi from '../../../apis/blog.api'
import type { Blog } from '../../../apis/blog.api'
import { toast } from 'react-toastify'

interface DeleteBlogProps {
  blog: Blog | null
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const DeleteBlog: React.FC<DeleteBlogProps> = ({ blog, visible, onCancel, onSuccess }) => {
  const handleDelete = async () => {
    if (!blog) return

    try {
      await blogApi.deleteBlog(blog.blogID)
      toast.success('Xóa blog thành công!')
      onSuccess()
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Không thể xóa blog. Vui lòng thử lại sau.')
    }
  }

  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onOk={handleDelete}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa bài viết "{blog?.title}" không?</p>
      <p>Hành động này không thể hoàn tác.</p>
    </Modal>
  )
}

export default DeleteBlog
