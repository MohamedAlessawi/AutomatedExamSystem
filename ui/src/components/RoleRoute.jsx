import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleRoute({ allowedRoles, children }) {
    const { user } = useAuth();
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
}
