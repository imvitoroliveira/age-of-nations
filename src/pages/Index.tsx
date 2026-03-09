import { useState } from 'react';
import { LandingPage } from '@/components/screens/LandingPage';
import { MiniHome } from '@/components/screens/MiniHome';
import { KidsHome } from '@/components/screens/KidsHome';
import { ColorsActivity } from '@/components/mini/ColorsActivity';
import { AnimalsActivity } from '@/components/mini/AnimalsActivity';
import { LettersActivity } from '@/components/mini/LettersActivity';
import { NumbersActivity } from '@/components/mini/NumbersActivity';
import { MathActivity } from '@/components/kids/MathActivity';
import { PortugueseActivity } from '@/components/kids/PortugueseActivity';
import { SyllablesActivity } from '@/components/kids/SyllablesActivity';

type Screen =
  | 'landing'
  | 'mini-home'
  | 'kids-home'
  | 'mini-colors'
  | 'mini-animals'
  | 'mini-letters'
  | 'mini-numbers'
  | 'kids-math'
  | 'kids-portuguese'
  | 'kids-syllables';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');

  const goBack = () => {
    if (screen.startsWith('mini-') && screen !== 'mini-home') setScreen('mini-home');
    else if (screen.startsWith('kids-') && screen !== 'kids-home') setScreen('kids-home');
    else setScreen('landing');
  };

  switch (screen) {
    case 'mini-home':
      return (
        <MiniHome
          onBack={() => setScreen('landing')}
          onActivity={(a) => setScreen(`mini-${a}` as Screen)}
        />
      );
    case 'kids-home':
      return (
        <KidsHome
          onBack={() => setScreen('landing')}
          onActivity={(a) => setScreen(`kids-${a}` as Screen)}
        />
      );
    case 'mini-colors':
      return <ColorsActivity onBack={goBack} />;
    case 'mini-animals':
      return <AnimalsActivity onBack={goBack} />;
    case 'mini-letters':
      return <LettersActivity onBack={goBack} />;
    case 'mini-numbers':
      return <NumbersActivity onBack={goBack} />;
    case 'kids-math':
      return <MathActivity onBack={goBack} />;
    case 'kids-portuguese':
      return <PortugueseActivity onBack={goBack} />;
    case 'kids-syllables':
      return <SyllablesActivity onBack={goBack} />;
    default:
      return (
        <LandingPage
          onSelectMini={() => setScreen('mini-home')}
          onSelectKids={() => setScreen('kids-home')}
        />
      );
  }
};

export default Index;
