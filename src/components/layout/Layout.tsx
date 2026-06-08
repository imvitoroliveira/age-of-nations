import { Outlet, NavLink } from "react-router-dom";
import { Home, Dumbbell, LineChart, Award, User, Plus, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";


const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Dumbbell, label: "Treinos", path: "/workouts" },
  { icon: Plus, label: "", path: "/fast-workout", isFab: true },
  { icon: LineChart, label: "Progresso", path: "/progress" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export default function Layout() {
  const { data: profile } = useProfile();
  
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col bg-slate-950 p-8 text-white md:flex z-50">
        <div className="mb-12 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Plus className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">FitCouple</h1>
        </div>
        
        <nav className="flex flex-col gap-3">
          {navItems.filter(item => !item.isFab).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isActive 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "text-indigo-400")} />
                  <span className="font-semibold tracking-wide">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="ml-auto h-2 w-2 rounded-full bg-indigo-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/achievements"
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isActive 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )
            }
          >
             {({ isActive }) => (
                <>
                  <Award size={22} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "text-indigo-400")} />
                  <span className="font-semibold tracking-wide">Conquistas</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="ml-auto h-2 w-2 rounded-full bg-indigo-500"
                    />
                  )}
                </>
              )}
          </NavLink>
        </nav>

        <div className="mt-auto space-y-4">
          {/* Quick Theme Toggle */}
          {/* Simple Theme Indicator */}
          <div className="relative">
            <div 
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 text-slate-400 border border-white/5"
            >
              <Sun size={18} />
              <span className="font-semibold text-sm">Tema: Claro</span>
            </div>
          </div>

          <NavLink 
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-4 rounded-[1.5rem] p-4 transition-all duration-300 border border-white/5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isActive ? "bg-white/10 border-white/10" : "bg-white/5 hover:bg-white/10"
            )}
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-indigo-400 text-lg">{(profile?.display_name || profile?.username || "U").charAt(0)}</span>
              )}
            </div>
            <div className="overflow-hidden text-left">
              <p className="truncate text-sm font-bold text-white">{profile?.display_name || profile?.username || "Usuário"}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Premium Member</p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav 
        aria-label="Navegação móvel"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-950/90 backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-2xl border border-white/10 md:hidden w-[90%] max-w-sm"
      >
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <NavLink 
                key={item.path} 
                to="/workouts/create" 
                aria-label="Novo treino"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-4 ring-slate-950/50 transition-transform active:scale-90 outline-none focus-visible:ring-indigo-500"
              >
                <Plus size={32} />
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex-1 flex flex-col items-center justify-center h-12 rounded-2xl transition-all duration-300 outline-none focus-visible:bg-white/10",
                  isActive ? "text-indigo-400" : "text-slate-500"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={cn("transition-transform", isActive && "scale-110")} />
                  {isActive && (
                    <motion.div 
                      layoutId="mobileNavIndicator"
                      className="absolute -bottom-1 h-1 w-4 rounded-full bg-indigo-400"
                    />
                  )}
                  <span className="sr-only">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Content */}
      <main className="md:pl-72 min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-12 md:py-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
