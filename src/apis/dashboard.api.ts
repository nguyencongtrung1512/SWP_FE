import http from '../utils/http'

export interface StudentDistributionByClass {
  className: string;
  count: number;
}

export interface StudentDistributionResponse {
  byGender: {
    Female: number;
    Male: number;
    [key: string]: number;
  };
  byAge: {
    [ageRange: string]: number;
  };
  byClass: {
    $values: StudentDistributionByClass[];
  };
}

export const getStudentDistribution = () => {
  return http.get<StudentDistributionResponse>('admin/dashboard/analytics/students/distribution');
}
