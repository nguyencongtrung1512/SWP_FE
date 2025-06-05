import http from '../utils/http'

export interface Blog {
  id: string
  title: string
  description: string
  content: string
  category: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  description: string
  content: string
  category: string
  image: string
}

const blogApi = {
  getAllBlogs() {
    return http.get<Blog[]>('/Blog/GetAllBlogs')
  },

  createBlog(data: CreateBlogRequest) {
    return http.post<Blog>('/Blog/CreateBlog', data)
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
