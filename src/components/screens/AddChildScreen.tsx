import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { AVATAR_EMOJIS } from '@/data/educationData';
import { toast } from 'sonner';

interface Props { onBack: () => void; onDone: () => void; }

export const AddChildScreen = ({ onBack, onDone }: Props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(2);
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0]);
  const { addChild } = useAppStore();

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Digite o nome da criança'); return; }
    addChild(name.trim(), age, avatar);
    toast.success(`${name} adicionado(a)! 🎉`);
    onDone();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pattern-circles">
      <div className="relative bg-card rounded-b-[2rem] shadow-lg border-b-2 border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-kid-pink/5 pointer-events-none" />
        <div className="flex items-center p-4 gap-3 relative z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10"><ArrowLeft size={24} /></Button>
          <h2 className="text-2xl font-bold font-baloo text-foreground">Nova Criança</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 gap-7 max-w-md mx-auto w-full">
        {/* Avatar */}
        <div className="text-center slide-up">
          <span className="text-8xl bounce-in inline-block">{avatar}</span>
          <p className="text-base font-bold mt-2 text-muted-foreground">Escolha um avatar</p>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {AVATAR_EMOJIS.map(e => (
              <button key={e} onClick={() => setAvatar(e)}
                className={`text-3xl p-2 rounded-xl transition-all duration-200 ${
                  e === avatar
                    ? 'bg-primary/15 scale-110 ring-2 ring-primary shadow-md'
                    : 'hover:bg-muted hover:scale-105'
                }`}>{e}</button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="w-full slide-up stagger-2" style={{ animationFillMode: 'both' }}>
          <label className="text-base font-bold mb-2 block text-foreground">Nome</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da criança"
            className="text-xl h-14 rounded-2xl text-center border-2 border-border/50 focus:border-primary" maxLength={20} />
        </div>

        {/* Age */}
        <div className="w-full slide-up stagger-3" style={{ animationFillMode: 'both' }}>
          <label className="text-base font-bold mb-2 block text-foreground">Idade: {age} {age === 1 ? 'ano' : 'anos'}</label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6].map(a => (
              <button key={a} onClick={() => setAge(a)}
                className={`w-14 h-14 rounded-2xl text-2xl font-bold transition-all duration-200 ${
                  a === age
                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:scale-105'
                }`}>{a}</button>
            ))}
          </div>
          <div className={`text-center mt-3 p-3 rounded-2xl ${
            age <= 3 ? 'bg-kid-blue/10 border border-kid-blue/20' : 'bg-kid-pink/10 border border-kid-pink/20'
          }`}>
            <p className="text-sm font-bold text-foreground">
              {age <= 3 ? "🧒 Enzo's" : "📚 Valentina's"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {age <= 3 ? "Cores, animais, letras, números e formas" : "Matemática, português e sílabas"}
            </p>
          </div>
        </div>

        <button onClick={handleSubmit} className="kid-btn-gradient w-full text-2xl mt-2 slide-up stagger-4" style={{ animationFillMode: 'both' }}>
          Começar! 🚀
        </button>
      </div>
    </div>
  );
};
