export const levels = [
  {
    id: '1',
    name: 'Tiểu học',
    description: 'Cấp Tiểu học - Năm học 2023-2024',
    totalGrades: 5,
    totalClasses: 20,
    totalStudents: 600,
    status: 'active'
  },
  {
    id: '2',
    name: 'THCS',
    description: 'Cấp Trung học cơ sở - Năm học 2023-2024',
    totalGrades: 4,
    totalClasses: 16,
    totalStudents: 480,
    status: 'active'
  }
]

export const grades = [
  {
    id: '1',
    levelId: '1',
    name: 'Lớp 1',
    description: 'Khối lớp 1 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 120,
    status: 'active'
  },
  {
    id: '2',
    levelId: '1',
    name: 'Lớp 2',
    description: 'Khối lớp 2 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 115,
    status: 'active'
  },
  {
    id: '3',
    levelId: '2',
    name: 'Lớp 6',
    description: 'Khối lớp 6 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 120,
    status: 'active'
  },
  {
    id: '4',
    levelId: '2',
    name: 'Lớp 7',
    description: 'Khối lớp 7 - Năm học 2023-2024',
    totalClasses: 4,
    totalStudents: 120,
    status: 'active'
  }
]

export const classrooms = [
  {
    id: '1',
    gradeId: '1',
    name: '1A',
    teacher: 'Nguyễn Văn A',
    totalStudents: 30,
    capacity: 35,
    description: 'Lớp 1A - Năm học 2023-2024',
    status: 'active'
  },
  {
    id: '2',
    gradeId: '1',
    name: '1B',
    teacher: 'Trần Thị B',
    totalStudents: 28,
    capacity: 35,
    description: 'Lớp 1B - Năm học 2023-2024',
    status: 'active'
  },
  {
    id: '3',
    gradeId: '3',
    name: '6A',
    teacher: 'Lê Văn C',
    totalStudents: 32,
    capacity: 35,
    description: 'Lớp 6A - Năm học 2023-2024',
    status: 'active'
  },
  {
    id: '4',
    gradeId: '3',
    name: '6B',
    teacher: 'Phạm Thị D',
    totalStudents: 30,
    capacity: 35,
    description: 'Lớp 6B - Năm học 2023-2024',
    status: 'active'
  }
]

export const students = [
  {
    id: '1',
    studentCode: 'HS001',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '2015-05-15',
    gender: 'male',
    gradeId: '1',
    classroomId: '1',
    parentName: 'Nguyễn Văn B',
    parentPhone: '0123456789',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    status: 'active',
    healthStatus: 'normal'
  },
  {
    id: '2',
    studentCode: 'HS002',
    fullName: 'Trần Thị B',
    dateOfBirth: '2015-08-20',
    gender: 'female',
    gradeId: '1',
    classroomId: '1',
    parentName: 'Trần Thị C',
    parentPhone: '0987654321',
    address: '456 Đường DEF, Quận UVW, TP.HCM',
    status: 'active',
    healthStatus: 'special'
  },
  {
    id: '3',
    studentCode: 'HS003',
    fullName: 'Lê Văn C',
    dateOfBirth: '2012-03-10',
    gender: 'male',
    gradeId: '3',
    classroomId: '3',
    parentName: 'Lê Văn D',
    parentPhone: '0123456788',
    address: '789 Đường GHI, Quận RST, TP.HCM',
    status: 'active',
    healthStatus: 'normal'
  }
]
