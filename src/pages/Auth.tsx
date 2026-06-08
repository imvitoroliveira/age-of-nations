import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
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
    console.log("Iniciando processo de autenticação:", { mode, email: data.email });
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
          console.error("Erro no login:", error);
          if (error.message.includes("Invalid login credentials") || error.message.includes("Invalid email")) {
            throw new Error("E-mail ou senha incorretos.");
          }
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Por favor, confirme seu e-mail antes de acessar.");
          }
          throw error;
        }
        
        console.log("Login bem-sucedido:", signInData);
        
        if (rememberMe) {
          localStorage.setItem(
            SAVED_LOGIN_KEY,
            JSON.stringify({ email: data.email.trim(), password })
          );
        } else {
          localStorage.removeItem(SAVED_LOGIN_KEY);
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          toast.success("Bem-vindo de volta!");
        } else {
          console.warn("Sessão não encontrada após login");
          toast.error("Erro ao iniciar sessão. Tente novamente.");
        }
        
      } else if (mode === "signup") {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name,
            },
          },
        });
        
        if (error) {
          console.error("Erro no cadastro:", error);
          if (error.message.includes("User already registered")) {
            throw new Error("Este e-mail já está cadastrado. Tente fazer login.");
          }
          throw error;
        }
        
        console.log("Cadastro bem-sucedido:", signUpData);
        
        if (signUpData.user) {
          try {
            await supabase.from('profiles').upsert({
              id: signUpData.user.id,
              username: name || data.email.split('@')[0],
              display_name: name,
              pairing_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
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
      console.error("Erro detalhado na autenticação:", error);
      toast.error(error.message || "Ocorreu um erro na autenticação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const onAuthError = (errors: any) => {
    console.log("Erros de validação do formulário:", errors);
    if (errors.email) toast.error("E-mail inválido");
    else if (errors.password) toast.error("A senha deve ter pelo menos 6 caracteres");
    else if (errors.name) toast.error("Informe um nome com pelo menos 2 caracteres");
    else toast.error("Por favor, preencha todos os campos corretamente.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
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

        <div className="rounded-3xl bg-card p-8 shadow-2xl border border-border">
          <form onSubmit={handleSubmit(onAuthSubmit, onAuthError)} className="space-y-4">
            {mode === "forgot_password" && (
              <button 
                type="button"
                onClick={() => switchMode("login")}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2"
              >
                <ArrowLeft size={16} /> Voltar para o login
              </button>
            )}

            {mode === "signup" && (
              <div className="space-y-1">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-xl bg-muted p-3 pl-12 outline-none ring-primary focus:ring-2 text-foreground"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
            )}
            
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl bg-muted p-3 pl-12 outline-none ring-primary focus:ring-2 text-foreground"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {mode !== "forgot_password" && (
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Senha"
                    className="w-full rounded-xl bg-muted p-3 pl-12 outline-none ring-primary focus:ring-2 text-foreground"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
            )}

            {mode === "signup" && (
              <div className="relative">
                <input
                  {...register("partnerCode")}
                  type="text"
                  placeholder="Código do parceiro (opcional)"
                  className="w-full rounded-xl bg-muted p-3 outline-none ring-primary focus:ring-2 text-foreground"
                />
              </div>
            )}

            {mode === "login" && (
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                Salvar login
              </label>
            )}

            {mode === "login" && (
              <button
                type="button"
                onClick={() => switchMode("forgot_password")}
                className="w-full text-right text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Esqueceu a senha?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processando...
                </span>
              ) : (
                mode === "login" ? "Entrar" : mode === "signup" ? "Criar Conta" : "Enviar Recuperação"
              )}
            </button>
          </form>

          {mode !== "forgot_password" && (
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="mt-6 w-full text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login" ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
