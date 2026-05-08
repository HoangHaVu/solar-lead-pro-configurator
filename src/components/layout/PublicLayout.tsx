import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
};
