import { useState } from 'react';
import { ArrowLeft, Clock, BarChart3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { useScreenTimeStore } from '@/store/screenTimeStore';
import { CATEGORY_META } from '@/data/educationData';
import { toast } from 'sonner';

interface Props { onBack: () => void; }

export const ParentDashboard = ({ onBack }: Props) => {
  const { parentPin, setParentPin, verifyPin, children, removeChild, progress } = useAppStore();
  const { dailyLimitMinutes, setDailyLimit, totalSecondsToday } = useScreenTimeStore();
  const [pinInput, setPinInput] = useState('');
  const [authenticated, setAuthenticated] = useState(!parentPin);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [newLimit, setNewLimit] = useState(dailyLimitMinutes);

  if (!authenticated && parentPin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center p-4 gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full"><ArrowLeft size={28} /></Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <span className="text-6xl">🔒</span>
          <h2 className="text-3xl font-bold font-baloo">Área dos Pais</h2>
          <p className="text-muted-foreground">Digite o PIN de 4 dígitos</p>
          <Input type="password" maxLength={4} value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
            className="text-center text-3xl tracking-[1em] h-16 max-w-[200px] rounded-2xl" placeholder="••••" />
          <button onClick={() => {
            if (verifyPin(pinInput)) { setAuthenticated(true); setPinInput(''); }
            else toast.error('PIN incorreto!');
          }} className="kid-btn bg-primary text-primary-foreground">Entrar</button>
        </div>
      </div>
    );
  }

  const usedMin = Math.floor(totalSecondsToday / 60);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4 gap-2 bg-card rounded-b-3xl shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full"><ArrowLeft size={28} /></Button>
        <h2 className="text-2xl font-bold font-baloo">👨‍👩‍👧 Área dos Pais</h2>
      </div>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        {/* Screen Time */}
        <div className="bg-card rounded-3xl p-6 shadow-md border-2 border-muted">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-primary" />
            <h3 className="text-xl font-bold font-baloo">Tempo de Tela</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Usado hoje: <strong>{usedMin} min</strong> / {dailyLimitMinutes} min</p>
          <div className="screen-time-bar mb-4">
            <div className="screen-time-fill" style={{ width: `${Math.min(100, (usedMin / dailyLimitMinutes) * 100)}%` }} />
          </div>
          <label className="text-sm font-bold block mb-1">Limite diário (minutos)</label>
          <div className="flex gap-2">
            <Input type="number" value={newLimit} onChange={e => setNewLimit(Number(e.target.value))} min={5} max={120} className="rounded-xl" />
            <button onClick={() => { setDailyLimit(newLimit); toast.success('Limite atualizado!'); }} className="kid-btn bg-secondary text-secondary-foreground text-sm py-2 px-4">Salvar</button>
          </div>
        </div>

        {/* PIN */}
        <div className="bg-card rounded-3xl p-6 shadow-md border-2 border-muted">
          <h3 className="text-xl font-bold font-baloo mb-4">🔐 PIN de Segurança</h3>
          {settingPin ? (
            <div className="flex gap-2">
              <Input type="password" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4 dígitos" className="rounded-xl text-center tracking-widest" />
              <button onClick={() => {
                if (newPin.length !== 4) { toast.error('PIN deve ter 4 dígitos'); return; }
                setParentPin(newPin); setSettingPin(false); setNewPin('');
                toast.success('PIN definido!');
              }} className="kid-btn bg-primary text-primary-foreground text-sm py-2 px-4">Salvar</button>
            </div>
          ) : (
            <button onClick={() => setSettingPin(true)} className="kid-btn bg-muted text-foreground text-sm py-2 px-4 w-full">
              {parentPin ? 'Alterar PIN' : 'Definir PIN'}
            </button>
          )}
        </div>

        {/* Children progress */}
        <div className="bg-card rounded-3xl p-6 shadow-md border-2 border-muted">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="text-xl font-bold font-baloo">Progresso dos Filhos</h3>
          </div>
          {children.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhuma criança cadastrada</p>
          ) : (
            children.map(child => {
              const cp = progress[child.id] || {};
              return (
                <div key={child.id} className="mb-4 p-4 bg-muted/30 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{child.avatar_emoji}</span>
                      <div>
                        <p className="font-bold">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Nível {child.level} • {child.total_stars} ⭐</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (confirm(`Remover ${child.name}?`)) { removeChild(child.id); toast.info('Removido'); }
                    }}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(cp).map(([cat, p]) => {
                      const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
                      if (!meta) return null;
                      return (
                        <div key={cat} className="flex items-center gap-2 text-sm">
                          <span>{meta.emoji}</span>
                          <span className="flex-1">{meta.title}</span>
                          <span className="font-bold">{p.correct_count}/{p.total_count}</span>
                          <span className="text-kid-yellow">⭐{p.stars_earned}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
