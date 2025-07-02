import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ReadOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import blogApi from '../../../apis/blog.api'
import type { Blog } from '../../../apis/blog.api'
import type { Category } from '../../../apis/category.api'
import { categoryApi } from '../../../apis/category.api'
import BlogCard from './blogCard'

const BlogPage: React.FC = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchCategories()
    fetchBlogs()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, searchTerm])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories()
      if (response.data && response.data.$values) {
        setCategories(response.data.$values)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getAllBlogs()
      if (response.data && response.data.$values) {
        console.log('Blogs fetched:', response.data.$values)
        setBlogs(response.data.$values)
      }
    } catch (error) { 
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const clearAllCategories = () => {
    setSelectedCategories([])
  }

  const postsPerPage = 3

  const filteredPosts = blogs.filter(post => {
    const matchesSearch = searchTerm === '' || post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.categoryID)
    
    return matchesSearch && matchesCategory
  })
    
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  
  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }
  
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  const handlePostClick = (postId: number): void => {
    navigate(`/blog/${postId}`)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const recentPosts = blogs.slice(0, 2)

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <Spin size='large' />
          <p className='mt-4 text-gray-600'>Đang tải danh sách blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center px-6 md:px-28 py-12'>
      <div className='w-full max-w-[1300px]'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4 mr-3'>
            <ReadOutlined className='text-3xl text-blue-500 mr-3 mt-2' />
            <h1 className='text-4xl font-bold text-gray-800'>Blog</h1>
          </div>
        </div>
        
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-2/3 space-y-12'>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <BlogCard key={post.blogID} post={post} />
              ))
            ) : (
              <div className='bg-white rounded-2xl shadow-sm p-24 text-center'>
                <h3 className='text-xl font-bold text-gray-700'>Không tìm thấy kết quả phù hợp</h3>
                <p className='text-gray-600 mt-2'>Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
              </div>
            )}

            {filteredPosts.length > 0 && totalPages > 1 && (
              <div className='flex gap-2 mt-12 justify-center'>
                {currentPage > 1 && (
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50'
                  >
                    ←
                  </button>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      currentPage === page 
                        ? 'bg-gray-900 text-white' 
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {currentPage < totalPages && (
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50'
                  >
                    →
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className='w-full lg:w-1/3 space-y-8'>
            <div className='bg-white p-6 rounded-2xl shadow-sm'>
              <h3 className='text-xl font-bold mb-4 text-gray-900'>Tìm kiếm</h3>
              <form onSubmit={handleSearch} className='relative'>
                <input 
                  type='text' 
                  placeholder='Tìm kiếm...' 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button type="submit" className='absolute right-3 top-2.5 text-gray-400 hover:text-gray-600'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className='bg-white p-6 rounded-2xl shadow-sm'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-bold text-gray-900'>Danh mục</h3>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={clearAllCategories}
                    className='text-sm text-blue-600 hover:text-blue-800 underline'
                  >
                    Bỏ chọn tất cả
                  </button>
                )}
              </div>
              <ul className='space-y-1'>
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.categoryID)
                  return (
                    <li key={category.categoryID} className='flex items-center'>
                      <label className='flex items-center w-full cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all'>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCategoryClick(category.categoryID)}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3'
                        />
                        <span 
                          className={`${
                            isSelected 
                              ? 'text-blue-700 font-medium' 
                              : 'text-gray-700 hover:text-blue-500'
                          }`}
                        >
                          {category.name}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <div className='bg-white p-6 rounded-2xl shadow-sm'>
              <h3 className='text-xl font-bold mb-4 text-gray-900'>Bài viết gợi ý</h3>
              <div className='space-y-4'>
                {recentPosts.map(post => (
                  <div key={post.blogID} className='flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors' onClick={() => handlePostClick(post.blogID)}>
                    <div className='w-20 h-20 min-w-[80px] rounded overflow-hidden relative'>
                      <img 
                        src={`data:image/webp;base64,${post.image}`}
                        alt=''
                        className='w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-110'
                      />
                    </div>
                    <div className='flex flex-col justify-center'>
                      <h4 className='font-medium text-gray-800 leading-tight hover:text-blue-500 line-clamp-2'>{post.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage