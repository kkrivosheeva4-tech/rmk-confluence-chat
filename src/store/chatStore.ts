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
      selectedModel: 'fast',

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
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
        const { messages, currentChatId } = get();
        
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

          set((state) => ({
            chatHistory: [chatItem, ...state.chatHistory],
          }));
        }

        // Создаём новый чат
        set({
          currentChatId: crypto.randomUUID(),
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