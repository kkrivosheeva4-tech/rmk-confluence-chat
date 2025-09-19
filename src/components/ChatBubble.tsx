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
    
    if (feedback === 'unhelpful') {
      setShowCommentInput(true);
    } else {
      toast({
        title: "Спасибо за оценку!",
        description: "Ваш отзыв поможет улучшить качество ответов.",
      });
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
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap">{message.content}</div>
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
                variant={message.feedback === 'helpful' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFeedback('helpful')}
                disabled={!!message.feedback}
                className="text-xs"
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                Помогло
              </Button>
              <Button
                variant={message.feedback === 'unhelpful' ? 'destructive' : 'ghost'}
                size="sm"
                onClick={() => handleFeedback('unhelpful')}
                disabled={!!message.feedback}
                className="text-xs"
              >
                <ThumbsDown className="w-3 h-3 mr-1" />
                Не помогло
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