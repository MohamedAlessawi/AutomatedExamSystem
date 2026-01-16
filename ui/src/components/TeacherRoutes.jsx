// src/routes/TeacherRoutes.jsx
import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';

// teacher routing
const QuestionBanks = Loadable(lazy(() => 'src/views/teacher/QuestionBanks'));
const QuestionBankDetail = Loadable(lazy(() => 'src/views/teacher/QuestionBankDetail'));
const QuestionBankForm = Loadable(lazy(() => 'src/views/teacher/QuestionBankForm'));
const Questions = Loadable(lazy(() => 'src/views/teacher/Questions'));
const QuestionDetail = Loadable(lazy(() => 'src/views/teacher/QuestionDetail'));
const QuestionForm = Loadable(lazy(() => 'src/views/teacher/QuestionForm'));
const Exams = Loadable(lazy(() => 'src/views/teacher/Exams'));
const ExamDetail = Loadable(lazy(() => 'src/views/teacher/ExamDetail'));
const ExamForm = Loadable(lazy(() => 'src/views/teacher/ExamForm'));
const Objections = Loadable(lazy(() => 'src/views/teacher/Objections'));
const Students = Loadable(lazy(() => 'src/views/teacher/Students'));
const StudentDetail = Loadable(lazy(() => 'src/views/teacher/StudentDetail'));

// ==============================|| TEACHER ROUTING ||============================== //

const TeacherRoutes = {
    path: '/dashboard',
    element: <MainLayout />,
    children: [
        {
            path: 'question-banks',
            element: <QuestionBanks />
        },
        {
            path: 'question-banks/:id',
            element: <QuestionBankDetail />
        },
        {
            path: 'question-banks/create',
            element: <QuestionBankForm />
        },
        {
            path: 'question-banks/edit/:id',
            element: <QuestionBankForm />
        },
        {
            path: 'questions',
            element: <Questions />
        },
        {
            path: 'questions/:id',
            element: <QuestionDetail />
        },
        {
            path: 'questions/create',
            element: <QuestionForm />
        },
        {
            path: 'questions/:id/edit',
            element: <QuestionForm />
        },
        {
            path: 'exams',
            element: <Exams />
        },
        {
            path: 'exams/:id',
            element: <ExamDetail />
        },
        {
            path: 'exams/create',
            element: <ExamForm />
        },
        {
            path: 'exams/:id/edit',
            element: <ExamForm />
        },
        {
            path: 'objections',
            element: <Objections />
        },
        {
            path: 'students',
            element: <Students />
        },
        {
            path: 'students/:id',
            element: <StudentDetail />
        }
    ]
};

export default TeacherRoutes;