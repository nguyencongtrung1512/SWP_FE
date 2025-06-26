import React from 'react'
import CreateSendMedicine from './CreateSendMedicine'
import HistorySendMedicine from './HistorySendMedicine'
import { Button } from 'antd'

const MedicineSubmissions: React.FC = () => {
  const [showCreate, setShowCreate] = React.useState(false)
  const formRef = React.useRef<HTMLDivElement>(null)
  const [reloadHistory, setReloadHistory] = React.useState(false)

  const handleShowCreate = () => {
    setShowCreate((prev) => {
      const next = !prev
      if (!prev) {
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100) // Đợi form render xong
      }
      return next
    })
  }

  const handleSuccess = () => {
    setReloadHistory((prev) => !prev)
    setShowCreate(false)
  }

  return (
    <div>
      <div className='mb-4 flex justify-end'>
        <Button type='primary' onClick={handleShowCreate}>
          {showCreate ? 'Hủy form gửi thuốc' : 'Tạo đơn gửi thuốc'}
        </Button>
      </div>
      <HistorySendMedicine reload={reloadHistory} />
      {showCreate && (
        <div ref={formRef}>
          <CreateSendMedicine onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  )
}

export default MedicineSubmissions
