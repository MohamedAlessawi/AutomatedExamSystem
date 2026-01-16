import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loadable from './Loadable';

// Create a mapping of component paths to import functions
const componentImportMap = {
    // Admin components
    'views/pages/AdminRegister': () => import('../views/pages/AdminRegister'),
    'views/users/TeachersPage': () => import('../views/users/TeachersPage'),
    'views/users/StudentsPage': () => import('../views/users/StudentsPage'),
    'views/users/TeacherDetail': () => import('../views/users/TeacherDetail'),
    'views/users/StudentDetail': () => import('../views/users/StudentDetail'),
    'views/users/EditTeacher': () => import('../views/users/EditTeacher'),
    'views/users/EditStudent': () => import('../views/users/EditStudent'),

    // Teacher components
    'views/teacher/QuestionBanks': () => import('../views/teacher/QuestionBanks'),
    'views/teacher/QuestionBankDetail': () => import('../views/teacher/QuestionBankDetail'),
    'views/teacher/QuestionBankForm': () => import('../views/teacher/QuestionBankForm'),
    'views/teacher/Questions': () => import('../views/teacher/Questions'),
    'views/teacher/QuestionDetail': () => import('../views/teacher/QuestionDetail'),
    'views/teacher/QuestionForm': () => import('../views/teacher/QuestionForm'),
    'views/teacher/Exams': () => import('../views/teacher/Exams'),
    'views/teacher/ExamDetail': () => import('../views/teacher/ExamDetail'),
    'views/teacher/ExamForm': () => import('../views/teacher/ExamForm'),
    'views/teacher/Objections': () => import('../views/teacher/Objections'),
    'views/teacher/Students': () => import('../views/teacher/Students'),
    'views/teacher/StudentDetail': () => import('../views/teacher/StudentDetail'),

    // Student components
    'views/student/CurrentExams': () => import('../views/student/CurrentExams'),
    'views/student/ExamHistory': () => import('../views/student/ExamHistory'),
    'views/student/ExamTaking': () => import('../views/student/ExamTaking'),
    'views/student/ExamResults': () => import('../views/student/ExamResults'),

    // Utilities
    'views/pages/SamplePage': () => import('../views/pages/SamplePage'),
    'views/components/Typography': () => import('../views/components/Typography'),
};

const RoleBasedLazy = ({
                           componentPath,
                           allowedRoles,
                           fallback = <div>Loading...</div>,
                           ...props
                       }) => {
    const { user } = useAuth();
    const [Component, setComponent] = useState(null);

    // Check role first
    const hasAccess = user && (!allowedRoles || allowedRoles.includes(user.role));

    // Handle authentication and authorization
    if (!user) {
        return <Navigate to="/pages/auth/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log(`🔒 Redirecting ${user.role} from ${componentPath}`);

        // Redirect based on role
        switch (user.role) {
            case 'admin':
                return <Navigate to="/dashboard/default" replace />;
            case 'teacher':
                return <Navigate to="/dashboard/question-banks" replace />;
            case 'student':
                return <Navigate to="/dashboard/student/current-exams" replace />;
            default:
                return <Navigate to="/pages/auth/login" replace />;
        }
    }

    // Load component only if role matches and component hasn't been loaded
    useEffect(() => {
        if (!hasAccess || Component) return;

        console.log(`🚀 Loading component: ${componentPath} for role: ${user.role}`);

        const loadComponent = async () => {
            try {
                const importFunction = componentImportMap[componentPath];
                if (!importFunction) {
                    throw new Error(`Component not found in import map: ${componentPath}`);
                }

                const module = await importFunction();
                const LazyComp = lazy(() => Promise.resolve(module));
                const LoadableComp = Loadable(LazyComp);
                setComponent(() => LoadableComp);
            } catch (error) {
                console.error(`Failed to load component ${componentPath}:`, error);
            }
        };

        loadComponent();
    }, [hasAccess, Component, componentPath, user?.role]);

    // Show loading or the component
    if (!Component) {
        return fallback;
    }

    return <Component {...props} />;
};

export default RoleBasedLazy;