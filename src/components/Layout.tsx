import React from 'react';
import { Navbar } from '@/components/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} />
      {children}
    </div>
  );
};