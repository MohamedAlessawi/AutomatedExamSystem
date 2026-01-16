// src/routes/StudentRoutes.jsx
import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

// Student routing
const CurrentExams = Loadable(lazy(() => import('views/student/CurrentExams')));
const ExamHistory = Loadable(lazy(() => import('views/student/ExamHistory')));
const ExamTaking = Loadable(lazy(() => import('views/student/ExamTaking')));
const ExamResults = Loadable(lazy(() => import('views/student/ExamResults')));

// ==============================|| STUDENT ROUTING ||============================== //

const StudentRoutes = [
  {
    path: '/dashboard/student/current-exams',
    element: <CurrentExams />
  },
  {
    path: '/dashboard/student/exam-history',
    element: <ExamHistory />
  },
  {
    path: '/dashboard/student/exam/:id',
    element: <ExamTaking />
  },
  {
    path: '/dashboard/student/exam-results/:id',
    element: <ExamResults />
  }
];

export default StudentRoutes;