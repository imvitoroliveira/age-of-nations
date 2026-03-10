import { useNavigate } from 'react-router-dom';
import { FarmScreen } from '@/components/screens/FarmScreen';

const FarmPage = () => {
  const navigate = useNavigate();
  return <FarmScreen onBack={() => navigate('/categories')} />;
};

export default FarmPage;
