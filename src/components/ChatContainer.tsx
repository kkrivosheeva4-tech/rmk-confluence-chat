import React, { useEffect, useRef, useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { WelcomeChips } from './WelcomeChips';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import { LLMAdapter } from '../services/LLMAdapter';
import { ACLService } from '../services/ACLService';
import { Loader2 } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const { 
    messages, 
    addMessage, 
    updateMessage, 
    isLoading, 
    setLoading, 
    selectedModel 
  } = useChatStore();
  const { role } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [leftSheetOpen, setLeftSheetOpen] = useState(false);
  const [rightSheetOpen, setRightSheetOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Добавляем сообщение пользователя
    addMessage({
      role: 'user',
      content,
    });

    setLoading(true);

    try {
      // Получаем ответ от LLM
      const answer = await LLMAdapter.generateAnswer(content, selectedModel);
      
      // Фильтруем источники по правам доступа
      const filteredSources = ACLService.filterSources(answer.sources, role);

      // Добавляем ответ бота
      const botMessage = {
        role: 'bot' as const,
        content: answer.content,
        confidence: answer.confidence,
        sources: filteredSources,
        followUpQuestions: answer.followUpQuestions,
      };

      addMessage(botMessage);

    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage({
        role: 'bot',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте ещё раз.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Мобильные кнопки навигации */}
      <div className="md:hidden flex justify-between items-center p-2 border-b bg-background">
        <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
              <span className="ml-2 text-sm">Чаты</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarLeft />
          </SheetContent>
        </Sheet>

        <Sheet open={rightSheetOpen} onOpenChange={setRightSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Settings className="w-4 h-4" />
              <span className="ml-2 text-sm">Панель</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <SidebarRight />
          </SheetContent>
        </Sheet>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {isEmpty ? (
          <WelcomeChips onQuestionSelect={handleSendMessage} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            
            {/* Индикатор загрузки */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 p-4 bg-chat-bubble-bot rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-chat-bubble-bot-foreground">
                    {selectedModel === 'fast' ? 'Быстро думаю...' : 'Анализирую подробно...'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};