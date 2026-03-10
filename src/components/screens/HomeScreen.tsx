import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { Star, Settings, Plus, LogIn, User, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  onSelectChild: (id: string) => void;
  onAddChild: () => void;
  onSettings: () => void;
  onLogin: () => void;
  onParentDashboard: () => void;
}

export const HomeScreen = ({ onSelectChild, onAddChild, onSettings, onLogin, onParentDashboard }: Props) => {
  const { children } = useAppStore();
  const { user } = useAuth();
  const { getUsedPercent, getRemainingSeconds, dailyLimitMinutes } = useScreenTimeStore();
  const remainingMin = Math.ceil(getRemainingSeconds() / 60);
  const usedPercent = getUsedPercent();

  return (
    <div className="min-h-screen flex flex-col pattern-circles">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full bg-kid-pink/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-kid-blue/10 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="icon" onClick={onParentDashboard} className="rounded-full hover:bg-primary/10">
              <User size={22} className="text-primary" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onLogin} className="rounded-full gap-1.5 text-primary font-bold hover:bg-primary/10">
              <LogIn size={16} /> Entrar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <Clock size={14} className={usedPercent > 80 ? 'text-kid-red' : 'text-kid-green'} />
          <span>{remainingMin} min</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onSettings} className="rounded-full hover:bg-primary/10">
          <Settings size={22} className="text-muted-foreground" />
        </Button>
      </div>

      {/* Screen time bar */}
      <div className="px-6">
        <div className="screen-time-bar">
          <div className="screen-time-fill" style={{ width: `${usedPercent}%` }} />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-4 py-10 relative">
        <div className="inline-block relative">
          <h1 className="text-6xl md:text-8xl font-extrabold font-baloo hero-gradient-text float-slow">
            Kidari
          </h1>
          <Sparkles size={28} className="absolute -top-2 -right-4 text-kid-yellow pulse-glow" />
        </div>
        <p className="text-lg md:text-xl text-muted-foreground mt-1 font-semibold">
          Aprender brincando é mais divertido! ✨
        </p>
      </div>

      {/* Children */}
      <div className="flex-1 flex flex-col items-center px-4 gap-5 relative z-10">
        {children.length === 0 ? (
          <div className="text-center py-10 slide-up">
            <div className="text-7xl mb-4 float-medium">👶</div>
            <p className="text-2xl font-bold text-foreground/80 mb-2">Vamos começar!</p>
            <p className="text-muted-foreground mb-6">Adicione uma criança para iniciar a aventura</p>
            <button onClick={onAddChild} className="kid-btn-gradient text-2xl">
              <Plus size={24} className="inline mr-2" /> Adicionar Criança
            </button>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold font-baloo text-foreground">Quem vai aprender hoje? 🎯</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg w-full">
              {children.map((child, i) => (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  className={`kid-card bg-card p-5 flex flex-col items-center gap-2 border-primary/15 slide-up stagger-${i + 1}`}
                  style={{ animationFillMode: 'both' }}
                >
                  <span className="text-6xl float-medium" style={{ animationDelay: `${i * 0.4}s` }}>{child.avatar_emoji}</span>
                  <span className="text-lg font-bold font-baloo text-foreground">{child.name}</span>
                  <span className="text-xs text-muted-foreground font-semibold">{child.age} {child.age === 1 ? 'ano' : 'anos'}</span>
                  <div className="flex items-center gap-1 bg-kid-yellow/15 px-2.5 py-0.5 rounded-full">
                    <Star size={14} className="fill-kid-yellow text-kid-yellow" />
                    <span className="font-bold text-sm text-foreground">{child.total_stars}</span>
                  </div>
                  <span className="badge-pill bg-primary/10 text-primary">Nível {child.level}</span>
                </button>
              ))}
              <button
                onClick={onAddChild}
                className="kid-card bg-muted/30 p-5 flex flex-col items-center justify-center gap-2 border-dashed border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus size={28} className="text-primary" />
                </div>
                <span className="text-sm font-bold text-muted-foreground">Adicionar</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-center p-6 text-sm text-muted-foreground/60 font-semibold">
        Feito com ❤️ para pequenos aprendizes
      </div>
    </div>
  );
};
