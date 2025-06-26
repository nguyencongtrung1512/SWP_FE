import { Pill, Heart } from 'lucide-react'
import NoData from './nodata'

function MedicationNoData() {
  return (
    <NoData
      title='Chưa có đơn thuốc nào'
      description='Phụ huynh chưa có đơn thuốc nào được gửi. Khi có đơn thuốc mới, thông tin sẽ hiển thị tại đây.'
      icon={
        <div className='relative'>
          <Pill className='h-12 w-12 text-blue-500' />
          <Heart className='h-6 w-6 text-red-400 absolute -top-1 -right-1' />
        </div>
      }
    />
  )
}

export default MedicationNoData
