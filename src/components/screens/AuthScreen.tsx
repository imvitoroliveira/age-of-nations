import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Props { onBack: () => void; onSuccess: () => void; }

export const AuthScreen = ({ onBack, onSuccess }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Bem-vindo(a) de volta! 🎉');
        onSuccess();
      } else {
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pattern-circles">
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
          <ArrowLeft size={24} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <div className="relative mb-2">
          <h1 className="text-4xl font-extrabold font-baloo hero-gradient-text bounce-in">
            {isLogin ? 'Olá!' : 'Criar Conta'}
          </h1>
          <Sparkles size={20} className="absolute -top-1 -right-5 text-kid-yellow pulse-glow" />
        </div>
        <p className="text-muted-foreground mb-8 font-semibold">
          {isLogin ? 'Entre na sua conta' : 'Área dos pais e responsáveis'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {!isLogin && (
            <div className="relative slide-up">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Seu nome"
                className="pl-11 h-14 rounded-2xl text-lg border-2 border-border/50 focus:border-primary"
                required
              />
            </div>
          )}
          <div className="relative slide-up stagger-1" style={{ animationFillMode: 'both' }}>
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              className="pl-11 h-14 rounded-2xl text-lg border-2 border-border/50 focus:border-primary"
              required
            />
          </div>
          <div className="relative slide-up stagger-2" style={{ animationFillMode: 'both' }}>
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              className="pl-11 h-14 rounded-2xl text-lg border-2 border-border/50 focus:border-primary"
              minLength={6}
              required
            />
          </div>
          <button type="submit" disabled={loading}
            className="kid-btn-gradient w-full text-xl slide-up stagger-3" style={{ animationFillMode: 'both' }}>
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-primary font-bold hover:underline transition-all">
          {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
};
