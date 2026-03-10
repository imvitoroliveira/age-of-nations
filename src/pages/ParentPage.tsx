import { useNavigate } from 'react-router-dom';
import { ParentDashboard } from '@/components/screens/ParentDashboard';

const ParentPage = () => {
  const navigate = useNavigate();
  return <ParentDashboard onBack={() => navigate('/')} onPremium={() => navigate('/premium')} />;
};

export default ParentPage;
