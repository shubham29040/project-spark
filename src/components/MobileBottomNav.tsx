import { Home, LayoutDashboard, Sparkles, ShieldCheck, Settings, LogIn, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

const MobileBottomNav = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/features", icon: Sparkles, label: "Features" },
    { to: "/safety", icon: ShieldCheck, label: "Safety" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground min-w-[56px]"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">{item.label}</span>
          </NavLink>
        ))}
        {user ? (
          <NavLink
            to="/settings"
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground min-w-[56px]"
            activeClassName="text-primary bg-primary/10"
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">Settings</span>
          </NavLink>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground min-w-[56px]"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
