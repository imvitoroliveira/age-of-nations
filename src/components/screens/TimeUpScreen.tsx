import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { Moon, Crown } from 'lucide-react';

interface Props {
  onGoHome: () => void;
  onPremium: () => void;
}

export const TimeUpScreen = ({ onGoHome, onPremium }: Props) => {
  const { getActiveChild } = useAppStore();
  const { dailyLimitMinutes } = useScreenTimeStore();
  const child = getActiveChild();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-5 pattern-circles relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-kid-purple/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-kid-blue/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm">
        <div className="w-24 h-24 rounded-full bg-kid-orange/15 flex items-center justify-center bounce-in">
          <Moon size={48} className="text-kid-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-baloo text-foreground slide-up">
          Hora de descansar! 😴
        </h1>
        <p className="text-lg text-muted-foreground slide-up stagger-2" style={{ animationFillMode: 'both' }}>
          {child?.name || 'Você'} já usou os {dailyLimitMinutes} minutos de hoje. Volte amanhã para aprender mais!
        </p>
        <span className="text-8xl float-slow">🌙</span>

        {/* Premium CTA */}
        <div className="w-full bg-gradient-to-br from-kid-yellow/15 to-kid-orange/10 rounded-2xl p-5 border-2 border-kid-yellow/30 slide-up stagger-3" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center gap-2 justify-center mb-2">
            <Crown size={20} className="text-kid-yellow" />
            <span className="font-bold text-foreground">Quer mais tempo?</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Com o <strong className="text-kid-yellow">Kidari Premium</strong>, {child?.name || 'seu filho'} pode aprender sem limites!
          </p>
          <button onClick={onPremium} className="kid-btn bg-gradient-to-r from-kid-yellow to-kid-orange text-foreground w-full text-lg font-extrabold"
            style={{ boxShadow: 'var(--shadow-glow-yellow)' }}>
            <Crown size={18} className="inline mr-2" /> Ver planos Premium
          </button>
        </div>

        <button onClick={onGoHome} className="text-muted-foreground font-bold hover:text-foreground transition-colors slide-up stagger-4" style={{ animationFillMode: 'both' }}>
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};
