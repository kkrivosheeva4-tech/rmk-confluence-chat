import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, ChatHistoryItem, AIModel } from '../types/Message';

interface ChatState {
  currentChatId: string | null;
  messages: Message[];
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  selectedModel: AIModel;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearCurrentChat: () => void;
  createNewChat: () => void;
  loadChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: AIModel) => void;
  exportChatToTxt: () => string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentChatId: null,
      messages: [],
      chatHistory: [],
      isLoading: false,
      selectedModel: 'openai/gpt-oss-120b',

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => {
          const updatedMessages = [...state.messages, newMessage];
          
          // Обновляем историю чатов при добавлении сообщения
          const currentChatId = state.currentChatId;
          if (currentChatId) {
            // Находим чат в истории или создаем новый
            const existingChatIndex = state.chatHistory.findIndex(chat => chat.id === currentChatId);
            const chatItem = {
              id: currentChatId,
              title: updatedMessages[0]?.content?.slice(0, 50) + '...' || 'Новый чат',
              lastMessage: newMessage.content.slice(0, 100) + (newMessage.content.length > 100 ? '...' : ''),
              timestamp: new Date(),
              messages: updatedMessages,
            };
            
            const updatedHistory = existingChatIndex >= 0
              ? state.chatHistory.map((chat, index) => 
                  index === existingChatIndex ? chatItem : chat
                )
              : [chatItem, ...state.chatHistory];
            
            return {
              messages: updatedMessages,
              chatHistory: updatedHistory,
            };
          }
          
          return { messages: updatedMessages };
        });
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      clearCurrentChat: () => {
        set({ 
          messages: [],
          currentChatId: null,
        });
      },

      createNewChat: () => {
        const { messages, currentChatId, chatHistory } = get();
        
        // Сохраняем текущий чат в историю если есть сообщения
        if (messages.length > 0 && currentChatId) {
          const chatTitle = messages[0]?.content?.slice(0, 50) + '...' || 'Новый чат';
          const chatItem: ChatHistoryItem = {
            id: currentChatId,
            title: chatTitle,
            lastMessage: messages[messages.length - 1]?.content || '',
            timestamp: new Date(),
            messages,
          };

          // Проверяем, нет ли уже такого чата в истории
          const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
          
          set((state) => ({
            chatHistory: existingChatIndex >= 0 
              ? state.chatHistory.map((chat, index) => 
                  index === existingChatIndex ? chatItem : chat
                )
              : [chatItem, ...state.chatHistory],
          }));
        }

        // Создаём новый чат
        const newChatId = crypto.randomUUID();

        set({
          currentChatId: newChatId,
          messages: [],
        });
      },

      loadChat: (chatId) => {
        const { chatHistory } = get();
        const chat = chatHistory.find(c => c.id === chatId);
        
        if (chat) {
          set({
            currentChatId: chatId,
            messages: chat.messages,
          });
        }
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chatHistory: state.chatHistory.filter(c => c.id !== chatId),
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setSelectedModel: (model) => set({ selectedModel: model }),

      exportChatToTxt: () => {
        const { messages } = get();
        
        let content = '';
        messages.forEach((msg) => {
          const time = msg.timestamp.toLocaleString('ru-RU');
          const author = msg.role === 'user' ? 'Пользователь' : 'Бот';
          const feedback = msg.feedback ? ` (${msg.feedback === 'helpful' ? 'Помогло' : 'Не помогло'})` : '';
          
          content += `[${time}] ${author}: ${msg.content}${feedback}\n`;
          
          if (msg.comment) {
            content += `Комментарий: ${msg.comment}\n`;
          }
          content += '\n';
        });

        return content;
      },
    }),
    {
      name: 'rmk-chat-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        selectedModel: state.selectedModel,
      }),
    }
  )
);