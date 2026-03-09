import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onSelectMini: () => void;
  onSelectKids: () => void;
}

export const LandingPage = ({ onSelectMini, onSelectKids }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--kids-blue)/0.1)] via-background to-[hsl(var(--kids-purple)/0.1)] flex flex-col">
      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-4xl md:text-6xl text-primary mb-2">
          Aprendiz Kids
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-nunito max-w-md mx-auto">
          Aprender brincando é mais divertido! ✨
        </p>
      </header>

      {/* Age Group Selection */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-6 pb-12 max-w-4xl mx-auto w-full">
        {/* Mini Card */}
        <button
          onClick={onSelectMini}
          className="kids-card flex-1 w-full max-w-sm bg-card border-kids-orange text-center group"
        >
          <div className="text-7xl mb-4 group-hover:animate-wiggle">🧸</div>
          <h2 className="text-3xl text-kids-orange mb-2">Mini</h2>
          <p className="text-sm text-muted-foreground font-nunito mb-4">1 a 3 anos</p>
          <div className="flex flex-wrap justify-center gap-2 text-2xl">
            <span>🎨</span>
            <span>🐶</span>
            <span>🔤</span>
            <span>🔢</span>
          </div>
          <p className="text-xs text-muted-foreground font-nunito mt-3">
            Cores • Animais • Letras • Números
          </p>
        </button>

        {/* Kids Card */}
        <button
          onClick={onSelectKids}
          className="kids-card flex-1 w-full max-w-sm bg-card border-kids-purple text-center group"
        >
          <div className="text-7xl mb-4 group-hover:animate-wiggle">📚</div>
          <h2 className="text-3xl text-kids-purple mb-2">Kids</h2>
          <p className="text-sm text-muted-foreground font-nunito mb-4">4 a 6 anos</p>
          <div className="flex flex-wrap justify-center gap-2 text-2xl">
            <span>➕</span>
            <span>📖</span>
            <span>🧩</span>
          </div>
          <p className="text-xs text-muted-foreground font-nunito mt-3">
            Matemática • Português • Sílabas
          </p>
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        Aprendiz Kids © 2025 • Feito com 💜 para crianças
      </footer>
    </div>
  );
};
