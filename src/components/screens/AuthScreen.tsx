import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4 gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft size={28} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <h1 className="text-4xl font-extrabold font-baloo text-primary mb-2">
          {isLogin ? '👋 Olá!' : '✨ Criar Conta'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isLogin ? 'Entre na sua conta' : 'Área dos pais e responsáveis'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Seu nome"
                className="pl-10 h-14 rounded-2xl text-lg"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-mail"
              className="pl-10 h-14 rounded-2xl text-lg"
              required
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha"
              className="pl-10 h-14 rounded-2xl text-lg"
              minLength={6}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="kid-btn bg-primary text-primary-foreground w-full text-xl">
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-primary font-bold">
          {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
};
