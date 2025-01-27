import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  children: ReactNode;
}

export function Layout({ isDarkMode, toggleDarkMode, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <div className="lg:pl-72">
        <TopBar />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}