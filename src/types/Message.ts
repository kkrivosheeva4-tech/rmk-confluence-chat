export type MessageRole = 'user' | 'bot';

export type Feedback = 'helpful' | 'unhelpful';

export type Source = {
  title: string;
  url: string;
  excerpt: string;
  accessLevel: 'public' | 'restricted';
};

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: Source[];
  feedback?: Feedback;
  comment?: string;
  followUpQuestions?: string[];
};

export type ChatHistoryItem = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
};

export type UserRole = 'user' | 'admin';

export type AIModel = 'openai/gpt-oss-120b';

export type FeedbackDTO = {
  messageId: string;
  feedback: Feedback;
  comment?: string;
  timestamp: Date;
};

export type AnswerDTO = {
  content: string;
  confidence: number;
  sources: Source[];
  followUpQuestions?: string[];
};