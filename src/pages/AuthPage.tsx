import { useNavigate } from 'react-router-dom';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user]);

  return <AuthScreen onBack={() => navigate('/')} onSuccess={() => navigate('/')} />;
};

export default AuthPage;
