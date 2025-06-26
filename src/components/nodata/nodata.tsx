import type React from 'react'
import { FileX } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'

interface NoDataProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

function NoData({
  title = 'Chưa có dữ liệu',
  description = 'Không có thông tin để hiển thị',
  icon,
  className = ''
}: NoDataProps) {
  return (
    <Card className={`border-0 bg-transparent ${className}`}>
      <CardContent className='flex flex-col items-center justify-center py-16 px-6'>
        <div className='mb-6 p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100'>
          {icon || <FileX className='h-12 w-12 text-blue-500' />}
        </div>

        <h3 className='text-xl font-semibold text-gray-800 mb-2 text-center'>{title}</h3>

        <p className='text-gray-600 text-center max-w-md leading-relaxed'>{description}</p>

        <div className='mt-8 flex space-x-2'>
          <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
          <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse' style={{ animationDelay: '0.2s' }}></div>
          <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' style={{ animationDelay: '0.4s' }}></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NoData
