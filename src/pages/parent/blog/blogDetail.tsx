import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spin } from 'antd'
import blogApi from '../../../apis/blog.api'
import type { Blog } from '../../../apis/blog.api'

const BlogDetail: React.FC = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0)
      fetchBlog()
    }
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogApi.getBlogById(id!)
      if (response.data) {
        setBlog(response.data)
        console.log('Blog data:', response.data)
        await fetchRelatedBlogs(response.data)
      } else {
        setError('Không tìm thấy bài viết')
      }
    } catch (err) {
      console.error('Có lỗi xảy ra:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedBlogs = async (currentBlog : Blog) => {
    try {
      setLoading(true)
      const response = await blogApi.getAllBlogs()
      if (response.data && response.data.$values) {
        const filteredBlogs = response.data.$values.filter(relatedBlog => 
          relatedBlog.categoryID === currentBlog?.categoryID && 
          relatedBlog.blogID !== currentBlog.blogID
        )
        setRelatedBlogs(filteredBlogs.slice(0, 2))
      }
    } catch (err) {
      console.error('Error fetching blog:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <Spin size='large' />
          <p className='mt-4 text-gray-600'>Đang tải chi tiết blog...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-xl font-semibold text-red-600'>{error || 'Blog not found'}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center px-6 md:px-28 py-12'>
      <div className='w-full max-w-[1000px] bg-white rounded-2xl shadow-sm p-8'>
        <div className='mb-8 text-center'>
          <div className='bg-green-500 hover:bg-[#001a33] text-white inline-block px-4 py-1.5 rounded-md mb-4 text-sm font-medium transition-colors duration-200'>
            {blog.categoryName}
          </div>
          <h1 className='text-4xl md:text-4xl font-bold mb-6 text-gray-900'>{blog.title}</h1>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <img 
              src='https://static.vecteezy.com/system/resources/previews/000/420/605/original/avatar-icon-vector-illustration.jpg'
              alt=''
              className='w-6 h-6 rounded-full object-cover border border-gray-500 shadow-sm'
            />
            <span className='text-gray-600 text-md'>Được viết bởi</span>
            <span className='font-medium -ml-1'>{blog.authorName}</span>
          </div>
        </div>

        <div className='max-w-4xl mb-8 text-left text-gray-600 text-lg ml-10 break-words overflow-hidden mr-10'>
          {blog.description}
        </div>

        <div className='mb-10 rounded-lg overflow-hidden relative w-full max-w-4xl mx-auto'>
          <img
            src={`data:image/webp;base64,${blog.image}`}
            alt=''
            className='w-full h-[500px] object-cover object-center block'
          />
        </div>
        <div 
          className='prose prose-lg max-w-4xl mb-12 text-left ml-10 break-words overflow-hidden mr-10'
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className='mt-8 pt-8'>
          <Link 
            to="/blog"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='text-blue-500 hover:text-blue-600 flex items-center gap-2'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Quay lại
          </Link>
        </div>

        <div className='flex flex-wrap gap-4 mb-10 mt-8 justify-between items-center border-b border-gray-200 py-2'>
          <div className='flex flex-wrap gap-2'>
            {/* {tags.map((tag, index) => (
              <span key={index} className='px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm hover:bg-gray-200 transition-colors duration-200 cursor-pointer'>
                {tag}
              </span>
            ))} */}
          </div>
          {/* <div className='flex gap-2'>
            <button className='w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white hover:bg-gray-600 transition-colors duration-200'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
              </svg>
            </button>
            <button className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors duration-200'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
              </svg>
            </button>
          </div> */}
        </div>

        {/* <div className='flex justify-between items-center mb-16'>
          <Link to="/blog/4" className='text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors duration-200'>
            <span>←</span>
            <span>Bài trước</span>
          </Link>
          <Link to="/blog/6" className='text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors duration-200'>
            <span>Bài tiếp theo</span>
            <span>→</span>
          </Link>
        </div> */}

        {/* <div className='mb-16'>
          <h3 className='text-2xl font-bold mb-8'>{comments.length} Bình luận</h3>
          
          {comments.map(comment => (
            <div key={comment.id} className='flex gap-4 mb-8 bg-gray-50 p-4 rounded-2xl'>
              <img 
                src={comment.avatar} 
                alt={comment.author}
                className='w-12 h-12 rounded-full object-cover'
              />
              <div className='flex-1'>
                <div className='flex justify-between items-center mb-2'>
                  <div>
                    <span className='font-bold mr-2'>{comment.author}</span>
                    {comment.isAuthor && (
                      <span className='bg-gray-200 px-2 py-0.5 text-xs rounded-md'>Post Author</span>
                    )}
                  </div>
                  <span className='text-sm text-gray-500'>{comment.date}</span>
                </div>
                <p className='text-gray-700 mb-2'>{comment.content}</p>
                <button className='text-gray-600 text-sm font-medium flex items-center gap-1 hover:text-gray-900 transition-colors duration-200'>
                  Phản hồi
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className='mb-16 bg-gray-50 p-6 rounded-2xl'>
          <h3 className='text-2xl font-bold mb-6'>Để lại bình luận</h3>
          <form className='space-y-6'>
            <textarea 
              placeholder='Bình luận của bạn *' 
              rows={6}
              className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            ></textarea>
            <div className='flex justify-end'>
              <button 
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200'
              >
                Gửi bình luận
              </button>
            </div>
          </form>
        </div> */}

        <div>
          <h3 className='text-2xl font-bold mb-8'>Bài viết liên quan</h3>
            { relatedBlogs.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {relatedBlogs.map(post => (
                  <Link key={post.blogID} to={`/blog/${post.blogID}`} className='group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow duration-300'>
                    <div className='mb-4 overflow-hidden relative h-48'>
                      {/* <img 
                        // src={post.image}
                        src='https://www.sattva.co.in/wp-content/uploads/2022/12/Untitled-1200-%C3%97-630-px.png'
                        alt=''
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                      /> */}
                      <img src={`data:image/webp;base64,${post.image}`} alt="blog image" />
                    </div>
                    <div className='p-4'>
                      <div className='bg-green-500 hover:bg-[#001a33] text-white inline-block px-3 py-1 rounded-md mb-2 text-sm font-medium transition-colors duration-200'>
                        {post.categoryName}
                      </div>
                      <h4 className='font-bold text-lg text-gray-800 transition-colors line-clamp-2 ml-1'>
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='text-gray-600 text-center'>Không có bài viết liên quan</div>
            )}
        </div>
      </div>
    </div>
  )
}

export default BlogDetail 