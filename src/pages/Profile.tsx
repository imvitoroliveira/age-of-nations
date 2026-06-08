import { useProfile } from "@/hooks/useProfile";
import { User, LogOut, Heart, Save, Key, Moon, Sun, Monitor, Ruler, Weight, Target, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  const { 
    data: profile, 
    updateProfile, 
    isUpdating, 
    linkPartner, 
    isLinking, 
    unlinkPartner, 
    isUnlinking,
    isLoading
  } = useProfile();

  const [displayName, setDisplayName] = useState("");
  const [height, setHeight] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setHeight(profile.height?.toString() || "");
      setInitialWeight(profile.initial_weight?.toString() || "");
      setFitnessGoals(profile.fitness_goals || []);
      setCustomGoal(profile.custom_fitness_goal || "");
      setBio(profile.bio || "");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

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
      fitness_goals: fitnessGoals,
      custom_fitness_goal: customGoal,
      bio: bio,
      gender: gender,
      birth_date: birthDate
    });
  };

  const toggleGoal = (goal: string) => {
    setFitnessGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal) 
        : [...prev, goal]
    );
  };

  const goalsOptions = [
    { value: "Emagrecimento", label: "🔥 Emagrecimento" },
    { value: "Ganho de Massa", label: "💪 Ganho de Massa" },
    { value: "Condicionamento", label: "⚡ Condicionamento" },
    { value: "Saúde", label: "🌿 Saúde e Bem-estar" },
    { value: "Flexibilidade", label: "🧘 Flexibilidade" },
    { value: "Resistência", label: "🏃 Resistência" }
  ];

  const handleLinkPartner = () => {
    if (!partnerCode.trim()) {
      toast.error("Informe o código do parceiro.");
      return;
    }
    linkPartner(partnerCode.trim());
    setPartnerCode("");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto pb-20 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-[600px] w-full bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl mx-auto pb-28 md:pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Perfil</h2>
        <button 
          onClick={handleLogout}
          aria-label="Sair da conta"
          className="flex items-center gap-2 rounded-2xl bg-red-50 dark:bg-red-950/30 px-5 py-2.5 text-red-600 dark:text-red-400 font-bold transition-all hover:bg-red-100 dark:hover:bg-red-950/50"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      <div className="card-premium space-y-10">
        {/* Theme Selector */}
        <section aria-labelledby="theme-heading">
          <div className="flex items-center justify-between mb-4">
            <h3 id="theme-heading" className="text-sm font-bold uppercase tracking-widest text-slate-400">Aparência</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-[1.2rem] border border-slate-100 dark:border-slate-800">
            {[
              { id: 'light', icon: Sun, label: 'Claro' },
              { id: 'system', icon: Monitor, label: 'Sistema' },
              { id: 'dark', icon: Moon, label: 'Escuro' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                aria-pressed={theme === t.id}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all font-bold text-xs ${
                  theme === t.id 
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Account Tracking Code */}
        <section aria-labelledby="tracking-heading">
          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-[1.8rem] border border-indigo-100 dark:border-indigo-900/50">
             <div className="flex items-center justify-between mb-4">
                <h3 id="tracking-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Seu Código de Rastreio</h3>
                <SparklesIcon className="text-indigo-400 h-4 w-4" />
             </div>
             <div className="flex items-center justify-between">
                <div className="text-3xl font-mono font-bold tracking-tighter text-indigo-600 dark:text-indigo-400">
                   {profile?.tracking_code || "---"}
                </div>
                <button 
                  onClick={() => profile?.tracking_code && copyToClipboard(profile.tracking_code)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/50 hover:scale-110 active:scale-90 transition-all text-indigo-600 dark:text-indigo-400"
                >
                   {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
             </div>
             <p className="text-[10px] text-indigo-400/80 mt-4 font-semibold italic">Compartilhe este código com seu parceiro para vincularem suas contas.</p>
          </div>
        </section>

        {resetMode && (
          <section className="p-6 bg-slate-900 rounded-[1.8rem] border border-indigo-500/30 animate-in zoom-in-95 duration-500">
            <h4 className="font-bold text-white flex items-center gap-2 mb-6">
              <Key size={18} className="text-indigo-400" />
              Nova Senha
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                className="flex-1 rounded-xl bg-slate-800 px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700 font-medium"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                onClick={handleUpdatePassword}
                className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
              >
                 Redefinir
              </button>
            </div>
          </section>
        )}

        <div className="space-y-8">
          <section className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <User size={14} className="text-indigo-500" /> Nome Público
            </label>
            <input 
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como quer aparecer?"
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
            />
          </section>

          <div className="grid grid-cols-2 gap-6">
            <section className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Ruler size={14} className="text-indigo-500" /> Altura (cm)
              </label>
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
                placeholder="175"
              />
            </section>
            <section className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Weight size={14} className="text-indigo-500" /> Peso (kg)
              </label>
              <input 
                type="number"
                step="0.1"
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all"
                placeholder="80.0"
              />
            </section>
          </div>

          <section className="space-y-4">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Target size={14} className="text-indigo-500" /> Seu Objetivo de Treino
              </label>
              <span className="text-[10px] font-bold text-slate-400">{customGoal.length}/150</span>
            </div>
            <textarea 
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value.slice(0, 150))}
              placeholder="Descreva detalhadamente o que você deseja alcançar..."
              rows={3}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all resize-none"
            />
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <SparklesIcon className="text-indigo-500 h-3.5 w-3.5" /> Sobre mim
              </label>
              <span className="text-[10px] font-bold text-slate-400">{bio.length}/150</span>
            </div>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 150))}
              placeholder="Conte um pouco sobre sua jornada fitness..."
              rows={3}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 transition-all resize-none"
            />
          </section>
        </div>

        <section className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <Heart className="text-indigo-500" size={18} />
             Parceiro Fitness
          </h4>
          {profile?.partner_id ? (
            <div className="flex items-center justify-between rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 p-6 border border-indigo-100 dark:border-indigo-900/30 group">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                   <Heart className="text-indigo-500 fill-indigo-500 group-hover:scale-110 transition-transform" size={24} />
                 </div>
                 <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Status: Conectado</span>
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Modo Dupla Ativo</span>
                 </div>
               </div>
               <button 
                disabled={isUnlinking}
                onClick={() => profile.partner_id && unlinkPartner(profile.partner_id)}
                className="text-sm font-bold text-red-500 hover:text-red-600 disabled:opacity-50"
               >
                 {isUnlinking ? "Desvinculando..." : "Desvincular"}
               </button>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 p-8 text-center space-y-6">
              <p className="text-sm font-medium text-slate-400">Vincule seu parceiro para treinar juntos e comparar o progresso em tempo real.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Código do parceiro" 
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value)}
                  className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-900 px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button 
                  disabled={isLinking}
                  onClick={handleLinkPartner}
                  className="rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50 hover:bg-indigo-700 transition-all"
                >
                   {isLinking ? "Vinculando..." : "Vincular Agora"}
                </button>
              </div>
            </div>
          )}
        </section>

        <button 
          onClick={handleSaveProfile}
          disabled={isUpdating}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 p-5 font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? (
            "Processando..."
          ) : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg 
      {...props}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}
