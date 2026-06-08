import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User as UserIcon, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().optional().or(z.literal("")),
  name: z.string().optional().or(z.literal("")),
  partnerCode: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;
type AuthMode = "login" | "signup" | "forgot_password";

const SAVED_LOGIN_KEY = "fitcouple_saved_login";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      partnerCode: "",
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_LOGIN_KEY);
      if (saved) {
        const { email, password } = JSON.parse(saved);
        setValue("email", email || "");
        setValue("password", password || "");
        setRememberMe(true);
      }
    } catch {}
  }, [setValue]);

  const switchMode = (nextMode: AuthMode) => {
    clearErrors();
    setLoading(false);
    setMode(nextMode);
  };

  const onAuthSubmit = async (data: AuthFormData) => {
    const password = data.password ?? "";
    const name = (data.name ?? "").trim();

    if (mode !== "forgot_password" && password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (mode === "signup" && name.length < 2) {
      toast.error("Informe seu nome para criar a conta.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { error, data: signInData } = await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials") || error.message.includes("Invalid email")) {
            throw new Error("E-mail ou senha incorretos.");
          }
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Por favor, confirme seu e-mail antes de acessar.");
          }
          throw error;
        }
        
        if (rememberMe) {
          localStorage.setItem(
            SAVED_LOGIN_KEY,
            JSON.stringify({ email: data.email.trim(), password })
          );
        } else {
          localStorage.removeItem(SAVED_LOGIN_KEY);
        }
        
        toast.success("Bem-vindo de volta!");
        
      } else if (mode === "signup") {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        
        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("Este e-mail já está cadastrado. Tente fazer login.");
          }
          throw error;
        }
        
        if (signUpData.user) {
          try {
            await supabase.from('profiles').upsert({
              id: signUpData.user.id,
              username: name || data.email.split('@')[0],
              display_name: name,
            }, { onConflict: 'id' });
          } catch (e) {
            console.error("Erro na lógica de perfil pós-cadastro:", e);
          }
        }
        
        toast.success("Conta criada! Verifique seu email para confirmar.");
      } else if (mode === "forgot_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email.trim(), {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) throw error;
        toast.success("Email de recuperação enviado!");
        setMode("login");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="w-full lg:w-[50%] flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 mb-6 shadow-xl shadow-indigo-600/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
              {mode === "login" ? "Bem-vindo de volta" : mode === "signup" ? "Comece sua jornada" : "Recupere sua senha"}
            </h1>
            <p className="text-slate-400 font-medium">
              {mode === "login" ? "Entre para continuar seus treinos em dupla." : mode === "signup" ? "Crie sua conta e conecte-se com seu parceiro." : "Enviaremos um link para resetar sua senha."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onAuthSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Como quer ser chamado?"
                      className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="exemplo@email.com"
                  className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white transition-all"
                />
              </div>
            </div>

            {mode !== "forgot_password" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Senha</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => switchMode("forgot_password")} className="text-xs font-bold text-indigo-500 hover:text-indigo-400">Esqueceu?</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white transition-all"
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-400 cursor-pointer group ml-1">
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-full w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                  />
                  <CheckCircle className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                Manter conectado
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>{mode === "login" ? "Entrar na Conta" : mode === "signup" ? "Criar Minha Conta" : "Enviar Link"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-900 text-center">
             <p className="text-slate-500 font-medium">
               {mode === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"}
               <button 
                 onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                 className="ml-2 text-indigo-500 font-bold hover:text-indigo-400"
               >
                 {mode === "login" ? "Cadastre-se agora" : "Faça o login"}
               </button>
             </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block lg:w-[50%] relative overflow-hidden bg-indigo-600">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80" 
          alt="Fitness" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 scale-105 hover:scale-100 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute bottom-20 left-20 right-20">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 1 }}
           >
             <h2 className="text-5xl font-bold text-white leading-tight font-display mb-6">A evolução é <br/><span className="text-indigo-400">melhor em dupla.</span></h2>
             <div className="flex gap-4">
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">Performance</div>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">Conexão</div>
             </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg 
      {...props}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
