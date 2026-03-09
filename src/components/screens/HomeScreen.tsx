import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { Star, Settings, Plus, LogIn, User, Clock } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-kid-purple/5 via-background to-kid-blue/5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="icon" onClick={onParentDashboard} className="rounded-full">
              <User size={24} />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onLogin} className="rounded-full gap-1">
              <LogIn size={18} /> Entrar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>{remainingMin} min restantes</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onSettings} className="rounded-full">
          <Settings size={24} />
        </Button>
      </div>

      {/* Screen time bar */}
      <div className="px-4">
        <div className="screen-time-bar">
          <div className="screen-time-fill" style={{ width: `${getUsedPercent()}%` }} />
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-4 py-8">
        <h1 className="text-5xl md:text-7xl font-extrabold font-baloo text-primary float-slow">
          🌟 Kidari
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mt-2 font-semibold">
          Aprender brincando é mais divertido!
        </p>
      </div>

      {/* Children */}
      <div className="flex-1 flex flex-col items-center px-4 gap-4">
        {children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">👶</p>
            <p className="text-2xl font-bold text-muted-foreground mb-6">Adicione uma criança para começar!</p>
            <button onClick={onAddChild} className="kid-btn bg-primary text-primary-foreground text-2xl">
              <Plus size={28} className="inline mr-2" /> Adicionar Criança
            </button>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-foreground">Quem vai aprender hoje?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg w-full">
              {children.map(child => (
                <button key={child.id} onClick={() => onSelectChild(child.id)}
                  className="kid-card bg-card p-6 flex flex-col items-center gap-2 border-primary/20">
                  <span className="text-6xl">{child.avatar_emoji}</span>
                  <span className="text-xl font-bold font-baloo">{child.name}</span>
                  <span className="text-sm text-muted-foreground">{child.age} {child.age === 1 ? 'ano' : 'anos'}</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-kid-yellow text-kid-yellow" />
                    <span className="font-bold">{child.total_stars}</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Nível {child.level}</span>
                </button>
              ))}
              <button onClick={onAddChild}
                className="kid-card bg-muted/50 p-6 flex flex-col items-center justify-center gap-2 border-dashed border-muted-foreground/30">
                <Plus size={40} className="text-muted-foreground" />
                <span className="text-sm font-bold text-muted-foreground">Adicionar</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-center p-4 text-sm text-muted-foreground">Feito com ❤️ para pequenos aprendizes</div>
    </div>
  );
};
