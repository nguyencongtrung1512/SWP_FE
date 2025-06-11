import http from '../utils/http'
import { Blog } from './blog.api'

export interface Category {
  id: number
  categoryID: number
  name: string
  blogs: {
    $id: string;
    $values: Blog[];
  } | null;
}

interface ApiResponse<T> {
  $id: string;
  $values: T;
}

export const categoryApi = {
  getAllCategories() {
    return http.get<ApiResponse<Category[]>>('/Category/GetAllCategory')
  },

  getCategoryById(id: number) {
    return http.get<Category>(`/Category/GetCateById/${id}`)
  },

  updateCategoryById(id: number, data: Omit<Category, 'id' | 'categoryID' | 'blogs'>) {
    return http.put<Category>(`/Category/UpdateCategory/${id}`, data)
  },

  deleteCategoryById(id: number) {
    return http.delete<Category>(`/Category/DeleteCategory/${id}`)
  },

  createCategory(data: Omit<Category, 'id' | 'categoryID' | 'blogs'>) {
    return http.post<Category>('/Category/CreateCategory', data)
  }
}
