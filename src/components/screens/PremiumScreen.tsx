import { useState } from 'react';
import { ArrowLeft, Crown, Check, Star, Infinity, Clock, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
  onSubscribe?: (plan: 'monthly' | 'yearly') => void;
}

const PLANS = [
  {
    id: 'monthly' as const,
    name: 'Mensal',
    price: 'R$ 19,90',
    period: '/mês',
    highlight: false,
    badge: null,
  },
  {
    id: 'yearly' as const,
    name: 'Anual',
    price: 'R$ 149,90',
    period: '/ano',
    highlight: true,
    badge: 'Economize 37%',
    monthlyEquiv: 'R$ 12,49/mês',
  },
];

const BENEFITS = [
  { icon: Infinity, text: 'Tempo ilimitado de aprendizado', color: 'text-kid-blue' },
  { icon: Star, text: 'Todas as atividades desbloqueadas', color: 'text-kid-yellow' },
  { icon: ShieldCheck, text: 'Relatórios detalhados de progresso', color: 'text-kid-green' },
  { icon: Crown, text: 'Itens exclusivos na Fazendinha', color: 'text-kid-purple' },
  { icon: Sparkles, text: 'Novas atividades toda semana', color: 'text-kid-pink' },
];

export const PremiumScreen = ({ onBack, onSubscribe }: Props) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulated — will be replaced with Stripe integration
    setTimeout(() => {
      setLoading(false);
      toast.info('Pagamentos serão ativados em breve! 🚀');
      onSubscribe?.(selectedPlan);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-kid-purple/10 via-kid-pink/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-48 h-48 bg-kid-yellow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-kid-blue/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center p-4 relative z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-primary/10">
          <ArrowLeft size={24} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 pb-8 relative z-10">
        {/* Hero */}
        <div className="text-center mb-6 slide-up">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-kid-yellow to-kid-orange flex items-center justify-center mx-auto mb-4 bounce-in shadow-lg"
            style={{ boxShadow: 'var(--shadow-glow-yellow)' }}>
            <Crown size={40} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-baloo hero-gradient-text">
            Kidari Premium
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold max-w-xs mx-auto">
            Desbloqueie todo o potencial de aprendizado do seu filho
          </p>
        </div>

        {/* Benefits */}
        <div className="w-full max-w-sm mb-6">
          <div className="bg-card rounded-[1.5rem] p-5 shadow-md border border-border/50 space-y-3 slide-up stagger-1" style={{ animationFillMode: 'both' }}>
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0`}>
                  <b.icon size={16} className={b.color} />
                </div>
                <span className="text-sm font-semibold text-foreground">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="w-full max-w-sm space-y-3 mb-6">
          {PLANS.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left relative slide-up ${
                selectedPlan === plan.id
                  ? plan.highlight
                    ? 'border-kid-yellow bg-kid-yellow/5 shadow-md'
                    : 'border-primary bg-primary/5 shadow-md'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
              style={{ animationDelay: `${0.15 + i * 0.08}s`, animationFillMode: 'both' }}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 badge-pill bg-kid-yellow text-foreground shadow-sm text-[10px]">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{plan.name}</p>
                  {'monthlyEquiv' in plan && plan.monthlyEquiv && (
                    <p className="text-xs text-muted-foreground mt-0.5">{plan.monthlyEquiv}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-baloo text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              {/* Radio indicator */}
              <div className={`absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === plan.id ? 'border-primary' : 'border-muted-foreground/30'
              }`}>
                {selectedPlan === plan.id && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
              {/* Adjust padding for radio */}
              <div className="absolute inset-0 pl-10" />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="kid-btn-gradient w-full max-w-sm text-xl slide-up stagger-4"
          style={{ animationFillMode: 'both' }}
        >
          {loading ? 'Processando...' : 'Assinar Premium ✨'}
        </button>

        <p className="text-xs text-muted-foreground mt-3 text-center max-w-xs">
          Cancele a qualquer momento. Sem compromisso.
        </p>

        {/* Comparison */}
        <div className="w-full max-w-sm mt-8 slide-up stagger-5" style={{ animationFillMode: 'both' }}>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 text-center">Gratuito vs Premium</h3>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-bold p-3 border-b border-border/30 bg-muted/30">
              <span className="text-muted-foreground">Recurso</span>
              <span className="text-center text-muted-foreground">Grátis</span>
              <span className="text-center text-kid-yellow">Premium</span>
            </div>
            {[
              ['Tempo diário', '15 min', 'Ilimitado'],
              ['Atividades', 'Básicas', 'Todas'],
              ['Relatórios', 'Simples', 'Completos'],
              ['Fazendinha', 'Limitada', 'Completa'],
              ['Novidades', '—', 'Semanais'],
            ].map(([feature, free, premium], i) => (
              <div key={i} className={`grid grid-cols-3 text-xs p-3 ${i % 2 === 0 ? 'bg-muted/10' : ''}`}>
                <span className="font-semibold text-foreground">{feature}</span>
                <span className="text-center text-muted-foreground">{free}</span>
                <span className="text-center font-bold text-kid-green">{premium}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
