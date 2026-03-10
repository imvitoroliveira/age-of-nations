import { Suspense, lazy, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { Category } from '@/types/education';

// Lazy-loaded activity components
const ColorsActivity = lazy(() => import('@/components/mini/ColorsActivity').then(m => ({ default: m.ColorsActivity })));
const AnimalsActivity = lazy(() => import('@/components/mini/AnimalsActivity').then(m => ({ default: m.AnimalsActivity })));
const LettersActivity = lazy(() => import('@/components/mini/LettersActivity').then(m => ({ default: m.LettersActivity })));
const NumbersActivity = lazy(() => import('@/components/mini/NumbersActivity').then(m => ({ default: m.NumbersActivity })));
const ShapesActivity = lazy(() => import('@/components/mini/ShapesActivity').then(m => ({ default: m.ShapesActivity })));
const MathActivity = lazy(() => import('@/components/kids/MathActivity').then(m => ({ default: m.MathActivity })));
const SyllablesActivity = lazy(() => import('@/components/kids/SyllablesActivity').then(m => ({ default: m.SyllablesActivity })));
const PortugueseActivity = lazy(() => import('@/components/kids/PortugueseActivity').then(m => ({ default: m.PortugueseActivity })));
const DrawingActivity = lazy(() => import('@/components/kids/DrawingActivity').then(m => ({ default: m.DrawingActivity })));

const activityMap: Record<string, React.LazyExoticComponent<React.ComponentType<{ onBack: () => void }>>> = {
  colors: ColorsActivity,
  animals: AnimalsActivity,
  letters: LettersActivity,
  numbers: NumbersActivity,
  shapes: ShapesActivity,
  math: MathActivity,
  syllables: SyllablesActivity,
  portuguese: PortugueseActivity,
  drawing: DrawingActivity,
};

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <span className="text-6xl float-medium inline-block">🎮</span>
      <p className="text-lg font-bold font-baloo text-muted-foreground mt-4">Carregando...</p>
    </div>
  </div>
);

export const ActivityPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { activeChildId } = useAppStore();
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

  if (!category || !activityMap[category]) {
    navigate('/categories', { replace: true });
    return null;
  }

  const ActivityComponent = activityMap[category];
  const handleBack = () => navigate('/categories');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ActivityComponent onBack={handleBack} />
    </Suspense>
  );
};

export default ActivityPage;
