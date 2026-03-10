import { useNavigate } from 'react-router-dom';
import { AchievementsScreen } from '@/components/screens/AchievementsScreen';

const AchievementsPage = () => {
  const navigate = useNavigate();
  return <AchievementsScreen onBack={() => navigate('/categories')} />;
};

export default AchievementsPage;
