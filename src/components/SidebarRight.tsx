import React, { useState } from 'react';
import { 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  ChevronRight, 
  Settings,
  Download,
  Trash2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CustomTooltip } from './ui/CustomTooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import { useToast } from '../hooks/use-toast';

export const SidebarRight: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastIndexUpdate] = useState(new Date());
  
  const { 
    messages, 
    clearCurrentChat, 
    exportChatToTxt, 
    selectedModel, 
    setSelectedModel 
  } = useChatStore();
  const { role } = useUserStore();
  const { toast } = useToast();

  const hasMessages = messages.length > 0;
  
  // Фильтруем сообщения для вкладок
  const sources = messages.flatMap(m => m.sources || []).filter((source, index, arr) => 
    arr.findIndex(s => s.url === source.url) === index
  );
  
  const helpfulMessages = messages.filter(m => m.feedback === 'helpful');
  const unhelpfulMessages = messages.filter(m => m.feedback === 'unhelpful');

  const handleExport = () => {
    if (!hasMessages) return;
    
    const content = exportChatToTxt();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Экспорт завершён",
      description: "Чат сохранён в файл",
    });
  };

  const handleClearChat = () => {
    if (!hasMessages) return;
    
    clearCurrentChat();
    toast({
      title: "Чат очищен",
      description: "Все сообщения удалены",
    });
  };

  const handleEscalation = () => {
    toast({
      title: "Функционал недоступен",
      description: "Эскалация в Jira временно недоступна",
      variant: "destructive",
    });
  };

  const getTimeSinceUpdate = () => {
    const minutes = Math.floor((Date.now() - lastIndexUpdate.getTime()) / 60000);
    return `${minutes} мин назад`;
  };

  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-sidebar border-l border-sidebar-border p-2 flex flex-col gap-2">
        <CustomTooltip content="Развернуть панель">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-full h-10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CustomTooltip>
        
        <CustomTooltip content="Источники">
          <Button variant="ghost" size="sm" className="w-full h-10">
            <FileText className="w-6 h-6" />
          </Button>
        </CustomTooltip>
        
        <CustomTooltip content="Помогло">
          <Button variant="ghost" size="sm" className="w-full h-10">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </Button>
        </CustomTooltip>
        
        <CustomTooltip content="Не помогло">
          <Button variant="ghost" size="sm" className="w-full h-10">
            <ThumbsDown className="w-6 h-6 text-red-600" />
          </Button>
        </CustomTooltip>
        
        <CustomTooltip content="Эскалация">
          <Button variant="ghost" size="sm" className="w-full h-10" onClick={handleEscalation}>
            <AlertTriangle className="w-6 h-6" />
          </Button>
        </CustomTooltip>
        
        <div className="border-t border-sidebar-border pt-2 mt-2 space-y-2">
          <CustomTooltip content="Очистить чат">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-10" 
              onClick={handleClearChat}
              disabled={!hasMessages}
            >
              <Trash2 className="w-6 h-6" />
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Экспорт">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-10" 
              onClick={handleExport}
              disabled={!hasMessages}
            >
              <Download className="w-6 h-6" />
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Выбор модели - реализация на будущее">
            <Button variant="ghost" size="sm" className="w-full h-10" disabled>
              <Settings className="w-6 h-6" />
            </Button>
          </CustomTooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col">
      {/* Заголовок */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <h2 className="font-semibold text-sidebar-foreground">Панель управления</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="w-8 h-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Вкладки */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="sources" className="h-full">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <CustomTooltip content="Раздел отображающий источники, из которых взяты ответы">
              <TabsTrigger value="sources" className="text-xs">
                <FileText className="w-5 h-5" />
              </TabsTrigger>
            </CustomTooltip>
            <CustomTooltip content="Ответы, которые помогли">
              <TabsTrigger value="helpful" className="text-xs">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </TabsTrigger>
            </CustomTooltip>
            <CustomTooltip content="Ответы, которые не помогли">
              <TabsTrigger value="unhelpful" className="text-xs">
                <ThumbsDown className="w-5 h-5 text-red-600" />
              </TabsTrigger>
            </CustomTooltip>
            <CustomTooltip content="Раздел в разработке">
              <TabsTrigger value="escalations" className="text-xs" onClick={handleEscalation}>
                <AlertTriangle className="w-5 h-5" />
              </TabsTrigger>
            </CustomTooltip>
          </TabsList>

          <div className="p-2 h-[calc(100%-60px)] overflow-auto">
            <TabsContent value="sources" className="mt-0 space-y-2">
              {sources.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Пока нет источников
                </div>
              ) : (
                sources.map((source, index) => (
                  <Card key={index} className="p-3">
                    <a 
                      href={source.url}
                      className="text-sm font-medium text-primary hover:underline block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {source.excerpt}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        source.accessLevel === 'public' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {source.accessLevel === 'public' ? 'Публичный' : 'Ограниченный'}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="helpful" className="mt-0 space-y-2">
              {helpfulMessages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Пока нет полезных ответов
                </div>
              ) : (
                helpfulMessages.map((message) => (
                  <Card key={message.id} className="p-3">
                    <p className="text-sm">{message.content.slice(0, 100)}...</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleString('ru-RU')}
                    </p>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="unhelpful" className="mt-0 space-y-2">
              {unhelpfulMessages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Пока нет отмеченных ответов
                </div>
              ) : (
                unhelpfulMessages.map((message) => (
                  <Card key={message.id} className="p-3">
                    <p className="text-sm">{message.content.slice(0, 100)}...</p>
                    {message.comment && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{message.comment}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleString('ru-RU')}
                    </p>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="escalations" className="mt-0">
              <div className="text-center text-muted-foreground text-sm py-8">
                Раздел в разработке
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Действия */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-sidebar-foreground">Действия</h3>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleClearChat}
            disabled={!hasMessages}
          >
            <Trash2 className="w-4 h-4" />
            Очистить чат
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleExport}
            disabled={!hasMessages}
          >
            <Download className="w-4 h-4" />
            Экспорт в .txt
          </Button>
        </div>

        {/* Текущая модель */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-sidebar-foreground">Текущая модель</h3>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">openai/gpt-oss-120b</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Выбор модели - реализация на будущее
            </p>
          </Card>
        </div>

        {/* Статус индекса (только для админа) */}
        {role === 'admin' && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sidebar-foreground">Индексация</h3>
            <Card className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Обновлено: {getTimeSinceUpdate()}</span>
              </div>
              <div className="text-xs">
                <p>Документов: 1,247</p>
                <p>Ошибок: 0</p>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-2">
                <RefreshCw className="w-3 h-3" />
                Reindex
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};