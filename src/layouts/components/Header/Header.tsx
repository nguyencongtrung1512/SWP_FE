import { useState } from 'react'

function Header() {
  const [open, setOpen] = useState(false)
  // Giả lập thông tin user
  const user = {
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }

  return (
    <header className='flex items-center px-12 py-6 bg-white w-full relative'>
      {/* Logo và tên */}
      <div className='flex items-center mr-16'>
        {/* SVG logo dấu cộng */}
        <span className='text-blue-500 mr-2'>
          <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <rect x='7' y='16' width='22' height='4' rx='2' fill='#1da1f2' />
            <rect x='16' y='7' width='4' height='22' rx='2' fill='#1da1f2' />
            <rect x='2' y='2' width='32' height='32' rx='8' stroke='#1da1f2' strokeWidth='3' />
          </svg>
        </span>
        <span className='text-3xl font-bold select-none'>
          <span className='text-gray-900'>Edu</span>
          <span className='text-blue-500'>Care</span>
        </span>
      </div>
      {/* Menu */}
      <nav className='flex space-x-8 text-lg font-medium flex-1'>
        <a href='/home' className='text-gray-900 hover:text-blue-500 transition-colors'>
          Home
        </a>
        <a href='/health-record' className='text-gray-900 hover:text-blue-500 transition-colors'>
          Health Record
        </a>
        <a href='/send-medicine' className='text-gray-900 hover:text-blue-500 transition-colors'>
          Send Medicine
        </a>
        <a href='/private-consultation' className='text-gray-900 hover:text-blue-500 transition-colors'>
          Private Consultation
        </a>
        <a href='/blog' className='text-gray-900 hover:text-blue-500 transition-colors'>
          Blog
        </a>
      </nav>
      {/* Avatar user */}
      <div className='relative'>
        <button className='flex items-center space-x-2 focus:outline-none' onClick={() => setOpen(!open)}>
          <img src={user.avatar} alt='avatar' className='w-10 h-10 rounded-full border-2 border-blue-400' />
          <span className='font-semibold text-gray-800'>{user.name}</span>
        </button>
        {open && (
          <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
            <div className='px-4 py-2 text-gray-900 font-bold'>{user.name}</div>
            <a href='/profile' className='block px-4 py-2 text-gray-700 hover:bg-blue-50'>
              Hồ sơ của tôi
            </a>
            <button
              className='w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50'
              onClick={() => alert('Đăng xuất!')}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
