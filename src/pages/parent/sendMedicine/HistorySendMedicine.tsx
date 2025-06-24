import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Eye, Edit, Calendar as CalendarIcon, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  getRequestHistory,
  updateRequest,
  getRequestById,
  MedicationRequestHistory,
  MedicationRequestUpdate,
  Medication
} from '../../../apis/parentMedicationRequest'
import { toast } from 'react-toastify'

interface DetailedMedicationRequest extends Omit<MedicationRequestHistory, 'medications'> {
  medications: Medication[] | { $values: Medication[] }
  nurseNote?: string
}

function HistorySendMedicine() {
  const [history, setHistory] = useState<MedicationRequestHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; record?: MedicationRequestHistory }>({ open: false })
  const [detailedRecord, setDetailedRecord] = useState<DetailedMedicationRequest | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
            Chờ duyệt
          </Badge>
        )
      case 'Approved':
        return (
          <Badge variant='secondary' className='bg-green-100 text-green-800'>
            Đã duyệt
          </Badge>
        )
      case 'Rejected':
        return <Badge variant='destructive'>Đã từ chối</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await getRequestHistory()
      setHistory(res.$values || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleOpenModal = async (record: MedicationRequestHistory) => {
    setModal({ open: true, record })
    setIsEditing(false)
    form.reset()
    try {
      const detail = await getRequestById(record.requestId)
      setDetailedRecord(detail)
      const meds = Array.isArray(detail.medications) ? detail.medications : detail.medications?.$values || []
      const mappedMeds = meds.map((m: Medication) => ({
        name: m.name,
        type: m.type,
        usage: m.usage,
        dosage: m.dosage,
        expiredDate: m.expiredDate ? new Date(m.expiredDate) : undefined,
        note: m.note || ''
      }))
      form.reset({
        parentNote: detail.parentNote,
        medications: mappedMeds
      })
    } catch (e) {
      console.error(e)
      toast.error('Không thể tải chi tiết.')
    }
  }

  const handleCloseModal = () => {
    setModal({ open: false })
    setIsEditing(false)
    setDetailedRecord(null)
  }

  const handleSaveSubmit = async (values: { parentNote: string; medications: Medication[] }) => {
    if (!modal.record) return
    setIsSaving(true)
    try {
      const data: MedicationRequestUpdate = {
        parentNote: values.parentNote,
        medications: values.medications.map((m) => ({
          ...m,
          expiredDate: m.expiredDate ? format(new Date(m.expiredDate), 'yyyy-MM-dd') : ''
        }))
      }
      await updateRequest(modal.record.requestId, data)
      toast.success('Cập nhật thành công!')
      handleCloseModal()
      fetchHistory()
    } catch (e) {
      console.error(e)
      toast.error('Cập nhật thất bại!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-100 p-6'>
      <Card className='shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg'>
          <CardTitle className='text-2xl font-bold flex items-center gap-2'>
            <CalendarIcon className='h-6 w-6' />
            Lịch sử gửi thuốc
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <span className='ml-3 text-gray-600'>Đang tải...</span>
            </div>
          ) : (
            <div className='rounded-lg border border-gray-200 overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50'>
                    <TableHead className='font-semibold'>Ngày tạo</TableHead>
                    <TableHead className='font-semibold'>Học sinh</TableHead>
                    <TableHead className='font-semibold'>Tên thuốc</TableHead>
                    <TableHead className='font-semibold'>Trạng thái</TableHead>
                    <TableHead className='font-semibold text-center'>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.requestId} className='hover:bg-gray-50 transition-colors'>
                      <TableCell className='font-medium'>
                        {format(new Date(record.dateCreated), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>
                        {(Array.isArray(record.medications) ? record.medications : record.medications?.$values || [])
                          .map((m: Medication) => m.name)
                          .join(', ')}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleOpenModal(record)}
                          className='hover:bg-blue-50 hover:border-blue-300'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modal.open} onOpenChange={handleCloseModal}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-gray-800'>
              {isEditing ? 'Chỉnh sửa gửi thuốc' : 'Chi tiết gửi thuốc'}
            </DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='parentNote'
                  rules={{ required: 'Nhập lý do!' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>Lý do dùng thuốc</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Nhập lý do sử dụng thuốc...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Medications form fields */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800 border-b pb-2'>Thông tin thuốc</h3>
                  {detailedRecord && (
                    <div className='space-y-4'>
                      {(Array.isArray(detailedRecord.medications)
                        ? detailedRecord.medications
                        : detailedRecord.medications?.$values || []
                      ).map((medication: Medication, index: number) => (
                        <Card key={index} className='p-4 border border-gray-200'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                              control={form.control}
                              name={`medications.${index}.name`}
                              rules={{ required: 'Nhập tên thuốc!' }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tên thuốc</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.type`}
                              rules={{ required: 'Nhập dạng thuốc!' }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dạng thuốc</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.dosage`}
                              rules={{ required: 'Nhập liều lượng!' }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Liều lượng</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.usage`}
                              rules={{ required: 'Nhập cách dùng!' }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cách dùng</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`medications.${index}.note`}
                              render={({ field }) => (
                                <FormItem className='md:col-span-2'>
                                  <FormLabel>Ghi chú</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </Form>
          ) : (
            detailedRecord && (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-600'>Học sinh</label>
                    <p className='text-gray-800 bg-gray-50 p-2 rounded'>{detailedRecord.studentName}</p>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-600'>Ngày gửi</label>
                    <p className='text-gray-800 bg-gray-50 p-2 rounded'>
                      {format(new Date(detailedRecord.dateCreated), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-600'>Trạng thái</label>
                    <div className='bg-gray-50 p-2 rounded'>{getStatusBadge(detailedRecord.status)}</div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-600'>Lý do của phụ huynh</label>
                  <p className='text-gray-800 bg-gray-50 p-3 rounded'>{detailedRecord.parentNote}</p>
                </div>

                {detailedRecord.nurseNote && (
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-600'>Ghi chú của y tá</label>
                    <p className='text-gray-800 bg-blue-50 p-3 rounded border-l-4 border-blue-400'>
                      {detailedRecord.nurseNote}
                    </p>
                  </div>
                )}

                <div className='space-y-4'>
                  <label className='text-sm font-semibold text-gray-600'>Danh sách thuốc</label>
                  <div className='space-y-3'>
                    {(Array.isArray(detailedRecord.medications)
                      ? detailedRecord.medications
                      : detailedRecord.medications?.$values || []
                    ).map((medication: Medication, index: number) => (
                      <Card
                        key={index}
                        className='p-4 border border-gray-200 bg-gradient-to-r from-green-50 to-blue-50'
                      >
                        <div className='space-y-2'>
                          <h4 className='font-semibold text-lg text-gray-800'>{medication.name}</h4>
                          <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                              <span className='font-medium text-gray-600'>Dạng thuốc:</span>
                              <span className='ml-2 text-gray-800'>{medication.type}</span>
                            </div>
                            <div>
                              <span className='font-medium text-gray-600'>Liều lượng:</span>
                              <span className='ml-2 text-gray-800'>{medication.dosage}</span>
                            </div>
                          </div>
                          <div className='text-sm'>
                            <span className='font-medium text-gray-600'>Cách dùng:</span>
                            <span className='ml-2 text-gray-800'>{medication.usage}</span>
                          </div>
                          {medication.expiredDate && (
                            <div className='text-sm'>
                              <span className='font-medium text-gray-600'>HSD:</span>
                              <span className='ml-2 text-gray-800'>
                                {format(new Date(medication.expiredDate), 'dd/MM/yyyy', { locale: vi })}
                              </span>
                            </div>
                          )}
                          {medication.note && (
                            <div className='text-sm'>
                              <span className='font-medium text-gray-600'>Ghi chú:</span>
                              <span className='ml-2 italic text-gray-700'>{medication.note}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          <DialogFooter className='gap-2'>
            {isEditing ? (
              <>
                <Button variant='outline' onClick={() => setIsEditing(false)}>
                  <X className='h-4 w-4 mr-2' />
                  Hủy
                </Button>
                <Button
                  onClick={form.handleSubmit(handleSaveSubmit)}
                  disabled={isSaving}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                >
                  {isSaving ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  ) : (
                    <Save className='h-4 w-4 mr-2' />
                  )}
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <Button variant='outline' onClick={handleCloseModal}>
                  Đóng
                </Button>
                <Button
                  disabled={modal.record?.status !== 'Pending'}
                  onClick={() => setIsEditing(true)}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                >
                  <Edit className='h-4 w-4 mr-2' />
                  Chỉnh sửa
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HistorySendMedicine
