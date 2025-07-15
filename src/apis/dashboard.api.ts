import http from '../utils/http'

const API_URL = '/admin/dashboard'

export interface StudentDistributionByClass {
  className: string
  count: number
}

export interface StudentDistributionResponse {
  byGender: {
    Female: number
    Male: number
    [key: string]: number
  }
  byAge: {
    [ageRange: string]: number
  }
  byClass: {
    $values: StudentDistributionByClass[]
  }
}

export const getStudentDistribution = () => {
  return http.get<StudentDistributionResponse>('admin/dashboard/analytics/students/distribution')
}

export interface TrendData {
  date: string
  count: number
}

export interface DashboardTrends {
  healthChecks: {
    $values: TrendData[]
  }
  medicalEvents: {
    $values: TrendData[]
  }
  consultations: {
    $values: TrendData[]
  }
  vaccinations: {
    $values: TrendData[]
  }
}

export const getTrends = (period: string) => {
  return http.get<DashboardTrends>(`${API_URL}/trends?period=${period}`)
}

export interface NurseActivity {
  workloadDistribution: {
    healthChecks: number
    medicalEvents: number
    consultations: number
    medicationApprovals: number
  }
}

export interface Nurse {
  id: number
  accountID: number
  fullname: string
}

export const getNurseActivity = (nurseId: number) => {
  return http.get<NurseActivity>(`${API_URL}/analytics/nurses/activity-in-1month?nurseId=${nurseId}&period=1month`)
}

