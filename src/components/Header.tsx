import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useThemeStore } from '../store/themeStore';
import { useUserStore } from '../store/userStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { username, logout } = useUserStore();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 shadow-sm">
      {/* Логотип */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">Р</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">RMK Assist</h1>
      </div>

      {/* Пользователь и управление */}
      <div className="flex items-center gap-4">
        {/* Информация о пользователе */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{username}. Пользователь</span>
        </div>

        {/* Переключатель темы */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Переключить тему</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Кнопка выхода */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-9 h-9 p-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выйти из аккаунта</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};