import { Shield, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

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
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/features" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Features
            </NavLink>
            <NavLink 
              to="/safety" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Safety Guide
            </NavLink>
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
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/features" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Features
            </NavLink>
            <NavLink 
              to="/safety" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Safety Guide
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
