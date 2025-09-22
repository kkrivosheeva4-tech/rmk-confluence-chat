import React from 'react';
import { Button } from './ui/button';

interface WelcomeChipsProps {
  onQuestionSelect: (question: string) => void;
}

const popularQuestions = [
  'Зачем нам вообще нужна распределённая файловая система DFS?',
  'Что такое Ansible и зачем он нам нужен?',
  'Кто отвечает за направление «Связь» и где вести задачи?',
];

export const WelcomeChips: React.FC<WelcomeChipsProps> = ({ onQuestionSelect }) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Добро пожаловать в RMK Assist
        </h2>
        <p className="text-muted-foreground">
          Интеллектуальный помощник для поиска по корпоративной базе знаний
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Популярные вопросы:</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {popularQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onQuestionSelect(question)}
              className="text-left hover:bg-accent hover:text-accent-foreground"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};