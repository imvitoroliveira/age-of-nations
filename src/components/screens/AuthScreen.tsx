import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface AuthScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');
const usernameSchema = z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres').max(20, 'Nome de usuário muito longo');

export const AuthScreen = ({ onBack, onSuccess }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!isLogin) {
        usernameSchema.parse(username);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Login realizado com sucesso!');
        onSuccess();
      } else {
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está registrado');
          } else if (error.message.includes('duplicate key') && error.message.includes('username')) {
            toast.error('Este nome de usuário já está em uso');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Conta criada com sucesso!');
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md animate-scale-in">
        <div className="game-panel p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="game-title text-3xl mb-2">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Acesse sua conta para jogar online' 
                : 'Crie sua conta e comece a conquistar'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-crimson"
                  placeholder="Seu nome no jogo..."
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-crimson"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 font-crimson"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="game"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:text-gold-light transition-colors"
              disabled={isLoading}
            >
              {isLogin 
                ? 'Não tem conta? Criar uma agora' 
                : 'Já tem conta? Entrar'}
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Button
              variant="gameGhost"
              onClick={onBack}
              disabled={isLoading}
            >
              ← Voltar ao Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
