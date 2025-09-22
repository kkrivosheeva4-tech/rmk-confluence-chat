import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CustomTooltip } from './ui/CustomTooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Задайте вопрос...."
          className="flex-1 min-h-[50px] max-h-[120px] resize-none"
          disabled={disabled}
        />
        <CustomTooltip content="Отправить сообщение (Enter)">
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </CustomTooltip>
      </form>
    </div>
  );
};