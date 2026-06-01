import { useProfile } from "@/hooks/useProfile";
import { User, LogOut, Heart, Calendar, Save, Key } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { data: profile } = useProfile();

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      setResetMode(true);
      toast.info("Defina sua nova senha abaixo.");
    }
  }, [searchParams]);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha atualizada com sucesso!");
      setResetMode(false);
      setNewPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast.success("Até logo!");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display">Meu Perfil</h2>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-red-600 font-bold transition-colors hover:bg-red-100"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-lg">
        {resetMode && (
          <div className="mb-8 p-6 bg-primary/5 rounded-2xl border-2 border-primary/20 animate-in fade-in slide-in-from-top-4">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <Key size={18} className="text-primary" />
              Redefinir Senha
            </h4>
            <div className="flex gap-2">
              <input 
                type="password" 
                placeholder="Nova senha" 
                className="flex-1 rounded-xl bg-bg px-4 py-2 text-sm outline-none ring-primary focus:ring-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                onClick={handleUpdatePassword}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20"
              >
                 Atualizar
              </button>
            </div>
          </div>
        )}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-white shadow-xl">
            <User size={40} className="text-primary" />
            <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md border border-bg">
              <Calendar size={14} />
            </button>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">{profile?.display_name || profile?.username || "Carregando..." }</h3>
            <p className="text-sm text-text-muted">Objetivo: Emagrecimento</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-bg p-4">
            <p className="text-xs font-bold text-text-muted uppercase">Altura</p>
            <p className="text-lg font-bold">175 <span className="text-sm font-medium">cm</span></p>
          </div>
          <div className="rounded-2xl bg-bg p-4">
            <p className="text-xs font-bold text-text-muted uppercase">Peso Inicial</p>
            <p className="text-lg font-bold">82.0 <span className="text-sm font-medium">kg</span></p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="font-bold">Dados do Casal</h4>
          {profile?.partner_id ? (
            <div className="flex items-center justify-between rounded-2xl bg-accent/10 p-4 border-2 border-accent/20">
               <div className="flex items-center gap-3">
                 <Heart className="text-accent fill-accent" size={20} />
                 <span className="font-bold">Vinculado a Maria</span>
               </div>
               <button className="text-sm font-bold text-accent">Desvincular</button>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-bg p-6 text-center">
              <p className="text-sm text-text-muted mb-4">Você ainda não vinculou um parceiro.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Código do parceiro" 
                  className="flex-1 rounded-xl bg-bg px-4 py-2 text-sm outline-none ring-primary focus:ring-2"
                />
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20">
                   Vincular
                </button>
              </div>
              <p className="mt-4 text-[10px] text-text-muted uppercase font-bold tracking-wider">
                Seu código: <span className="text-primary select-all">FIT-7392</span>
              </p>
            </div>
          )}
        </div>

        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-surface p-4 font-bold text-white shadow-xl transition-all active:scale-95">
          <Save size={20} />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
