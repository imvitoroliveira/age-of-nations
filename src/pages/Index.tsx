import { useState, useEffect } from 'react';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { AddChildScreen } from '@/components/screens/AddChildScreen';
import { CategoryScreen } from '@/components/screens/CategoryScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { ColorsActivity } from '@/components/mini/ColorsActivity';
import { AnimalsActivity } from '@/components/mini/AnimalsActivity';
import { LettersActivity } from '@/components/mini/LettersActivity';
import { NumbersActivity } from '@/components/mini/NumbersActivity';
import { ShapesActivity } from '@/components/mini/ShapesActivity';
import { MathActivity } from '@/components/kids/MathActivity';
import { SyllablesActivity } from '@/components/kids/SyllablesActivity';
import { PortugueseActivity } from '@/components/kids/PortugueseActivity';
import { useChildStore } from '@/store/childStore';
import { useAuth } from '@/hooks/useAuth';
import { Category } from '@/types/education';
import { toast } from 'sonner';

type Screen = 'home' | 'addChild' | 'categories' | 'activity' | 'auth' | 'parentDashboard';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { setActiveChild } = useChildStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user && screen === 'auth') setScreen('home');
  }, [user, screen]);

  const handleSelectChild = (id: string) => {
    setActiveChild(id);
    setScreen('categories');
  };

  const handleSelectCategory = (cat: Category) => {
    setActiveCategory(cat);
    setScreen('activity');
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setScreen('categories');
  };

  const handleBackToHome = () => {
    setActiveChild(null);
    setScreen('home');
  };

  switch (screen) {
    case 'auth':
      return <AuthScreen onBack={() => setScreen('home')} onSuccess={() => setScreen('home')} />;

    case 'addChild':
      return <AddChildScreen onBack={() => setScreen('home')} onDone={() => setScreen('categories')} />;

    case 'categories':
      return <CategoryScreen onBack={handleBackToHome} onSelectCategory={handleSelectCategory} />;

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
        default: return <CategoryScreen onBack={handleBackToHome} onSelectCategory={handleSelectCategory} />;
      }

    case 'home':
    default:
      return (
        <HomeScreen
          onSelectChild={handleSelectChild}
          onAddChild={() => setScreen('addChild')}
          onSettings={() => toast.info('Em breve!')}
          onLogin={() => setScreen('auth')}
          onParentDashboard={() => toast.info('Dashboard dos pais em breve!')}
        />
      );
  }
};

export default Index;
