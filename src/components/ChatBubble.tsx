import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Message } from '../types/Message';
import { useChatStore } from '../store/chatStore';
import { useToast } from '../hooks/use-toast';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const { updateMessage } = useChatStore();
  const { toast } = useToast();

  const handleFeedback = (feedback: 'helpful' | 'unhelpful') => {
    updateMessage(message.id, { feedback });
    
    if (feedback === 'helpful') {
      toast({
        title: "Спасибо за оценку!",
        description: "Данный ответ будет учитываться при дальнейшем обучении модели!",
      });
      setShowCommentInput(true); // Показываем поле для комментария даже для положительного отзыва
    } else {
      toast({
        title: "Спасибо за отзыв!",
        description: "Ваша оценка поможет улучшить ответы",
      });
      setShowCommentInput(true);
    }
  };

  const handleCommentSubmit = () => {
    updateMessage(message.id, { comment });
    setShowCommentInput(false);
    toast({
      title: "Комментарий сохранён",
      description: "Спасибо за обратную связь!",
    });
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className={`max-w-[70%] space-y-2 ${isUser ? 'order-first' : ''}`}>
        <Card className={`p-4 ${
          isUser 
            ? 'bg-chat-bubble-user text-chat-bubble-user-foreground ml-auto' 
            : 'bg-chat-bubble-bot text-chat-bubble-bot-foreground'
        }`}>
          <div className="text-sm leading-relaxed">
            {message.content.replace(/\*\*/g, '').replace(/\*/g, '')}
          </div>

          {/* Источники */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/20">
              <p className="text-xs font-medium mb-2">Источники:</p>
              <div className="space-y-1">
                {message.sources.map((source, index) => (
                  <div key={index} className="text-xs">
                    <a 
                      href={source.url} 
                      className="text-primary hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                    <p className="text-muted-foreground mt-1">
                      {source.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки оценки */}
          {!isUser && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('helpful')}
                disabled={!!message.feedback}
                className={`text-xs gap-1 transition-colors ${
                  message.feedback === 'helpful' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800' 
                    : 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${message.feedback === 'helpful' ? 'text-green-600' : 'text-green-500'}`} />
                <span className={message.feedback === 'helpful' ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-400'}>
                  Помогло
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('unhelpful')}
                disabled={!!message.feedback}
                className={`text-xs gap-1 transition-colors ${
                  message.feedback === 'unhelpful' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800' 
                    : 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400'
                }`}
              >
                <ThumbsDown className={`w-4 h-4 ${message.feedback === 'unhelpful' ? 'text-red-600' : 'text-red-500'}`} />
                <span className={message.feedback === 'unhelpful' ? 'text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'}>
                  Не помогло
                </span>
              </Button>
            </div>
          )}
        </Card>

        {/* Поле для комментария */}
        {showCommentInput && (
          <Card className="p-3 bg-muted">
            <p className="text-sm font-medium mb-2">Расскажите, что можно улучшить:</p>
            <Textarea
              placeholder="Ваш комментарий..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[60px] mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCommentSubmit}>
                Отправить
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCommentInput(false)}
              >
                Отмена
              </Button>
            </div>
          </Card>
        )}

        {/* Уточняющие вопросы */}
        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Возможно, вас интересует:</p>
            <div className="flex flex-wrap gap-2">
              {message.followUpQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    // Здесь можно добавить логику отправки уточняющего вопроса
                    console.log('Follow-up question:', question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};