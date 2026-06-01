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
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome muito curto").optional(),
  partnerCode: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

type AuthMode = "login" | "signup" | "forgot_password";

const SAVED_LOGIN_KEY = "fitcouple_saved_login";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AuthFormData>({
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

  const onAuthSubmit = async (data: AuthFormData) => {
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        
        if (rememberMe) {
          localStorage.setItem(
            SAVED_LOGIN_KEY,
            JSON.stringify({ email: data.email, password: data.password })
          );
        } else {
          localStorage.removeItem(SAVED_LOGIN_KEY);
        }
        toast.success("Bem-vindo de volta!");
      } else if (mode === "signup") {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
            },
          },
        });
        if (error) throw error;
        
        if (signUpData.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: signUpData.user.id,
              username: data.name,
              display_name: data.name,
            }
          ]);
          if (profileError) console.error(profileError);
        }
        
        toast.success("Conta criada! Verifique seu email se necessário.");
      } else if (mode === "forgot_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/profile?reset=true`,
        });
        if (error) throw error;
        toast.success("Email de recuperação enviado!");
        setMode("login");
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
          <form onSubmit={handleSubmit(onAuthSubmit)} className="space-y-4">
            {mode === "forgot_password" && (
              <button 
                type="button"
                onClick={() => setMode("login")}
                className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-2"
              >
                <ArrowLeft size={16} /> Voltar para o login
              </button>
            )}

            {mode === "signup" && (
              <div className="space-y-1">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
            )}
            
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {mode !== "forgot_password" && (
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Senha"
                    className="w-full rounded-xl bg-bg p-3 pl-12 outline-none ring-primary focus:ring-2"
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
                  className="w-full rounded-xl bg-bg p-3 outline-none ring-primary focus:ring-2"
                />
              </div>
            )}

            {mode === "login" && (
              <label className="flex items-center gap-2 text-sm font-medium text-text-muted cursor-pointer select-none">
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
                onClick={() => setMode("forgot_password")}
                className="w-full text-right text-xs font-medium text-text-muted hover:text-primary transition-colors"
              >
                Esqueceu a senha?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary p-4 font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processando..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar Conta" : "Enviar Recuperação"}
            </button>
          </form>

          {mode !== "forgot_password" && (
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="mt-6 w-full text-center text-sm font-medium text-text-muted"
            >
              {mode === "login" ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}