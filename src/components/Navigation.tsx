import { Shield, Menu, X, LogIn, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
            <Shield className="w-6 h-6 text-primary" />
            DisasterSense
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              className="relative text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              activeClassName="text-primary font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className="relative text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              activeClassName="text-primary font-semibold"
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/features" 
              className="relative text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              activeClassName="text-primary font-semibold"
            >
              Features
            </NavLink>
            <NavLink 
              to="/safety" 
              className="relative text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              activeClassName="text-primary font-semibold"
            >
              Safety Guide
            </NavLink>
            <ThemeToggle />
            {user ? (
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            <NavLink 
              to="/" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 hover:font-medium"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 hover:font-medium"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/features" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 hover:font-medium"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Features
            </NavLink>
            <NavLink 
              to="/safety" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 hover:font-medium"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Safety Guide
            </NavLink>
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              {user ? (
                <Button onClick={handleSignOut} variant="outline" size="sm" className="flex-1">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button onClick={() => { navigate("/auth"); setIsOpen(false); }} variant="default" size="sm" className="flex-1">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
