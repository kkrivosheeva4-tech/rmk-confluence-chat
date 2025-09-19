import React, { useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { WelcomeChips } from './WelcomeChips';
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