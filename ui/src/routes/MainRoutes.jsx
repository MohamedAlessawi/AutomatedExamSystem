// src/routes/MainRoutes.jsx
import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import ProtectedRoute from 'components/ProtectedRoute';
import AdminRegister from "../views/pages/AdminRegister.jsx";
import StudentRoutes from './StudentRoutes.jsx';

// ==============================|| DASHBOARD ||============================== //
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));

// ==============================|| USER MANAGEMENT PAGES ||============================== //
const TeachersPage = Loadable(lazy(() => import('views/users/TeachersPage')));
const StudentsPage = Loadable(lazy(() => import('views/users/StudentsPage')));
const TeacherDetail = Loadable(lazy(() => import('views/users/TeacherDetail')));
const StudentDetail = Loadable(lazy(() => import('views/users/StudentDetail')));
const EditTeacher = Loadable(lazy(() => import('views/users/EditTeacher')));
const EditStudent = Loadable(lazy(() => import('views/users/EditStudent')));

// ==============================|| TEACHER FUNCTIONALITY PAGES ||============================== //

// Question Banks
const QuestionBanks = Loadable(lazy(() => import('views/teacher/QuestionBanks')));
const QuestionBankDetail = Loadable(lazy(() => import('views/teacher/QuestionBankDetail')));
const QuestionBankForm = Loadable(lazy(() => import('views/teacher/QuestionBankForm')));

// Questions
const Questions = Loadable(lazy(() => import('views/teacher/Questions')));
const QuestionDetail = Loadable(lazy(() => import('views/teacher/QuestionDetail')));
const QuestionForm = Loadable(lazy(() => import('views/teacher/QuestionForm')));

// Exams
const Exams = Loadable(lazy(() => import('views/teacher/Exams')));
const ExamDetail = Loadable(lazy(() => import('views/teacher/ExamDetail')));
const ExamForm = Loadable(lazy(() => import('views/teacher/ExamForm')));

// Objections
const Objections = Loadable(lazy(() => import('views/teacher/Objections')));

// Teacher's Student View
const TeacherStudents = Loadable(lazy(() => import('views/teacher/Students')));
const TeacherStudentDetail = Loadable(lazy(() => import('views/teacher/StudentDetail')));


// ==============================|| UTILITIES PAGES ||============================== //
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },

    // ==============================|| USER MANAGEMENT ROUTES ||============================== //
    {
      path: '/dashboard/admin-register',
      element: <AdminRegister />
    },
    {
      path: '/dashboard/teachers',
      element: <TeachersPage />
    },
    {
      path: '/dashboard/students',
      element: <StudentsPage />
    },
    {
      path: '/dashboard/view-teacher/:id',
      element: <TeacherDetail />
    },
    {
      path: '/dashboard/view-student/:id',
      element: <StudentDetail />
    },
    {
      path: '/dashboard/edit-teacher/:id',
      element: <EditTeacher />
    },
    {
      path: '/dashboard/edit-student/:id',
      element: <EditStudent />
    },

    // ==============================|| QUESTION BANK ROUTES ||============================== //
    {
      path: '/dashboard/question-banks',
      element: <QuestionBanks />
    },
    {
      path: '/dashboard/question-banks/:id',
      element: <QuestionBankDetail />
    },
    {
      path: '/dashboard/question-banks/create',
      element: <QuestionBankForm />
    },
    {
      path: '/dashboard/question-banks/edit/:id',
      element: <QuestionBankForm />
    },

    // ==============================|| QUESTION ROUTES ||============================== //
    {
      path: '/dashboard/questions',
      element: <Questions />
    },
    {
      path: '/dashboard/questions/:id',
      element: <QuestionDetail />
    },
    {
      path: '/dashboard/questions/create',
      element: <QuestionForm />
    },
    {
      path: '/dashboard/questions/:id/edit',
      element: <QuestionForm />
    },

    // ==============================|| EXAM ROUTES ||============================== //
    {
      path: '/dashboard/exams',
      element: <Exams />
    },
    {
      path: '/dashboard/exams/:id',
      element: <ExamDetail />
    },
    {
      path: '/dashboard/exams/create',
      element: <ExamForm />
    },
    {
      path: '/dashboard/exams/:id/edit',
      element: <ExamForm />
    },

    // ==============================|| OTHER TEACHER ROUTES ||============================== //
    {
      path: '/dashboard/objections',
      element: <Objections />
    },
    {
      path: '/dashboard/teacher-students',
      element: <TeacherStudents />
    },
    {
      path: '/dashboard/teacher-students/:id',
      element: <TeacherStudentDetail />
    },

    // ==============================|| UTILITIES ROUTES ||============================== //
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: 'components',
      children: [
        {
          path: 'typography',
          element: <UtilsTypography />
        }
      ]
    },
    ...StudentRoutes
  ]
};

export default MainRoutes;