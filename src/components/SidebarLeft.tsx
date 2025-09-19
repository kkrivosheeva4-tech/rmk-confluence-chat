import React, { useState } from 'react';
import { Plus, Trash2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CustomTooltip } from './ui/CustomTooltip';
import { useChatStore } from '../store/chatStore';

export const SidebarLeft: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { chatHistory, createNewChat, loadChat, deleteChat, currentChatId } = useChatStore();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border p-2 flex flex-col gap-2">
        <CustomTooltip content="Развернуть историю">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-full h-10"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </CustomTooltip>
        
        <CustomTooltip content="Новый чат">
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewChat}
            className="w-full h-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CustomTooltip>

        <div className="border-t border-sidebar-border pt-2 mt-2 space-y-1 overflow-auto">
          {chatHistory.slice(0, 8).map((chat) => (
            <CustomTooltip key={chat.id} content={chat.title}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadChat(chat.id)}
                className={`w-full h-10 p-0 ${
                  currentChatId === chat.id ? 'bg-sidebar-accent' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </CustomTooltip>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border">
      {/* Заголовок */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <h2 className="font-semibold text-sidebar-foreground">История чатов</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="w-8 h-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Кнопка нового чата */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={createNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          Новый чат
        </Button>
      </div>

      {/* Список чатов */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {chatHistory.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            Пока нет сохранённых чатов
          </div>
        ) : (
          chatHistory.map((chat) => (
            <Card
              key={chat.id}
              className={`p-3 cursor-pointer hover:bg-sidebar-accent transition-colors group ${
                currentChatId === chat.id ? 'bg-sidebar-accent border-sidebar-primary' : ''
              }`}
              onClick={() => loadChat(chat.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-sidebar-foreground truncate">
                    {chat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
                <CustomTooltip content="Удалить чат">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </CustomTooltip>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};