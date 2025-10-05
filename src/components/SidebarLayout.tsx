import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  pageTitle?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ 
  children, 
  showBackButton = false,
  pageTitle 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/') {
      return;
    }
    navigate(-1);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-12 md:h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-8 w-8" />
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('nav.back')}
                </Button>
              )}
              {pageTitle && (
                <h1 className="ml-2 text-base md:text-lg font-semibold text-foreground">
                  {pageTitle}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi')} 
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};