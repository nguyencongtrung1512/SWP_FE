import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import MainLayout from './layouts/MainLayout/MainLayout'
import Login from './pages/login/login'
import ResetPassword from './pages/login/resetPassword'
import Home from './pages/home/home'
import HealthRecord from './pages/parent/healthRecord/healthRecord'
import SendMedicine from './pages/parent/sendMedicine/sendMedicine'
import ProfileParent from './pages/parent/profile/profileParent'
import NurseLayout from './layouts/NurseLayout/NurseLayout'
import HealthRecordCensorship from './pages/nurse/healthRecordCensorship/HealthRecordCensorship'
import ScheduleVaccination from './pages/nurse/scheduleVaccination/ScheduleVaccination'
import ReceiveMedicine from './pages/nurse/receiveMedicine/ReceiveMedicine'
import MedicalReport from './pages/nurse/medicalReport/MedicalReport'
import PrivateConsultation from './pages/nurse/privateConsultation/PrivateConsultation'
import Blog from './pages/parent/blog/blog'
import BlogPost from './pages/parent/blog/blogDetail'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import DashBoardAdmin from './pages/admin/dashBoardAdmin/DashBoardAdmin'
import UserList from './pages/admin/userManagerment/UserList'
import StudentList from './pages/admin/studentManagement/StudentList'
import GradeList from './pages/admin/gradeManagement/GradeList'
import ParentLayout from './layouts/ParentLayout/ParentLayout'
import VaccinationSchedule from './pages/parent/vaccinationSchedule/VaccinationSchedule'
import MedicalEventParent from './pages/parent/medicalEvent/medicalEventParent'
import ProtectedRoute from './components/ProtectedRoute'
import CategoryList from './pages/admin/categoryManagement/List'
import BlogList from './pages/admin/blogManagement/BlogList'
import BlogDetail from './pages/admin/blogManagement/BlogDetail'
import MedicationList from './pages/nurse/Medication/MedicationList'
import MedicalSuppliesList from './pages/nurse/medicalSupplies/medicalSupliesList'
import Vaccination from './pages/admin/vaccineManagement/createVaccine'
import AppointmentPage from './pages/parent/privateConsultation/AppointmentPage'
import HealthCheck from './pages/admin/healthCheckManagement/createHealthCheck'
import MedicalResult from './pages/nurse/resultsAfterVaccination'
import VideoCall from './components/VideoCall'

export default function useRouteElements() {
  const routeElements = useRoutes([
    // MAIN routes
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'reset-password',
          element: <ResetPassword />
        },
        {
          path: 'blog',
          element: <Blog />
        },
        {
          path: 'blog/:id',
          element: <BlogPost />
        }
      ]
    },
    // PARENT routes with protection
    {
      path: '/parent',
      element: <ProtectedRoute requiredRole='Parent' />,
      children: [
        {
          path: '',
          element: <ParentLayout />,
          children: [
            {
              path: 'health-record',
              element: <HealthRecord />
            },
            {
              path: 'send-medicine',
              element: <SendMedicine />
            },
            {
              path: 'appointment',
              element: <AppointmentPage />
            },
            {
              path: 'vaccination-schedule',
              element: <VaccinationSchedule />
            },
            {
              path: 'medical-event',
              element: <MedicalEventParent />
            },
            {
              path: 'profile',
              element: <ProfileParent />
            },
            {
              path: 'private-consultation/video-call/:appointmentId',
              element: <VideoCall /> //userRole="parent"
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
              path: path.HEALTH_RECORD_CENSORSHIP,
              element: <HealthRecordCensorship />
            },
            {
              path: path.MEDICATION,
              element: <MedicationList />
            },
            {
              path: path.SCHEDULE_VACCINATION,
              element: <ScheduleVaccination />
            },
            {
              path: path.MEDICAL_RESULT,
              element: <MedicalResult />
            },
            {
              path: path.RECEIVE_MEDICINE,
              element: <ReceiveMedicine />
            },
            {
              path: path.MEDICAL_REPORT,
              element: <MedicalReport />
            },
            {
              path: path.MEDICAL_SUPPLIES,
              element: <MedicalSuppliesList />
            },
            {
              path: path.PRIVATE_CONSULTATION,
              element: <PrivateConsultation />
            },
            {
              path: 'private-consultation/video-call/:appointmentId',
              element: <VideoCall /> //userRole="nurse" 
            },
            {
              path: path.NURSE_CATEGORY_MANAGEMENT,
              element: <CategoryList />
            },
            {
              path: path.NURSE_BLOG_LIST_BY_CATEGORY,
              element: <BlogList />
            },
            {
              path: path.NURSE_BLOG_DETAIL,
              element: <BlogDetail />
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
              path: path.DASHBOARD_ADMIN,
              element: <DashBoardAdmin />
            },
            {
              path: path.USER_MANAGEMENT,
              element: <UserList />
            },
            {
              path: path.GRADE_MANAGEMENT,
              element: <GradeList />
            },
            {
              path: path.STUDENT_LIST,
              element: <StudentList />
            },
            {
              path: path.CATEGORY_MANAGEMENT,
              element: <CategoryList />
            },
            {
              path: path.BLOG_LIST_BY_CATEGORY,
              element: <BlogList />
            },
            {
              path: path.BLOG_DETAIL,
              element: <BlogDetail />
            },
            {
              path: path.VACCINE_MANAGEMENT,
              element: <Vaccination />
            },
            {
              path: path.HEALTHCHECK_MANAGEMENT,
              element: <HealthCheck />
            }
          ]
        }
      ]
    }
  ])
  return routeElements
}
