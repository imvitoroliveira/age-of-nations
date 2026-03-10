import { useNavigate } from 'react-router-dom';
import { FarmGame } from '@/components/game/FarmGame';

const FarmPage = () => {
  const navigate = useNavigate();
  return <FarmGame onBack={() => navigate('/categories')} />;
};

export default FarmPage;
