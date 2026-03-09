import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { Clock } from 'lucide-react';

interface Props { onGoHome: () => void; }

export const TimeUpScreen = ({ onGoHome }: Props) => {
  const { getActiveChild } = useAppStore();
  const { dailyLimitMinutes } = useScreenTimeStore();
  const child = getActiveChild();

  return (
    <div className="min-h-screen bg-gradient-to-b from-kid-purple/10 via-background to-kid-blue/10 flex flex-col items-center justify-center p-6 text-center gap-6">
      <Clock size={80} className="text-kid-orange" />
      <h1 className="text-4xl font-extrabold font-baloo text-foreground">Hora de descansar! 😴</h1>
      <p className="text-xl text-muted-foreground max-w-sm">
        {child?.name || 'Você'} já usou os {dailyLimitMinutes} minutos de hoje. Volte amanhã para aprender mais!
      </p>
      <span className="text-8xl">🌙</span>
      <button onClick={onGoHome} className="kid-btn bg-primary text-primary-foreground">Voltar ao Início</button>
    </div>
  );
};
