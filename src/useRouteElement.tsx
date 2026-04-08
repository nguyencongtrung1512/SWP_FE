import { useRoutes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import path from './constants/path'
import Loading from './components/Loading/Loading'

const MainLayout = lazy(() => import('./layouts/MainLayout/MainLayout'))
const Login = lazy(() => import('./pages/login/login'))
const ResetPassword = lazy(() => import('./pages/login/resetPassword'))
const Home = lazy(() => import('./pages/home/home'))
const HealthRecord = lazy(() => import('./pages/parent/healthRecord/healthRecord'))
const SendMedicine = lazy(() => import('./pages/parent/sendMedicine/sendMedicine'))
const ProfileParent = lazy(() => import('./pages/parent/profile/profileParent'))
const NurseLayout = lazy(() => import('./layouts/NurseLayout/NurseLayout'))
const HealthRecordCensorship = lazy(() => import('./pages/nurse/healthRecordCensorship/HealthRecordCensorship'))
const ScheduleVaccination = lazy(() => import('./pages/nurse/scheduleVaccination/ScheduleVaccination'))
const ReceiveMedicine = lazy(() => import('./pages/nurse/receiveMedicine/ReceiveMedicine'))
const MedicalReport = lazy(() => import('./pages/nurse/medicalReport/MedicalReport'))
const PrivateConsultation = lazy(() => import('./pages/nurse/privateConsultation/PrivateConsultation'))
const Blog = lazy(() => import('./pages/parent/blog/blog'))
const BlogPost = lazy(() => import('./pages/parent/blog/blogDetail'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout/AdminLayout'))
const DashBoardAdmin = lazy(() => import('./pages/admin/dashBoardAdmin/DashBoardAdmin'))
const UserList = lazy(() => import('./pages/admin/userManagerment/UserList'))
const StudentList = lazy(() => import('./pages/admin/studentManagement/StudentList'))
const GradeList = lazy(() => import('./pages/admin/gradeManagement/GradeList'))
const ParentLayout = lazy(() => import('./layouts/ParentLayout/ParentLayout'))
const VaccinationSchedule = lazy(() => import('./pages/parent/vaccinationSchedule/VaccinationSchedule'))
const MedicalEventParent = lazy(() => import('./pages/parent/medicalEvent/medicalEventParent'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
const CategoryList = lazy(() => import('./pages/admin/categoryManagement/List'))
const BlogList = lazy(() => import('./pages/admin/blogManagement/BlogList'))
const BlogDetail = lazy(() => import('./pages/admin/blogManagement/BlogDetail'))
const MedicationList = lazy(() => import('./pages/nurse/Medication/MedicationList'))
const MedicalSuppliesList = lazy(() => import('./pages/nurse/medicalSupplies/medicalSupliesList'))
const Vaccination = lazy(() => import('./pages/admin/vaccineManagement/createVaccine'))
const AppointmentPage = lazy(() => import('./pages/parent/privateConsultation/AppointmentPage'))
const HealthCheck = lazy(() => import('./pages/admin/healthCheckManagement/createHealthCheck'))
const MedicalResult = lazy(() => import('./pages/nurse/resultsAfterVaccination'))
const VideoCall = lazy(() => import('./components/VideoCall'))

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
  return <Suspense fallback={<Loading />}>{routeElements}</Suspense>
}
