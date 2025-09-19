import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useUserStore } from '../store/userStore';
import { useToast } from '../hooks/use-toast';

export const AuthModal: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useUserStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${username}!`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Не удалось выполнить вход. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">Р</span>
          </div>
          <CardTitle className="text-2xl">RMK Assist</CardTitle>
          <CardDescription>
            Войдите в систему для доступа к корпоративному чат-боту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!username || !password || isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p>Демо-режим: любые данные для входа</p>
            <p>Используйте "admin" в логине для прав администратора</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};