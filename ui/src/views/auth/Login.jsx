// src/views/auth/Login.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CommonAuthLayout from './CommonAuthLayout';
import AuthLogin from 'sections/auth/AuthLogin';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading, clearError } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (formData) => {
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in the auth context
      console.error('Login error:', err);
    }
  };

  return (
    <CommonAuthLayout
      title="Sign in"
      subHeading=" "
    >
      <AuthLogin
        onSubmit={handleLogin}
        error={error}
        loading={loading}
        clearError={clearError}
      />
    </CommonAuthLayout>
  );
}