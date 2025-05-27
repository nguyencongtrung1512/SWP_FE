import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from 'antd'
import BlogEditor from './blogEditor'

const Blog: React.FC = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showWriteForm, setShowWriteForm] = useState(false)
  
  const blogPosts = [
    {
      id: 1,
      title: 'Chức năng chính của phòng y tế học đường',
      excerpt: 'Phòng y tế học đường đóng vai trò quan trọng trong việc chăm sóc sức khỏe học sinh, từ sơ cứu đến phòng ngừa dịch bệnh và tư vấn dinh dưỡng...',
      date: 'Ngày 14 tháng 10, 2023',
      comments: 0,
      category: 'SỨC KHỎE',
      image: 'https://healthhub.ancorathemes.com/wp-content/uploads/elementor/thumbs/home1-image2-copyright-qubyhfh92a3ga1pgab9h06kzbrkux6tawleu2pux9s.jpg'
    },
    {
      id: 2,
      title: 'Giải thích quy trình xét nghiệm y tế học đường',
      excerpt: 'Hiểu rõ các quy trình xét nghiệm y tế tại trường học giúp phụ huynh và học sinh an tâm hơn khi tham gia các chương trình khám sức khỏe định kỳ...',
      date: 'Ngày 14 tháng 10, 2023',
      comments: 0,
      category: 'SỨC KHỎE',
      image: 'https://getwallpapers.com/wallpaper/full/2/8/5/7336.jpg'
    },
    {
      id: 3,
      title: 'Tầm quan trọng của việc kiểm tra sức khỏe định kỳ tại trường',
      excerpt: 'Kiểm tra sức khỏe định kỳ tại trường giúp phát hiện sớm các vấn đề sức khỏe, đảm bảo sự phát triển toàn diện của học sinh trong môi trường học tập...',
      date: 'Ngày 14 tháng 10, 2023',
      comments: 2,
      category: 'SỨC KHỎE',
      image: 'https://vigour360.com/blog/wp-content/uploads/2023/04/Blog-image-5.4.2023.png'
    },
    {
      id: 4,
      title: 'Tiến bộ công nghệ y tế trong trường học',
      excerpt: 'Công nghệ y tế hiện đại đang được áp dụng trong các phòng y tế học đường, nâng cao hiệu quả chăm sóc sức khỏe và phòng ngừa dịch bệnh cho học sinh...',
      date: 'Ngày 14 tháng 10, 2023',
      comments: 1,
      category: 'SỨC KHỎE',
      image: 'https://wallpaperaccess.com/full/136934.jpg'
    },
    {
      id: 5,
      title: 'Khoa học đằng sau liệu pháp hành vi nhận thức cho học sinh',
      excerpt: 'Liệu pháp hành vi nhận thức đang được áp dụng hiệu quả để hỗ trợ học sinh đối mặt với các vấn đề tâm lý trong môi trường học đường...',
      date: 'Ngày 15 tháng 10, 2023',
      comments: 1,
      category: 'TÂM LÝ',
      image: 'https://getwallpapers.com/wallpaper/full/e/f/7/7182.jpg',
      author: 'Nguyễn Văn A'
    },
    {
      id: 6,
      title: 'Kể câu chuyện mới cho giáo dục mầm non',
      excerpt: 'Phương pháp tiếp cận mới trong chăm sóc sức khỏe tâm lý cho trẻ mầm non, giúp xây dựng nền tảng vững chắc cho sự phát triển toàn diện...',
      date: 'Ngày 15 tháng 10, 2023',
      comments: 0,
      category: 'TÂM LÝ',
      image: 'https://studiomedicozucchimartina.it/wp-content/uploads/2021/10/Children-Healthcare-1920x1080-1.jpg',
      author: 'Nguyễn Văn A'
    }
  ]

  const categories = [
    { name: 'Sức khỏe', count: 3 },
    { name: 'Dinh dưỡng', count: 4 },
    { name: 'Tâm lý', count: 9 },
    { name: 'Tiêm chủng', count: 4 },
    { name: 'Tư vấn', count: 9 }
  ]

  const recentPosts = blogPosts.slice(4, 6)

  const postsPerPage = 3
  
  const filteredPosts = searchTerm 
    ? blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blogPosts
    
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

  const handleSubmitBlog = (blogData: any) => {
    console.log('Blog submitted:', blogData)
    setShowWriteForm(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center px-6 md:px-28 py-12'>
      <div className='w-full max-w-[1200px]'>
        {/* Header with Blog title and arrow */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>Blog</h1>
          <div className='flex justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black mt-4">
              <path d="M11.8571 13.62L21.6486 3.00991C21.8737 2.76496 22 2.43345 22 2.08789C22 1.74233 21.8737 1.41082 21.6486 1.16587L20.9282 0.390626C20.7023 0.146262 20.3962 0.00900148 20.0769 0.00900145C19.7577 0.00900142 19.4515 0.146262 19.2256 0.390626L11.0023 9.29718L2.77438 0.380589C2.54822 0.136837 2.24215 -1.72729e-06 1.92309 -1.75518e-06C1.60404 -1.78307e-06 1.29796 0.136837 1.0718 0.380589L0.351396 1.16085C0.126343 1.4058 1.75547e-06 1.73731 1.72526e-06 2.08287C1.69505e-06 2.42843 0.126343 2.75994 0.351396 3.00489L10.1499 13.62C10.3771 13.8635 10.6838 14 11.0035 14C11.3231 14 11.6298 13.8635 11.8571 13.62Z"></path>
            </svg>
          </div>
        </div>
        
        {/* Write a Blog button in a separate section */}
        <div className='flex justify-center mb-12'>
          <Button 
            type="primary"
            size="large"
            onClick={() => setShowWriteForm(true)}
            className='bg-blue-500 hover:bg-blue-600 flex items-center gap-2 px-6'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            Tạo bài viết
          </Button>
        </div>
        
        {/* Blog Editor Component */}
        <BlogEditor 
          visible={showWriteForm}
          onClose={() => setShowWriteForm(false)}
          onSubmit={handleSubmitBlog}
          categories={categories}
        />
        
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Blog Posts */}
          <div className='w-full lg:w-2/3 space-y-12'>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <div key={post.id} className='bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer' onClick={() => handlePostClick(post.id)}>
                  <div className='flex flex-col md:flex-row h-auto min-h-[300px]'>
                    <div className='w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden'>
                      <img 
                        src={post.image}
                        alt={post.title}
                        className='w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-110'
                      />
                    </div>
                    <div className='w-full md:w-1/2 p-6 overflow-hidden'>
                      <div className='bg-green-500 hover:bg-[#001a33] text-white inline-block px-4 py-1.5 rounded-md mb-4 text-sm font-medium transition-colors duration-200 cursor-pointer'>
                        {post.category}
                      </div>
                      <h2 className='text-lg md:text-2xl font-bold mb-3 text-gray-900 line-clamp-2'>{post.title}</h2>
                      <p className='text-gray-600 mb-3 text-sm line-clamp-3'>
                        {post.excerpt}
                      </p>
                      <div className='text-gray-500 text-xs'>{post.date} • {post.comments} Bình luận</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-2xl shadow-sm p-8 text-center'>
                <h3 className='text-xl font-bold text-gray-700'>Không tìm thấy kết quả phù hợp</h3>
                <p className='text-gray-600 mt-2'>Vui lòng thử tìm kiếm với từ khóa khác</p>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className='flex gap-2 mt-12 justify-center'>
                {currentPage > 1 && (
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600'
                  >
                    ←
                  </button>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      currentPage === page 
                        ? 'bg-gray-900 text-white' 
                        : 'border border-gray-300 text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {currentPage < totalPages && (
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className='w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600'
                  >
                    →
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className='w-full lg:w-1/3 space-y-8'>
            {/* Search */}
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
            
            {/* Categories */}
            <div className='bg-white p-6 rounded-2xl shadow-sm'>
              <h3 className='text-xl font-bold mb-4 text-gray-900'>Danh mục</h3>
              <ul className='space-y-3'>
                {categories.map((category, index) => (
                  <li key={index} className='flex items-center'>
                    <span className='w-2 h-2 bg-blue-500 rounded-full mr-3'></span>
                    <span className='text-gray-700 hover:text-blue-500 cursor-pointer'>{category.name} ({category.count})</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Recent Posts */}
            <div className='bg-white p-6 rounded-2xl shadow-sm'>
              <h3 className='text-xl font-bold mb-4 text-gray-900'>Bài viết gần đây</h3>
              <div className='space-y-4'>
                {recentPosts.map(post => (
                  <div key={post.id} className='flex gap-3 cursor-pointer' onClick={() => handlePostClick(post.id)}>
                    <div className='w-20 h-20 min-w-[80px] rounded overflow-hidden relative'>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className='w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-110'
                      />
                    </div>
                    <div className='flex flex-col justify-center'>
                      <div className='text-xs text-gray-500 mb-1'>{post.date.split(',')[0]}</div>
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

export default Blog 