import { useNavigate } from 'react-router-dom';
import { TimeUpScreen } from '@/components/screens/TimeUpScreen';
import { useAppStore } from '@/store/appStore';

const TimeUpPage = () => {
  const navigate = useNavigate();
  const { setActiveChild } = useAppStore();

  const handleGoHome = () => {
    setActiveChild(null);
    navigate('/');
  };

  return <TimeUpScreen onGoHome={handleGoHome} onPremium={() => navigate('/premium')} />;
};

export default TimeUpPage;
