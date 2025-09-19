import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { ChatContainer } from '../components/ChatContainer';
import { AuthModal } from '../components/AuthModal';
import { useUserStore } from '../store/userStore';
import { useThemeStore } from '../store/themeStore';

const Index = () => {
  const { isAuthenticated } = useUserStore();
  const { theme } = useThemeStore();

  // Применяем тему при загрузке
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block">
          <SidebarLeft />
        </div>
        <ChatContainer />
        <div className="hidden lg:block">
          <SidebarRight />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
