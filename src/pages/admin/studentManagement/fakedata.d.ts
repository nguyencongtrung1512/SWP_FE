interface Grade {
  id: string
  levelId: string
  name: string
  description: string
  totalClasses: number
  totalStudents: number
  status: string
}

interface Classes {
  id: string
  gradeId: string
  name: string
  teacher: string
  totalStudents: number
  capacity: number
  description: string
  status: string
}

interface Student {
  id: string
  studentCode: string
  fullName: string
  dateOfBirth: string
  gender: string
  gradeId: string
  classroomId: string
  parentName: string
  parentPhone: string
  address: string
  status: string
  healthStatus: string
}

export const grades: Grade[]
export const classes: Classes[]
export const students: Student[]
