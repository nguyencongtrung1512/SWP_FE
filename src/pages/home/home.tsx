import { useEffect } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 120,
    })
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12'>
      <div className='w-full max-w-[1450px] px-4 md:px-8 lg:px-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16'>
          <div className='flex flex-col gap-8'>
            <div className='bg-[#0094f6] rounded-2xl p-8 text-white min-h-[220px] flex flex-col justify-between' data-aos='fade-down-right' data-aos-delay='300'>
              <span className='uppercase tracking-widest text-sm font-semibold opacity-80 mb-4'>Nền Tảng Theo Dõi</span>
              <span className='text-3xl font-bold leading-tight'>Quản lý sức khỏe học đường thông minh</span>
            </div>
            <img
              src='https://healthhub.ancorathemes.com/wp-content/uploads/elementor/thumbs/home1-image2-copyright-qubyhfh92a3ga1pgab9h06kzbrkux6tawleu2pux9s.jpg'
              alt='stethoscope'
              className='rounded-2xl object-cover w-full h-[220px]'
              data-aos='fade-down-right' data-aos-delay='500'
            />
          </div>
          <div className='row-span-2' data-aos='fade-down-right' data-aos-delay='600'>
            <img
              src='https://www.unitex.com/wp-content/uploads/2017/06/Unitex-June-Blog-Image-1.jpg'
              alt='doctor'
              className='rounded-2xl object-cover w-full h-[460px]'
            />
          </div>
          <div className='flex flex-col gap-8'>
            <div data-aos='fade-down-right' data-aos-delay='700'>
              <h1 className='text-5xl font-extrabold text-gray-900 mb-3 leading-tight'>
                Kết nối phụ huynh và nhà trường
              </h1>
            </div>
            <div className='flex items-start gap-4' data-aos='fade-down-right' data-aos-delay='800'>
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
            <div className='flex items-start gap-4' data-aos='fade-down-right' data-aos-delay='900'>
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
            <div className='flex items-start gap-4' data-aos='fade-down-right' data-aos-delay='1000'>
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

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden mb-24' data-aos='fade-right' data-aos-delay='200'>
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

        <div className='mb-24'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 mb-16'>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-12 items-start'>
              <div className='lg:col-span-3 relative' data-aos='fade-right' data-aos-delay='100'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3'></div>
                <div className='relative bg-white rounded-2xl overflow-hidden shadow-2xl'>
                  <img
                    src='https://ksbtdanang.vn/uploads/chuyen-mon/2022_04/tc-tre-em-4.jpg'
                    alt='Tiêm chủng trẻ em'
                    className='w-full h-80 object-cover'
                  />
                  <div className='p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                    <h4 className='font-bold text-lg mb-2'>Tiêm Chủng An Toàn</h4>
                    <p className='text-sm opacity-90'>Được thực hiện bởi đội ngũ y tá</p>
                  </div>
                </div>
              </div>
              
              <div className='lg:col-span-2 space-y-8'>
                <div className='mb-8 ml-10' data-aos='fade-right' data-aos-delay='200'>
                  <h2 className='text-4xl font-bold text-gray-900 mb-4'>Quy Trình <span className='text-blue-400'>Tiêm Chủng</span></h2>
                </div>
                
                <div className='flex items-start space-x-4 relative' data-aos='fade-right' data-aos-delay='300'>
                  <div className='flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg relative'>
                    1
                    <div className='absolute left-1/2 top-12 w-1 h-8 bg-blue-300 transform -translate-x-1/2'></div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Gửi Phiếu Thông Báo Đồng Ý</h3>
                    <p className='text-gray-600 text-sm'>Phụ huynh vào mục Lịch Y tế xác nhận cho con em tiêm.</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4 relative' data-aos='fade-right' data-aos-delay='400'>
                  <div className='flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg relative'>
                    2
                    <div className='absolute left-1/2 top-12 w-1 h-8 bg-blue-300 transform -translate-x-1/2'></div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Chuẩn Bị Danh Sách</h3>
                    <p className='text-gray-600 text-sm'>Tổng hợp danh sách học sinh đã được xác nhận tiêm chủng.</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4 relative' data-aos='fade-right' data-aos-delay='500'>
                  <div className='flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg relative'>
                    3
                    <div className='absolute left-1/2 top-12 w-1 h-8 bg-blue-300 transform -translate-x-1/2'></div>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Tiêm Chủng và Ghi Nhận</h3>
                    <p className='text-gray-600 text-sm'>Thực hiện tiêm chủng và ghi nhận kết quả vào hệ thống.</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4 relative' data-aos='fade-right' data-aos-delay='600'>
                  <div className='flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg'>
                    4
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-1'>Theo Dõi Sau Tiêm</h3>
                    <p className='text-gray-600 text-sm'>Theo dõi phản ứng sau tiêm và thông báo với phụ huynh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6' data-aos='fade-left' data-aos-delay='100'>Tính năng của nền tảng</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden' data-aos='fade-left' data-aos-delay='200'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src='https://www.pushengage.com/wp-content/uploads/2023/06/In-App-Notification-Examples.png' 
                  alt='Tiêm chủng' 
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>Thông báo sự kiện y tế</h3>
                <p className='text-gray-600 mb-4'>Cập nhật lịch sự kiện y tế và gửi thông báo nhắc nhở cho phụ huynh về các sự kiện sắp tới của học sinh.</p>
                <a href='/parent/vaccination-schedule' className='text-blue-500 font-medium hover:underline'>Xem lịch tiêm chủng →</a>
              </div>
            </div>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden' data-aos='fade-left' data-aos-delay='400'>
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
                <a href='/parent/profile' className='text-blue-500 font-medium hover:underline'>Xem hồ sơ sức khỏe →</a>
              </div>
            </div>
            <div className='bg-white rounded-xl shadow-sm overflow-hidden' data-aos='fade-left' data-aos-delay='600'>
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
                <a href='/parent/appointment' className='text-blue-500 font-medium hover:underline'>Liên hệ →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
