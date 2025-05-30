const path = {
  //===============Public===============
  home: '/home',
  login: '/',
  blog: '/blog',
  blogDetail: '/blog/:id',
  // ============ Parent ============
  profile: '/parent/profile',
  healthRecord: '/parent/health-record', //khai báo sức khỏe của con
  sendMedicine: '/parent/send-medicine', //gửi thuốc
  vaccinationSchedule: '/parent/vaccination-schedule', //lịch tiêm chủng cho con
  vaccinationScheduleDetail: '/parent/vaccination-schedule-detail', //chi tiết thông báo tiêm chủng cho phụ huynh
  historyVaccination: '/parent/history-vaccination', //lịch sử tiêm chủng
  medicalPlan: '/parent/medical-plan', //xem kế hoạch khám bệnh
  medicalPlanDetail: '/parent/medical-plan-detail', //chi tiết kế hoạch khám bệnh
  medicalEvent: '/parent/medical-event', //báo cáo y tế
  medicalEventDetail: '/parent/medical-event-detail', //chi tiết báo cáo y tế- xử lí mang con về hay ???
  privateConsultation: '/parent/private-consultation', //tư vấn riêng

  //=============Nurse============
  BASE_NURSE: '/nurse',
  DASHBOARD_NURSE: '/nurse/dashboard', //trang chủ
  NURSE_PROFILE: '/nurse/profile', //thông tin cá nhân
  HEALTH_RECORD_CENSORSHIP: '/nurse/health-record-censorship', //xác nhận khai báo của phụ huynh 
  SCHEDULE_VACCINATION: '/nurse/schedule-vaccination', //lịch tiêm chủng cho học sinh
  RESULTS_AFTER_VACCINATION: '/nurse/results-after-vaccination', //khai báo kết quả tiêm chủng
  RECEIVE_MEDICINE: '/nurse/receive-medicine', //nhận thuốc
  MEDICAL_REPORT: '/nurse/medical-report', //báo cáo y tế
  MEDICAL_PLAN: '/nurse/medical-plan', //kế hoạch khám bệnh
  PRIVATE_CONSULTATION: '/nurse/private-consultation', //tư vấn riêng
  //=============Admin============
  BASE_ADMIN: '/admin',
  DASHBOARD_ADMIN: '/admin/dashboard',
  CENSOR_LIST: '/admin/censor-list',
  USER_MANAGEMENT: '/admin/user-management',
  GRADE_MANAGEMENT: '/admin/student-management/grades',
  CLASS_MANAGEMENT: '/admin/student-management/grades/:gradeId/classes',
  STUDENT_LIST: '/admin/student-management/classes/:classId/students'
}
export default path
