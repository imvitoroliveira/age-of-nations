import { useState } from 'react';
import { ArrowLeft, Clock, BarChart3, Trash2, Shield, TrendingUp, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { CATEGORY_META } from '@/data/educationData';
import { AnalyticsDashboard } from '@/components/screens/AnalyticsDashboard';
import { toast } from 'sonner';

interface Props { onBack: () => void; onPremium?: () => void; }

export const ParentDashboard = ({ onBack, onPremium }: Props) => {
  const { parentPin, setParentPin, verifyPin, children, removeChild, progress } = useAppStore();
  const { dailyLimitMinutes, setDailyLimit, totalSecondsToday } = useScreenTimeStore();
  const [pinInput, setPinInput] = useState('');
  const [authenticated, setAuthenticated] = useState(!parentPin);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [newLimit, setNewLimit] = useState(dailyLimitMinutes);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  if (!authenticated && parentPin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center p-4 gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10"><ArrowLeft size={24} /></Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield size={36} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold font-baloo text-foreground">Área dos Pais</h2>
          <p className="text-muted-foreground">Digite o PIN de 4 dígitos</p>
          <Input type="password" maxLength={4} value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            className="text-center text-3xl tracking-[1em] h-16 max-w-[200px] rounded-2xl border-2 border-primary/20 focus:border-primary" placeholder="••••" />
          <button onClick={() => {
            if (verifyPin(pinInput)) { setAuthenticated(true); setPinInput(''); }
            else toast.error('PIN incorreto!');
          }} className="kid-btn bg-primary text-primary-foreground">Entrar</button>
        </div>
      </div>
    );
  }

  const usedMin = Math.floor(totalSecondsToday / 60);
  const usedPercent = Math.min(100, (usedMin / dailyLimitMinutes) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-kid-teal/5 pointer-events-none" />
        <div className="flex items-center p-4 gap-3 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10"><ArrowLeft size={24} /></Button>
          <h2 className="text-2xl font-bold font-baloo text-foreground">Área dos Pais</h2>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-5 pb-8">
        {/* Screen Time Card */}
        <div className="bg-card rounded-[1.5rem] p-5 shadow-md border border-border/50 slide-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-kid-blue/15 flex items-center justify-center">
              <Clock size={18} className="text-kid-blue" />
            </div>
            <h3 className="text-lg font-bold font-baloo text-foreground">Tempo de Tela</h3>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-extrabold font-baloo text-foreground">{usedMin}</span>
            <span className="text-muted-foreground font-semibold">/ {dailyLimitMinutes} min</span>
          </div>
          <div className="screen-time-bar mb-4">
            <div className="screen-time-fill" style={{ width: `${usedPercent}%` }} />
          </div>
          <label className="text-sm font-bold block mb-2 text-muted-foreground">Limite diário (minutos)</label>
          <div className="flex gap-2">
            <Input type="number" value={newLimit} onChange={e => setNewLimit(Number(e.target.value))} min={5} max={120} className="rounded-xl border-2 border-border/50" />
            <button onClick={() => { setDailyLimit(newLimit); toast.success('Limite atualizado!'); }} className="kid-btn bg-secondary text-secondary-foreground text-sm py-2 px-5">Salvar</button>
          </div>
        </div>

        {/* PIN Card */}
        <div className="bg-card rounded-[1.5rem] p-5 shadow-md border border-border/50 slide-up stagger-2" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-kid-purple/15 flex items-center justify-center">
              <Shield size={18} className="text-kid-purple" />
            </div>
            <h3 className="text-lg font-bold font-baloo text-foreground">PIN de Segurança</h3>
          </div>
          {settingPin ? (
            <div className="flex gap-2">
              <Input type="password" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4 dígitos" className="rounded-xl text-center tracking-widest border-2 border-border/50" />
              <button onClick={() => {
                if (newPin.length !== 4) { toast.error('PIN deve ter 4 dígitos'); return; }
                setParentPin(newPin); setSettingPin(false); setNewPin('');
                toast.success('PIN definido!');
              }} className="kid-btn bg-primary text-primary-foreground text-sm py-2 px-5">Salvar</button>
            </div>
          ) : (
            <button onClick={() => setSettingPin(true)} className="kid-btn bg-muted text-foreground text-sm py-2.5 px-5 w-full">
              {parentPin ? '🔄 Alterar PIN' : '➕ Definir PIN'}
            </button>
          )}
        </div>

        {/* Children Progress + Analytics */}
        <div className="bg-card rounded-[1.5rem] p-5 shadow-md border border-border/50 slide-up stagger-3" style={{ animationFillMode: 'both' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-kid-green/15 flex items-center justify-center">
              <TrendingUp size={18} className="text-kid-green" />
            </div>
            <h3 className="text-lg font-bold font-baloo text-foreground">Progresso e Analytics</h3>
          </div>
          {children.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma criança cadastrada</p>
          ) : (
            <div className="space-y-4">
              {children.map(child => {
                const cp = progress[child.id] || {};
                const totalCorrect = Object.values(cp).reduce((sum, p) => sum + (p.correct_count || 0), 0);
                const totalAttempts = Object.values(cp).reduce((sum, p) => sum + (p.total_count || 0), 0);
                const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
                const isExpanded = expandedChild === child.id;

                return (
                  <div key={child.id} className="bg-muted/20 rounded-2xl border border-border/30 overflow-hidden">
                    {/* Child header */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{child.avatar_emoji}</span>
                          <div>
                            <p className="font-bold text-foreground">{child.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                              <span>Nível {child.level}</span>
                              <span>•</span>
                              <span>{child.total_stars} ⭐</span>
                              <span>•</span>
                              <span className={accuracy >= 70 ? 'text-kid-green' : 'text-kid-orange'}>{accuracy}% acerto</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10" onClick={() => {
                          if (confirm(`Remover ${child.name}?`)) { removeChild(child.id); toast.info('Removido'); }
                        }}><Trash2 size={16} className="text-destructive/60" /></Button>
                      </div>

                      {/* Category progress bars */}
                      <div className="space-y-1.5">
                        {Object.entries(cp).map(([cat, p]) => {
                          const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
                          if (!meta) return null;
                          const catAccuracy = p.total_count > 0 ? Math.round((p.correct_count / p.total_count) * 100) : 0;
                          return (
                            <div key={cat} className="flex items-center gap-2 text-sm">
                              <span className="text-base">{meta.emoji}</span>
                              <span className="flex-1 font-semibold text-foreground">{meta.title}</span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full progress-fill" style={{ width: `${catAccuracy}%` }} />
                              </div>
                              <span className="font-bold text-xs w-8 text-right text-muted-foreground">{catAccuracy}%</span>
                              <span className="text-kid-yellow text-xs font-bold">⭐{p.stars_earned}</span>
                            </div>
                          );
                        })}
                        {Object.keys(cp).length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">Ainda não jogou nenhuma atividade</p>
                        )}
                      </div>

                      {/* Toggle analytics */}
                      <button
                        onClick={() => setExpandedChild(isExpanded ? null : child.id)}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1.5"
                      >
                        <BarChart3 size={14} />
                        {isExpanded ? 'Ocultar gráficos' : 'Ver gráficos detalhados'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Expanded analytics */}
                    {isExpanded && (
                      <div className="border-t border-border/30 p-4 bg-card/50">
                        <AnalyticsDashboard childId={child.id} childName={child.name} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Premium CTA */}
        {onPremium && (
          <button onClick={onPremium}
            className="w-full bg-gradient-to-r from-kid-yellow/15 to-kid-orange/10 border-2 border-kid-yellow/30 rounded-[1.5rem] p-5 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform slide-up stagger-4 shadow-md"
            style={{ animationFillMode: 'both' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kid-yellow to-kid-orange flex items-center justify-center flex-shrink-0 shadow-lg">
              <Crown size={24} className="text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-foreground">Kidari Premium</p>
              <p className="text-xs text-muted-foreground">Tempo ilimitado, relatórios completos e mais</p>
            </div>
            <span className="text-sm font-bold text-kid-yellow">→</span>
          </button>
        )}
      </div>
    </div>
  );
};
