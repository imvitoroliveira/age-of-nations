import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { useAuth } from '@/hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { setActiveChild } = useAppStore();
  const { isTimeUp } = useScreenTimeStore();
  const { user } = useAuth();

  const handleSelectChild = (id: string) => {
    setActiveChild(id);
    if (isTimeUp()) { navigate('/time-up'); return; }
    navigate('/categories');
  };

  return (
    <HomeScreen
      onSelectChild={handleSelectChild}
      onAddChild={() => navigate('/add-child')}
      onSettings={() => navigate('/parent')}
      onLogin={() => navigate('/auth')}
      onParentDashboard={() => navigate('/parent')}
      onPremium={() => navigate('/premium')}
    />
  );
};

export default HomePage;
