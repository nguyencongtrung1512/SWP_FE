import http from '../utils/http'

export interface Blog {
  blogID: number
  title: string
  description: string
  content: string
  image: string
  status: string
  categoryID: number
  categoryName: string
  accountID: number
  authorName: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  description: string
  content: string
  category: number
  image: string
}

interface ApiResponse<T> {
  $id: string
  $values: T
}

const blogApi = {
  getAllBlogs() {
    return http.get<ApiResponse<Blog[]>>('/Blog/GetAllBlogs')
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
  updateBlog(id: string, data: CreateBlogRequest | FormData) {
    if (data instanceof FormData) {
      return http.put<Blog>(`/Blog/UpdateBlog/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      return http.put<Blog>(`/Blog/UpdateBlog/${id}`, data)
    }
  },
  deleteBlog(id: string) {
    return http.delete<void>(`/Blog/DeleteBlog/${id}`)
  }
}

export default blogApi
