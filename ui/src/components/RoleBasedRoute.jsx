import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // If no user is logged in, redirect to login
    if (!user) {
        return <Navigate to="/pages/auth/login" replace />;
    }

    // If allowedRoles is not specified or user role is allowed, render children
    if (!allowedRoles || allowedRoles.includes(user.role)) {
        return children;
    }

    // If user role is not allowed, redirect based on their role
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
};

export default RoleBasedRoute;