import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { Moon } from 'lucide-react';

interface Props { onGoHome: () => void; }

export const TimeUpScreen = ({ onGoHome }: Props) => {
  const { getActiveChild } = useAppStore();
  const { dailyLimitMinutes } = useScreenTimeStore();
  const child = getActiveChild();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 pattern-circles relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-kid-purple/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-kid-blue/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-kid-orange/15 flex items-center justify-center bounce-in">
          <Moon size={48} className="text-kid-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-baloo text-foreground slide-up">
          Hora de descansar! 😴
        </h1>
        <p className="text-lg text-muted-foreground max-w-sm slide-up stagger-2" style={{ animationFillMode: 'both' }}>
          {child?.name || 'Você'} já usou os {dailyLimitMinutes} minutos de hoje. Volte amanhã para aprender mais!
        </p>
        <span className="text-8xl float-slow">🌙</span>
        <button onClick={onGoHome} className="kid-btn bg-primary text-primary-foreground slide-up stagger-3" style={{ animationFillMode: 'both' }}>
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};
