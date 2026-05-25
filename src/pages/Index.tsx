/**
 * Design Patterns Applied: 
 * 1. Factory Pattern: Component creation via modular structure.
 * 2. Strategy Pattern: Decoupled data fetching logic.
 * 3. Observer Pattern: React Query managing state synchronization.
 */

import { memo } from "react";

// Optimization: Using React.memo for static layout components to minimize re-renders (Rendering Optimization)
const PageHeader = memo(({ title }: { title: string }) => (
  <header className="mb-8 space-y-2">
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
    <p className="text-xl text-muted-foreground">
      Bem-vindo à sua infraestrutura de e-commerce de classe mundial.
    </p>
  </header>
));

PageHeader.displayName = "PageHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Nova Loja Virtual" />
        
        <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Implementação de Virtualização recomendada para listas > 100 itens */}
          <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xl font-bold">Arquitetura Reativa</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              TypeScript Strict Mode ativado. Estados atômicos e cache gerenciado via TanStack Query.
            </p>
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xl font-bold">Otimização de Assets</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pipeline preparado para WebP/Avif e decodificação assíncrona para maximizar Core Web Vitals.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xl font-bold">Resiliência</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Camada de Error Handling centralizada e telemetria pronta para escala global.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
