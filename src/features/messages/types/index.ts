export interface Message {
  id: string;
  patient_id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: 'whatsapp' | 'email' | 'sms' | 'telegram';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  tags?: string[];
  created_at: string;
}

export type CreateMessageInput = Omit<Message, 'id' | 'created_at' | 'status'>;
export type CreateTemplateInput = Omit<MessageTemplate, 'id' | 'created_at'>;

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  isError?: boolean;
}

export interface TelegramConversation {
  id: string;
  chat_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
  tags?: string[];
  status?: 'active' | 'archived';
  channel?: string;
}

export interface SendMessagePayload {
  chatId: number;
  text: string;
}
