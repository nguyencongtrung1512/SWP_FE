const path = {
  home: '/home',
  login: '/',
  // ============ Parent ============
  healthRecord: '/health-record',
  sendMedicine: '/send-medicine',
  privateConsultation: '/private-consultation',
  blog: '/blog',
  blogDetail: '/blog/:id',
  profile: '/profile',
  //=============Nurse============
  BASE_NURSE: '/nurse',
  DASHBOARD_NURSE: '/nurse/dashboard',
  HEALTH_RECORD_CENSORSHIP: '/nurse/health-record-censorship',
  SCHEDULE_VACCINATION: '/nurse/schedule-vaccination',
  NURSE_PROFILE: '/nurse/profile',
  RESULTS_AFTER_VACCINATION: '/nurse/results-after-vaccination',
  RECEIVE_MEDICINE: '/nurse/receive-medicine',
  MEDICAL_REPORT: '/nurse/medical-report',
  MEDICAL_PLAN: '/nurse/medical-plan',
  PRIVATE_CONSULTATION: '/nurse/private-consultation',
  //=============Admin============
  BASE_ADMIN: '/admin',
  DASHBOARD_ADMIN: '/admin/dashboard',
  CENSOR_LIST: '/admin/censor-list',
  USER_MANAGEMENT: '/admin/user-management',
  STUDENT_MANAGEMENT: '/admin/student-management',
  GRADE_MANAGEMENT: '/admin/student-management/level/:levelId/grades',
  CLASS_MANAGEMENT: '/admin/student-management/level/:levelId/grade/:gradeId/classes',
  STUDENT_LIST: '/admin/student-management/level/:levelId/grade/:gradeId/class/:classId/students',
}
export default path
