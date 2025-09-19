import React, { useEffect } from 'react';
import { Header } from '../components/Header';
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
        <SidebarLeft />
        <ChatContainer />
        <SidebarRight />
      </div>
    </div>
  );
};

export default Index;
