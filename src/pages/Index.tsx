import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Nova Loja Virtual</h1>
        <p className="text-muted-foreground max-w-[500px]">
          A estrutura do aplicativo antigo foi removida. O projeto está pronto para começarmos a construção da sua nova loja virtual.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button>Ver Produtos</Button>
          <Button variant="outline">Saiba Mais</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
