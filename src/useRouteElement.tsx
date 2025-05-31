import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout/MainLayout'
import Login from './pages/login/login'
import Home from './pages/home/home'
import HealthRecord from './pages/parent/healthRecord/healthRecord'
import SendMedicine from './pages/parent/sendMedicine/sendMedicine'
import ProfileParent from './pages/parent/profile/profileParent'
import NurseLayout from './layouts/NurseLayout/NurseLayout'
import HealthRecordCensorship from './pages/nurse/healthRecordCensorship/HealthRecordCensorship'
import NurseProfile from './pages/nurse/nurseProfile/NurseProfile'
import ScheduleVaccination from './pages/nurse/scheduleVaccination/ScheduleVaccination'
import ResultsAfterVaccination from './pages/nurse/resultsAfterVaccination'
import ReceiveMedicine from './pages/nurse/receiveMedicine/ReceiveMedicine'
import MedicalReport from './pages/nurse/medicalReport/MedicalReport'
import DashBoardNurse from './pages/nurse/dashboardNurse/DashBoardNurse'
import PrivateConsultation from './pages/nurse/privateConsultation/PrivateConsultation'
import Blog from './pages/parent/blog/blog'
import BlogPost from './pages/parent/blog/[id]'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import DashBoardAdmin from './pages/admin/dashBoardAdmin/DashBoardAdmin'
import CensorList from './pages/admin/censorManagement/CensorList'
import MedicalPlan from './pages/nurse/medicalPlan'
import UserList from './pages/admin/userManagerment/UserList'
import StudentList from './pages/admin/studentManagement/StudentList'
import GradeList from './pages/admin/gradeManagement/GradeList'
import ClassList from './pages/admin/classroomManagement/Classlist'
import ParentLayout from './layouts/ParentLayout/ParentLayout'
import VaccinationSchedule from './pages/parent/vaccinationSchedule/VaccinationSchedule'
import MedicalEventParent from './pages/parent/medicalEvent/medicalEventParent'
import ProtectedRoute from './components/ProtectedRoute'

export default function useRouteElements() {
  const routeElements = useRoutes([
    // MAIN routes
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.home,
          element: <Home />
        },
        {
          path: path.login,
          element: <Login />
        },
        {
          path: path.blog,
          element: <Blog />
        },
        {
          path: path.blogDetail,
          element: <BlogPost />
        }
      ]
    },
    // PARENT routes with protection
    {
      path: '',
      element: <ProtectedRoute requiredRole='Parent' />,
      children: [
        {
          path: '',
          element: <ParentLayout />,
          children: [
            {
              path: path.healthRecord,
              element: <HealthRecord />
            },
            {
              path: path.sendMedicine,
              element: <SendMedicine />
            },
            {
              path: path.privateConsultation,
              element: <PrivateConsultation />
            },
            {
              path: path.vaccinationSchedule,
              element: <VaccinationSchedule />
            },
            {
              path: path.medicalEvent,
              element: <MedicalEventParent />
            },
            {
              path: path.profile,
              element: <ProfileParent />
            }
          ]
        }
      ]
    },
    //================ NURSE routes ================
    {
      path: path.BASE_NURSE,
      element: <ProtectedRoute requiredRole='Nurse' />,
      children: [
        {
          path: '',
          element: <NurseLayout />,
          children: [
            {
              path: '',
              element: <DashBoardNurse />
            },
            {
              path: 'dashboard',
              element: <DashBoardNurse />
            },
            {
              path: 'health-record-censorship',
              element: <HealthRecordCensorship />
            },
            {
              path: 'profile',
              element: <NurseProfile />
            },
            {
              path: 'schedule-vaccination',
              element: <ScheduleVaccination />
            },
            {
              path: 'results-after-vaccination',
              element: <ResultsAfterVaccination />
            },
            {
              path: 'receive-medicine',
              element: <ReceiveMedicine />
            },
            {
              path: 'medical-report',
              element: <MedicalReport />
            },
            {
              path: 'medical-plan',
              element: <MedicalPlan />
            },
            {
              path: 'private-consultation',
              element: <PrivateConsultation />
            }
          ]
        }
      ]
    },
    //================ ADMIN routes ================
    {
      path: path.BASE_ADMIN,
      element: <ProtectedRoute requiredRole='Admin' />,
      children: [
        {
          path: '',
          element: <AdminLayout />,
          children: [
            {
              path: '',
              element: <DashBoardAdmin />
            },
            {
              path: 'dashboard',
              element: <DashBoardAdmin />
            },
            {
              path: 'censor-list',
              element: <CensorList />
            },
            {
              path: 'user-management',
              element: <UserList />
            },
            {
              path: 'student-management/grades',
              element: <GradeList />
            },
            {
              path: 'student-management/grades/:gradeId/classes',
              element: <ClassList />
            },
            {
              path: 'student-management/classes/:classId/students',
              element: <StudentList />
            }
          ]
        }
      ]
    }
  ])
  return routeElements
}
