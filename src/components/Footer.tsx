import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background py-3 px-6 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto text-center">
        © 2025 РМК Диджитал. Все права защищены. Это экспериментальный ИИ-помощник. Всегда проверяйте важную информацию. 
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> </span>
        Горячие клавиши: Ctrl+K (фокус на поиск), /jira (создать задачу)
      </div>
    </footer>
  );
};