import { Card, CardContent } from '../../../components/ui/card'

interface Nurse {
  accountID: number
  fullname: string
  email: string
  phoneNumber: string
  image?: string | null
}

interface NurseCardProps {
  nurse: Nurse
  isSelected: boolean
  onSelect: (nurseId: number) => void
}

const NurseCard = ({ nurse, isSelected, onSelect }: NurseCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
        }`}
      onClick={() => onSelect(nurse.accountID)}
    >
      <CardContent className='p-4'>
        <div className='flex items-center space-x-3'>
          <img
            src={
              nurse.image
                ? `data:image/png;base64,${nurse.image}`
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm8UvwNxX9OZn524JCfZXSvNYRYwu_55RO0w&s'
            }
            alt={nurse.fullname}
            className='w-12 h-12 rounded-full object-cover'
          />
          <div className='flex-1'>
            <h3 className='font-medium text-gray-900'>{nurse.fullname}</h3>
            <p className='text-sm text-gray-600'>Email: {nurse.email}</p>
            <p className='text-sm text-gray-600'>SĐT: {nurse.phoneNumber}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NurseCard
