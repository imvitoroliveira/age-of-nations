import { useProfile } from "@/hooks/useProfile";
import { User, LogOut, Heart, Save, Key, Moon, Sun, Monitor, Ruler, Weight, Target } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const { 
    data: profile, 
    updateProfile, 
    isUpdating, 
    linkPartner, 
    isLinking, 
    unlinkPartner, 
    isUnlinking 
  } = useProfile();

  // Local state for form fields
  const [displayName, setDisplayName] = useState("");
  const [height, setHeight] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setHeight(profile.height?.toString() || "");
      setInitialWeight(profile.initial_weight?.toString() || "");
      setGoal(profile.goal || "");
      setGender(profile.gender || "");
      setBirthDate(profile.birth_date || "");
    }
  }, [profile]);

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

  const handleSaveProfile = () => {
    updateProfile({
      display_name: displayName,
      height: height ? parseFloat(height) : null,
      initial_weight: initialWeight ? parseFloat(initialWeight) : null,
      goal: goal,
      gender: gender,
      birth_date: birthDate
    });
  };

  const handleLinkPartner = () => {
    if (!partnerCode.trim()) {
      toast.error("Informe o código do parceiro.");
      return;
    }
    linkPartner(partnerCode.trim());
    setPartnerCode("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-foreground">Configurações do Perfil</h2>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 text-destructive font-bold transition-colors hover:bg-destructive/20"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      <div className="rounded-3xl bg-card p-8 shadow-lg border border-border">
        {/* Theme Toggler */}
        <div className="mb-8 p-4 bg-muted/30 rounded-2xl flex items-center justify-between">
          <span className="font-bold text-sm">Tema do Aplicativo</span>
          <div className="flex bg-muted rounded-lg p-1">
            <button 
              onClick={() => setTheme("light")}
              className={`p-2 rounded-md transition-all ${theme === "light" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
              title="Claro"
            >
              <Sun size={18} />
            </button>
            <button 
              onClick={() => setTheme("system")}
              className={`p-2 rounded-md transition-all ${theme === "system" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
              title="Sistema"
            >
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setTheme("dark")}
              className={`p-2 rounded-md transition-all ${theme === "dark" ? "bg-card shadow-sm text-primary" : "text-muted-foreground"}`}
              title="Escuro"
            >
              <Moon size={18} />
            </button>
          </div>
        </div>

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
                className="flex-1 rounded-xl bg-muted px-4 py-2 text-sm outline-none ring-primary focus:ring-2 text-foreground"
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

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              <User size={16} className="text-primary" /> Nome de usuário
            </label>
            <input 
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full rounded-2xl bg-muted p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-1">
                <Ruler size={16} className="text-primary" /> Altura (cm)
              </label>
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-2xl bg-muted p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="175"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-1">
                <Weight size={16} className="text-primary" /> Peso (kg)
              </label>
              <input 
                type="number"
                step="0.1"
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                className="w-full rounded-2xl bg-muted p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="80.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              <Target size={16} className="text-primary" /> Objetivo
            </label>
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-2xl bg-muted p-4 font-bold outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none"
            >
              <option value="">Selecione um objetivo</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Ganho de Massa">Ganho de Massa</option>
              <option value="Condicionamento">Condicionamento Físico</option>
              <option value="Saúde">Saúde e Bem-estar</option>
            </select>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-border space-y-4">
          <h4 className="font-bold text-foreground">Vínculo de Casal</h4>
          {profile?.partner_id ? (
            <div className="flex items-center justify-between rounded-2xl bg-accent/10 p-4 border-2 border-accent/20">
               <div className="flex items-center gap-3">
                 <Heart className="text-accent fill-accent" size={20} />
                 <span className="font-bold text-foreground">Conectado(a)</span>
               </div>
               <button 
                disabled={isUnlinking}
                onClick={() => profile.partner_id && unlinkPartner(profile.partner_id)}
                className="text-sm font-bold text-destructive hover:underline disabled:opacity-50"
               >
                 {isUnlinking ? "Desvinculando..." : "Desvincular"}
               </button>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-muted p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">Você ainda não vinculou um parceiro.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Código do parceiro" 
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value)}
                  className="flex-1 rounded-xl bg-muted px-4 py-2 text-sm outline-none ring-primary focus:ring-2 text-foreground"
                />
                <button 
                  disabled={isLinking}
                  onClick={handleLinkPartner}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                   {isLinking ? "..." : "Vincular"}
                </button>
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded-xl inline-block">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                  Seu código para compartilhar:
                </p>
                <span className="text-primary font-mono font-bold select-all text-lg">
                  {profile?.pairing_code || "---"}
                </span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleSaveProfile}
          disabled={isUpdating}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary p-4 font-bold text-white shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? (
            "Salvando..."
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </div>
  );
}

