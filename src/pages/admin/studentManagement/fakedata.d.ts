interface Level {
  id: string
  name: string
  description: string
  totalGrades: number
  totalClasses: number
  totalStudents: number
  status: string
}

interface Grade {
  id: string
  levelId: string
  name: string
  description: string
  totalClasses: number
  totalStudents: number
  status: string
}

interface Classroom {
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

export const levels: Level[]
export const grades: Grade[]
export const classrooms: Classroom[]
export const students: Student[]
