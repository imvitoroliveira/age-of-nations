import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChildStore } from '@/store/childStore';
import { AVATAR_EMOJIS } from '@/data/educationData';
import { toast } from 'sonner';

interface Props { onBack: () => void; onDone: () => void; }

export const AddChildScreen = ({ onBack, onDone }: Props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(2);
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0]);
  const { addChild } = useChildStore();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Digite o nome da criança');
      return;
    }
    addChild(name.trim(), age, avatar);
    toast.success(`${name} adicionado(a) com sucesso! 🎉`);
    onDone();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4 gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={28} />
        </Button>
        <h2 className="text-2xl font-bold font-baloo">Nova Criança</h2>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 gap-8 max-w-md mx-auto w-full">
        {/* Avatar */}
        <div className="text-center">
          <span className="text-8xl bounce-in">{avatar}</span>
          <p className="text-lg font-bold mt-2 text-muted-foreground">Escolha um avatar</p>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setAvatar(e)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  e === avatar ? 'bg-primary/20 scale-110 ring-2 ring-primary' : 'hover:bg-muted'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="w-full">
          <label className="text-lg font-bold mb-2 block">Nome</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome da criança"
            className="text-xl h-14 rounded-2xl text-center"
            maxLength={20}
          />
        </div>

        {/* Age */}
        <div className="w-full">
          <label className="text-lg font-bold mb-2 block">Idade: {age} {age === 1 ? 'ano' : 'anos'}</label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5, 6].map(a => (
              <button
                key={a}
                onClick={() => setAge(a)}
                className={`w-14 h-14 rounded-2xl text-2xl font-bold transition-all ${
                  a === age
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {age <= 3 ? '🧒 Modo Mini (cores, animais, letras, números)' : '📚 Modo Kids (matemática, português, sílabas)'}
          </p>
        </div>

        <button onClick={handleSubmit} className="kid-btn bg-primary text-primary-foreground w-full text-2xl mt-4">
          Começar a Aprender! 🚀
        </button>
      </div>
    </div>
  );
};
