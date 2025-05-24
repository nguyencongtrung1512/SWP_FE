import React from 'react'

function Home() {
  return (
    <div className='min-h-screen bg-white flex items-start justify-center px-28 py-12'>
      {/* Lưới 3 cột lớn */}
      <div className='grid grid-cols-3 gap-8 w-full max-w-[1600px]'>
        {/* Cột trái: 2 ô dọc */}
        <div className='flex flex-col gap-8'>
          {/* Ô xanh chữ */}
          <div className='bg-[#0094f6] rounded-2xl p-8 text-white min-h-[220px] flex flex-col justify-between'>
            <span className='uppercase tracking-widest text-sm font-semibold opacity-80 mb-4'>Leading Experts</span>
            <span className='text-4xl font-bold leading-tight'>Medical center for healthcare</span>
          </div>
          {/* Ảnh */}
          <img
            src='https://healthhub.ancorathemes.com/wp-content/uploads/elementor/thumbs/home1-image2-copyright-qubyhfh92a3ga1pgab9h06kzbrkux6tawleu2pux9s.jpg'
            alt='stethoscope'
            className='rounded-2xl object-cover w-full h-[220px]'
          />
        </div>
        {/* Cột giữa: 1 ảnh lớn */}
        <div className='row-span-2'>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyuM__MBkdpMUwRUoB3x8v_JVgT4Xy00kTbA&s'
            alt='doctor'
            className='rounded-2xl object-cover w-full h-[460px]'
          />
        </div>
        {/* Cột phải: Text lớn + 1 ô nhỏ bên dưới */}
        <div className='flex flex-col gap-8'>
          {/* Text lớn */}
          <div>
            <span className='uppercase tracking-widest text-sm font-semibold opacity-80 mb-4 block'>
              Wellness Services
            </span>
            <h1 className='text-5xl font-extrabold text-gray-900 mb-6 leading-tight'>
              Your health is our topmost priority
            </h1>
            <p className='text-gray-600 mb-4'>
              Sed ut perspiciatis unde omnis iste natus ut perspic iatis unde omnis iste perspiciatis ut perspiciatis
              unde omnis iste natus. Sed ut perspiciatis unde omnis iste natus.
            </p>
            <p className='text-gray-600'>
              Perspic iatis unde omnis iste perspiciatis ut perspiciatis unde omnis iste natus. Sed ut perspiciatis.
            </p>
          </div>
          {/* Ô nhỏ bên dưới */}
          <div className='flex items-start gap-4'>
            <div className='text-blue-500 text-3xl mt-1'>
              {/* Icon trái tim mạch */}
              <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
                <path
                  d='M12 21s-6.5-4.35-9-7.5C-1.5 9.5 2.5 4 7 7c2.5 2 5 0 5 0s2.5 2 5 0c4.5-3 8.5 2.5 4 6.5-2.5 3.15-9 7.5-9 7.5z'
                  stroke='#0094f6'
                  strokeWidth='2'
                  fill='none'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-1'>Health checkup</h2>
              <p className='text-gray-600 text-base'>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='text-blue-500 text-3xl mt-1'>
              {/* Icon trái tim mạch */}
              <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
                <path
                  d='M12 21s-6.5-4.35-9-7.5C-1.5 9.5 2.5 4 7 7c2.5 2 5 0 5 0s2.5 2 5 0c4.5-3 8.5 2.5 4 6.5-2.5 3.15-9 7.5-9 7.5z'
                  stroke='#0094f6'
                  strokeWidth='2'
                  fill='none'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-1'>Emergency help</h2>
              <p className='text-gray-600 text-base'>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='text-blue-500 text-3xl mt-1'>
              {/* Icon trái tim mạch */}
              <svg width='32' height='32' fill='none' viewBox='0 0 24 24'>
                <path
                  d='M12 21s-6.5-4.35-9-7.5C-1.5 9.5 2.5 4 7 7c2.5 2 5 0 5 0s2.5 2 5 0c4.5-3 8.5 2.5 4 6.5-2.5 3.15-9 7.5-9 7.5z'
                  stroke='#0094f6'
                  strokeWidth='2'
                  fill='none'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-1'>Diagnostic services</h2>
              <p className='text-gray-600 text-base'>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
