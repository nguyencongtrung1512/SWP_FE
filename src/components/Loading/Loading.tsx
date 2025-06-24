
function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-200 flex items-center justify-center'>
      <div className='bg-white/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 backdrop-blur-md'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-b-4 border-cyan-400 flex items-center justify-center mb-2'>
          <span className='text-4xl'>🏥</span>
        </div>
        <div className='text-lg font-semibold text-blue-700 tracking-wide animate-pulse'>Đang tải dữ liệu...</div>
      </div>
    </div>
  )
}

export default Loading
