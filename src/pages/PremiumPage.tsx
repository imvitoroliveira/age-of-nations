import { useNavigate } from 'react-router-dom';
import { PremiumScreen } from '@/components/screens/PremiumScreen';

const PremiumPage = () => {
  const navigate = useNavigate();
  return <PremiumScreen onBack={() => navigate('/')} />;
};

export default PremiumPage;
