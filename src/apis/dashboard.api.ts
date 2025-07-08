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
  nurseId: number
  name: string
  activityCount: number
}

export const getNurseActivity = (nurseId: number, period: string) => {
  return http.get<DashboardTrends>(`${API_URL}/analytics/nurses/activity-in-1month?nurseId=${nurseId}&period=${period}`)
}

