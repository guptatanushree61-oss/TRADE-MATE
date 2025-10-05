import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { BarChart3, Package, Users, CreditCard, Menu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, onLogin }) => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { path: '/inventory', label: t('nav.inventory'), icon: Package },
    { path: '/customers', label: t('nav.customers'), icon: Users },
    { path: '/payments', label: t('nav.payments'), icon: CreditCard },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth hover:bg-accent ${
            location.pathname === path ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          } ${mobile ? 'w-full justify-start' : ''}`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            TradeMate
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <NavLinks />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSelector currentLanguage={language} onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi')} />
            
            {!isAuthenticated ? (
              <Button variant="hero" onClick={onLogin}>
                {t('hero.login')}
              </Button>
            ) : (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>TradeMate</SheetTitle>
                      <SheetDescription>Navigate through your business tools</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 mt-6">
                      <NavLinks mobile />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};