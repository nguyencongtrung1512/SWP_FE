import React from 'react'
import { Check, X, Calendar, Clock } from 'lucide-react'
import { Button } from '../../../components/ui/button'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentDetails?: {
    date?: string
    time?: string
    consultant?: string
  }
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, appointmentDetails }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100 animate-in fade-in zoom-in'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors'
        >
          <X className='w-5 h-5 text-gray-500' />
        </button>

        {/* Content */}
        <div className='p-8 text-center'>
          {/* Success Icon */}
          <div className='mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6'>
            <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse'>
              <Check className='w-7 h-7 text-white' strokeWidth={3} />
            </div>
          </div>

          {/* Title */}
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Đặt lịch thành công!</h2>

          {/* Description */}
          <p className='text-gray-600 mb-6 leading-relaxed'>
            Cảm ơn bạn đã đặt lịch tư vấn. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận thông tin.
          </p>

          {/* Appointment Details */}
          {appointmentDetails && (
            <div className='bg-gray-50 rounded-xl p-4 mb-6 space-y-3'>
              <h3 className='font-semibold text-gray-900 mb-3'>Thông tin lịch hẹn:</h3>

              {appointmentDetails.date && (
                <div className='flex items-center justify-center gap-2 text-gray-700'>
                  <Calendar className='w-4 h-4 text-blue-500' />
                  <span>{appointmentDetails.date}</span>
                </div>
              )}

              {appointmentDetails.time && (
                <div className='flex items-center justify-center gap-2 text-gray-700'>
                  <Clock className='w-4 h-4 text-blue-500' />
                  <span>{appointmentDetails.time}</span>
                </div>
              )}

              {appointmentDetails.consultant && (
                <div className='text-gray-700'>
                  <span className='font-medium'>Tư vấn viên: </span>
                  {appointmentDetails.consultant}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className='space-y-3'>
            <Button
              onClick={() => {
              onClose();
              window.location.reload();
            }}

              className='w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors'
            >
              Hoàn tất
            </Button>

          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl' />
      </div>
    </div>
  )
}

export default SuccessModal
