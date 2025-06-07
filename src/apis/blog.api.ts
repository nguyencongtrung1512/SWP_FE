import http from '../utils/http'

export interface Blog {
  id: number
  title: string
  description: string
  content: string
  image: string
  status: string
  category: number // Đây là category ID
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  description: string
  content: string
  category: number
  image: File // Hoặc string nếu bạn chỉ gửi URL ảnh
}

interface ApiResponse<T> {
  $id: string
  $values: T
}

const blogApi = {
  getAllBlogs() {
    return http.get<ApiResponse<Blog[]>>('/Blog/GetAllBlog')
  },
  createBlog(formData: FormData) {
    return http.post<Blog>('/Blog/CreateBlog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getBlogById(id: string) {
    return http.get<Blog>(`/Blog/GetBlogById/${id}`)
  },
  updateBlog(id: string, data: CreateBlogRequest) {
    return http.put<Blog>(`/Blog/UpdateBlog/${id}`, data)
  },
  deleteBlog(id: string) {
    return http.delete<void>(`/Blog/DeleteBlog/${id}`)
  }
}

export default blogApi
