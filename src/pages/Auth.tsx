import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    partnerCode: "",
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });
        if (error) throw error;
        
        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name: formData.name,
          });
          if (profileError) console.error(profileError);
        }
        
        toast.success("Conta criada com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-dark p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <div className="h-8 w-8 rounded bg-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display">FitCouple</h1>
          <p className="text-white/60">Fortalecendo o corpo e a relação.</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="password"
                placeholder="Senha"
                required
                className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Código do parceiro (opcional)"
                  className="w-full rounded-xl bg-bg p-3 outline-none ring-primary focus:ring-2"
                  value={formData.partnerCode}
                  onChange={(e) => setFormData({ ...formData, partnerCode: e.target.value })}
                />
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 w-full text-center text-sm font-medium text-text-muted"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
