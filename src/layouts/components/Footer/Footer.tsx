import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='bg-gradient-to-r from-sky-500 via-blue-400 to-sky-400 text-white rounded-t-3xl shadow-lg mt-12'>
      <div className='w-full max-w-screen-xl mx-auto p-8 md:py-12'>

        <div className='sm:flex sm:justify-between'>
          <div className='mb-8 md:mb-0 mr-8'>
            <Link to='/' className='flex items-center mb-6 space-x-3 rtl:space-x-reverse'>
              <div className='bg-white text-blue-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md'>
                <span className='text-2xl font-bold'>@</span>
              </div>
              <span className='self-center text-2xl font-bold whitespace-nowrap'>Care Health Edu</span>
            </Link>
            <p className='max-w-xs text-white/80 text-md leading-relaxed'>
              Giúp phụ huynh theo dõi và quản lý thông tin sức khỏe của con một cách thuận tiện
            </p>
            <div className='mt-6 flex space-x-4'>
              <a
                href='#'
                className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300'
              >
                <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300'
              >
                <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300'
              >
                <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z' />
                </svg>
              </a>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12'>
            {/* Quick Links */}
            <div>
              <h3 className='text-lg font-bold mb-6 flex items-center'>
                <span className='bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </span>
                Liên Kết Nhanh
              </h3>
              <ul className='space-y-3'>
                <li>
                  <Link
                    to='/'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>→</span>
                    Trang Chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to='/about'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>→</span>
                    Về Chúng Tôi
                  </Link>
                </li>
                <li>
                  <Link
                    to='/faq'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>?</span>
                    Câu Hỏi Thường Gặp
                  </Link>
                </li>
                <li>
                  <Link
                    to='/help'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>!</span>
                    Trung Tâm Hỗ Trợ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className='text-lg font-bold mb-6 flex items-center'>
                <span className='bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                </span>
                Support
              </h3>
              <ul className='space-y-3'>
                <li>
                  <Link
                    to='/faq'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>?</span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to='/help'
                    className='text-white/80 hover:text-white transition-colors duration-300 flex items-center'
                  >
                    <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 text-xs'>!</span>
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className='text-lg font-bold mb-6 flex items-center'>
                <span className='bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </span>
                Liên Hệ Chúng Tôi
              </h3>
              <ul className='space-y-3'>
                <li className='flex items-start'>
                  <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 mt-0.5 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  </span>
                  <span className='text-white/80'>Nhà Văn hóa Sinh viên TP. Hồ Chí Minh</span>
                </li>
                <li className='flex items-center'>
                  <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                      />
                    </svg>
                  </span>
                  <span className='text-white/80'>+ (84) 123-4567</span>
                </li>
                <li className='flex items-center'>
                  <span className='bg-white/10 w-6 h-6 rounded flex items-center justify-center mr-2 flex-shrink-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </span>
                  <span className='text-white/80'>info@eduCare.edu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-white/20'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-white/70 mb-4 md:mb-0'>
              © 2025 <span className='font-medium'>Care Health Edu™</span>. Tất Cả Các Quyền Được Bảo Lưu.
            </p>
            <div className='flex space-x-6'>
              <Link to='/privacy' className='text-sm text-white/70 hover:text-white transition-colors duration-300'>
                Chính Sách Bảo Mật
              </Link>
              <Link to='/terms' className='text-sm text-white/70 hover:text-white transition-colors duration-300'>
                Điều Khoản Dịch Vụ
              </Link>
              <Link to='/cookies' className='text-sm text-white/70 hover:text-white transition-colors duration-300'>
                Chính Sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
