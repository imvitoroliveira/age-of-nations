import { useNavigate } from 'react-router-dom';
import { CategoryScreen } from '@/components/screens/CategoryScreen';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { useEffect, useRef } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { Category } from '@/types/education';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { activeChildId, setActiveChild } = useAppStore();
  const { startSession, tick, isTimeUp, resetIfNewDay } = useScreenTimeStore();
  const { trackScreenTime } = useAnalyticsStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activeChildId) {
      navigate('/', { replace: true });
      return;
    }
    resetIfNewDay();
    startSession();
    timerRef.current = setInterval(() => {
      tick();
      if (activeChildId) {
        trackScreenTime(activeChildId, useScreenTimeStore.getState().totalSecondsToday);
      }
      if (isTimeUp()) {
        navigate('/time-up', { replace: true });
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeChildId]);

  const handleSelectCategory = (cat: Category) => {
    if (isTimeUp()) { navigate('/time-up'); return; }
    navigate(`/activity/${cat}`);
  };

  const handleBack = () => {
    setActiveChild(null);
    navigate('/');
  };

  return (
    <CategoryScreen
      onBack={handleBack}
      onSelectCategory={handleSelectCategory}
      onFarm={() => navigate('/farm')}
      onAchievements={() => navigate('/achievements')}
    />
  );
};

export default CategoriesPage;
