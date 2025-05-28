function Home() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12'>
      <div className='w-full max-w-[1450px] px-4 md:px-8 lg:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16'>
          <div className='flex flex-col gap-8'>
            <div className='bg-[#0094f6] rounded-2xl p-8 text-white min-h-[220px] flex flex-col justify-between'>
              <span className='uppercase tracking-widest text-sm font-semibold opacity-80 mb-4'>Nền Tảng Kết Nối</span>
              <span className='text-3xl font-bold leading-tight'>Quản lý sức khỏe học đường thông minh</span>
            </div>
            <img
              src='https://healthhub.ancorathemes.com/wp-content/uploads/elementor/thumbs/home1-image2-copyright-qubyhfh92a3ga1pgab9h06kzbrkux6tawleu2pux9s.jpg'
              alt='stethoscope'
              className='rounded-2xl object-cover w-full h-[220px]'
            />
          </div>
          <div className='row-span-2'>
            <img
              src='https://www.unitex.com/wp-content/uploads/2017/06/Unitex-June-Blog-Image-1.jpg'
              alt='doctor'
              className='rounded-2xl object-cover w-full h-[460px]'
            />
          </div>
          <div className='flex flex-col gap-8'>
            <div>
              <span className='uppercase tracking-widest text-sm font-semibold opacity-80 mb-4 block'>
                Nền Tảng Theo Dõi
              </span>
              <h1 className='text-5xl font-extrabold text-gray-900 mb-3 leading-tight'>
                Kết nối phụ huynh và nhà trường
              </h1>
            </div>
            <div className='flex items-start gap-4'>
              <div className='text-blue-500 text-3xl mt-1'>
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
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>Theo dõi sức khỏe</h2>
                <p className='text-gray-600 text-base'>
                  Giúp phụ huynh dễ dàng cập nhật và theo dõi tình trạng sức khỏe của con em mình tại trường học.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='text-blue-500 text-3xl mt-1'>
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
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>Quản lý sự kiện y tế</h2>
                <p className='text-gray-600 text-base'>
                  Hỗ trợ y tá trường học tổ chức và quản lý các sự kiện y tế, tiêm chủng và khám sức khỏe định kỳ.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='text-blue-500 text-3xl mt-1'>
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
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>Thông báo kịp thời</h2>
                <p className='text-gray-600 text-base'>
                  Cập nhật thông tin và gửi thông báo kịp thời về các vấn đề sức khỏe cần lưu ý cho phụ huynh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banner chính */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden mb-16'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center'>
              <h1 className='text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
                Chăm sóc sức khỏe học đường <span className='text-blue-500'>toàn diện</span> cho con bạn
              </h1>
              <p className='text-gray-600 mb-8 text-lg'>
                EduCare là nền tảng kết nối giữa phụ huynh và nhà trường, giúp theo dõi và quản lý thông tin sức khỏe học sinh một cách hiệu quả.
              </p>
              <div className='flex flex-wrap gap-4'>
                <a href='/parent/health-record' className='px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors'>
                  Khai báo hồ sơ
                </a>
              </div>
            </div>
            <div className='w-full md:w-1/2 h-64 md:h-auto relative'>
              <img
                src='https://img.freepik.com/free-photo/female-doctor-holding-medical-records-talking-with-patient-about-medication-sitting-desk-hospital-office-physician-explaining-prescription-drug-expertise-treatment-health-consultation-examination_482257-4169.jpg'
                alt='Y tá trường học'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>

        {/* Thống kê */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white p-6 rounded-xl shadow-sm flex items-center'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11' stroke='#1da1f2' strokeWidth='2' />
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Tổng số học sinh</p>
              <p className='text-2xl font-bold text-gray-900'>1,234</p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm flex items-center'>
            <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mr-4'>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' stroke='#10b981' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Lịch tiêm chủng sắp tới</p>
              <p className='text-2xl font-bold text-gray-900'>25/08/2024</p>
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm flex items-center'>
            <div className='w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mr-4'>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' stroke='#f59e0b' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
            <div>
              <p className='text-gray-500 text-sm'>Khám sức khỏe định kỳ</p>
              <p className='text-2xl font-bold text-gray-900'>14/05/2024</p>
            </div>
          </div>
        </div>

        {/* Tính năng */}
        <div className='mb-12'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Tính năng của nền tảng</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src='https://www.pushengage.com/wp-content/uploads/2023/06/In-App-Notification-Examples.png' 
                  alt='Tiêm chủng' 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Thông báo tiêm chủng</h3>
                <p className='text-gray-600 mb-4'>Cập nhật lịch tiêm chủng và gửi thông báo nhắc nhở cho phụ huynh về các mũi tiêm sắp tới cho học sinh.</p>
                <a href='/parent/vaccination-schedule' className='text-blue-500 font-medium hover:underline'>Xem lịch tiêm chủng →</a>
              </div>
            </div>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src='https://img.freepik.com/free-photo/doctor-measuring-little-girl-s-height_23-2148775915.jpg' 
                  alt='Khám sức khỏe' 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Hồ sơ sức khỏe số</h3>
                <p className='text-gray-600 mb-4'>Lưu trữ và theo dõi thông tin sức khỏe của học sinh như chiều cao, cân nặng, thị lực và các chỉ số quan trọng khác.</p>
                <a href='/parent/medical-plan' className='text-blue-500 font-medium hover:underline'>Xem hồ sơ sức khỏe →</a>
              </div>
            </div>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src='https://img.freepik.com/free-photo/woman-consulting-with-doctor_23-2149211094.jpg' 
                  alt='Tư vấn riêng' 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Đăng ký tư vấn sức khỏe riêng</h3>
                <p className='text-gray-600 mb-4'>Tạo kênh liên lạc trực tiếp giữa phụ huynh và y tá trường học để trao đổi về tình hình sức khỏe của học sinh.</p>
                <a href='/parent/private-consultation' className='text-blue-500 font-medium hover:underline'>Liên hệ →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
