import { Outlet, NavLink } from "react-router-dom";
import { Home, Dumbbell, LineChart, Award, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";


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
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-surface p-6 text-white md:flex">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <h1 className="text-xl font-bold font-display">FitCouple</h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.filter(item => !item.isFab).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                  isActive ? "bg-primary text-white" : "hover:bg-white/10 text-white/70"
                )
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/achievements"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                isActive ? "bg-primary text-white" : "hover:bg-white/10 text-white/70"
              )
            }
          >
            <Award size={20} />
            <span className="font-medium">Conquistas</span>
          </NavLink>
        </nav>

        <NavLink 
          to="/profile"
          className={({ isActive }) => cn(
            "mt-auto flex items-center gap-3 rounded-2xl p-4 transition-colors",
            isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
            {profile?.display_name ? (
              <span className="font-bold text-primary">{profile.display_name.charAt(0)}</span>
            ) : (
              <User className="text-primary" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold text-white">{profile?.display_name || profile?.username || "Usuário"}</p>
            <p className="text-xs text-white/50">Ver perfil</p>
          </div>
        </NavLink>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-card p-3 shadow-up md:hidden border-t border-border">
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <NavLink key={item.path} to={item.path} className="relative -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-card transition-transform active:scale-90">
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
                  "relative flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <item.icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {/* Active Indicator could be added here with motion.div */}
            </NavLink>
          );
        })}
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
