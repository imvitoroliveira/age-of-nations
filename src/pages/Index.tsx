import { useState, useEffect, useRef } from 'react';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { AddChildScreen } from '@/components/screens/AddChildScreen';
import { CategoryScreen } from '@/components/screens/CategoryScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { FarmScreen } from '@/components/screens/FarmScreen';
import { AchievementsScreen } from '@/components/screens/AchievementsScreen';
import { ParentDashboard } from '@/components/screens/ParentDashboard';
import { TimeUpScreen } from '@/components/screens/TimeUpScreen';
import { PremiumScreen } from '@/components/screens/PremiumScreen';
import { ColorsActivity } from '@/components/mini/ColorsActivity';
import { AnimalsActivity } from '@/components/mini/AnimalsActivity';
import { LettersActivity } from '@/components/mini/LettersActivity';
import { NumbersActivity } from '@/components/mini/NumbersActivity';
import { ShapesActivity } from '@/components/mini/ShapesActivity';
import { MathActivity } from '@/components/kids/MathActivity';
import { SyllablesActivity } from '@/components/kids/SyllablesActivity';
import { PortugueseActivity } from '@/components/kids/PortugueseActivity';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { useAuth } from '@/hooks/useAuth';
import { Category } from '@/types/education';

type Screen = 'home' | 'addChild' | 'categories' | 'activity' | 'auth' | 'farm' | 'achievements' | 'parentDashboard' | 'timeUp' | 'premium';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { setActiveChild } = useAppStore();
  const { user } = useAuth();
  const { startSession, tick, isTimeUp, resetIfNewDay } = useScreenTimeStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Screen time ticker
  useEffect(() => {
    resetIfNewDay();
    if (screen === 'activity' || screen === 'categories') {
      startSession();
      timerRef.current = setInterval(() => {
        tick();
        if (isTimeUp()) {
          setScreen('timeUp');
        }
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen]);

  useEffect(() => {
    if (user && screen === 'auth') setScreen('home');
  }, [user, screen]);

  const handleSelectChild = (id: string) => {
    setActiveChild(id);
    if (isTimeUp()) { setScreen('timeUp'); return; }
    setScreen('categories');
  };

  const handleSelectCategory = (cat: Category) => {
    if (isTimeUp()) { setScreen('timeUp'); return; }
    setActiveCategory(cat);
    setScreen('activity');
  };

  const handleBackToCategories = () => { setActiveCategory(null); setScreen('categories'); };
  const handleBackToHome = () => { setActiveChild(null); setScreen('home'); };

  switch (screen) {
    case 'auth':
      return <AuthScreen onBack={() => setScreen('home')} onSuccess={() => setScreen('home')} />;
    case 'addChild':
      return <AddChildScreen onBack={() => setScreen('home')} onDone={() => setScreen('categories')} />;
    case 'categories':
      return <CategoryScreen onBack={handleBackToHome} onSelectCategory={handleSelectCategory} onFarm={() => setScreen('farm')} onAchievements={() => setScreen('achievements')} />;
    case 'farm':
      return <FarmScreen onBack={handleBackToCategories} />;
    case 'achievements':
      return <AchievementsScreen onBack={handleBackToCategories} />;
    case 'parentDashboard':
      return <ParentDashboard onBack={() => setScreen('home')} onPremium={() => setScreen('premium')} />;
    case 'timeUp':
      return <TimeUpScreen onGoHome={handleBackToHome} onPremium={() => setScreen('premium')} />;
    case 'premium':
      return <PremiumScreen onBack={() => setScreen('home')} />;
    case 'activity':
      switch (activeCategory) {
        case 'colors': return <ColorsActivity onBack={handleBackToCategories} />;
        case 'animals': return <AnimalsActivity onBack={handleBackToCategories} />;
        case 'letters': return <LettersActivity onBack={handleBackToCategories} />;
        case 'numbers': return <NumbersActivity onBack={handleBackToCategories} />;
        case 'shapes': return <ShapesActivity onBack={handleBackToCategories} />;
        case 'math': return <MathActivity onBack={handleBackToCategories} />;
        case 'syllables': return <SyllablesActivity onBack={handleBackToCategories} />;
        case 'portuguese': return <PortugueseActivity onBack={handleBackToCategories} />;
        default: return <CategoryScreen onBack={handleBackToHome} onSelectCategory={handleSelectCategory} onFarm={() => setScreen('farm')} onAchievements={() => setScreen('achievements')} />;
      }
    case 'home':
    default:
      return (
        <HomeScreen
          onSelectChild={handleSelectChild}
          onAddChild={() => setScreen('addChild')}
          onSettings={() => setScreen('parentDashboard')}
          onLogin={() => setScreen('auth')}
          onParentDashboard={() => setScreen('parentDashboard')}
          onPremium={() => setScreen('premium')}
        />
      );
  }
};

export default Index;
