const path = {
  //===============Public===============
  home: '/',
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  blog: '/blog',
  blogDetail: '/blog/:id',
  // ============ Parent ============
  appointment: '/parent/appointment',
  profile: '/parent/profile',
  healthRecord: '/parent/health-record',
  sendMedicine: '/parent/send-medicine',
  vaccinationSchedule: '/parent/vaccination-schedule',
  vaccinationScheduleDetail: '/parent/vaccination-schedule-detail',
  historyVaccination: '/parent/history-vaccination',
  medicalPlan: '/parent/medical-plan',
  medicalPlanDetail: '/parent/medical-plan-detail',
  medicalEvent: '/parent/medical-event',
  medicalEventDetail: '/parent/medical-event-detail',
  privateConsultation: '/parent/private-consultation',

  //=============Nurse============
  BASE_NURSE: '/nurse',
  DASHBOARD_NURSE: '/nurse/dashboard',
  NURSE_PROFILE: '/nurse/profile',
  HEALTH_RECORD_CENSORSHIP: '/nurse/health-record-censorship',
  SCHEDULE_VACCINATION: '/nurse/schedule-vaccination',
  MEDICAL_RESULT: '/nurse/medical-result',
  RECEIVE_MEDICINE: '/nurse/receive-medicine',
  MEDICAL_REPORT: '/nurse/medical-report',
  MEDICATION: '/nurse/medication',
  MEDICAL_PLAN: '/nurse/medical-plan',
  PRIVATE_CONSULTATION: '/nurse/private-consultation',
  MEDICAL_SUPPLIES: '/nurse/medical-supplies',
  MEDICAL_SUPPLIES_CREATE: '/nurse/medical-supplies/create',
  MEDICAL_SUPPLIES_EDIT: '/nurse/medical-supplies/edit/:id',
  NURSE_CATEGORY_MANAGEMENT: '/nurse/category-management',
  NURSE_BLOG_LIST_BY_CATEGORY: '/nurse/category/:categoryId/blogs',
  NURSE_BLOG_DETAIL: '/nurse/blog-detail/:id',
  //=============Admin============
  BASE_ADMIN: '/admin',
  DASHBOARD_ADMIN: '/admin/dashboard',
  CENSOR_LIST: '/admin/censor-list',
  USER_MANAGEMENT: '/admin/user-management',
  GRADE_MANAGEMENT: '/admin/student-management/grades',
  CLASS_MANAGEMENT: '/admin/student-management/grades/:gradeId/classes',
  STUDENT_LIST: '/admin/students/:classId',
  BLOG_MANAGEMENT: '/admin/blog/:id',
  CATEGORY_MANAGEMENT: '/admin/category-management',
  BLOG_LIST_BY_CATEGORY: '/admin/category/:categoryId/blogs',
  BLOG_DETAIL: '/admin/blog-detail/:id',
  VACCINE_MANAGEMENT: '/admin/vaccineManagement',
  HEALTHCHECK_MANAGEMENT: '/admin/healthCheckManagement'
}
export default path
