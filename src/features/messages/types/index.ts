// Channel types supported
export type ChannelType = 'whatsapp' | 'telegram' | 'instagram' | 'email' | 'sms';

// Media types for multimedia messages
export type MediaType = 'image' | 'audio' | 'file' | 'video';

export interface Message {
  id: string;
  patient_id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: ChannelType;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  read_at?: string | null;
  sent_by?: string | null;
  external_message_id?: string | null;
  // Multimedia support
  media_type?: MediaType | null;
  media_url?: string | null;
  media_filename?: string | null;
}

export interface Conversation {
  patient_id: string;
  patient_name: string;
  patient_avatar?: string;
  last_message: string;
  last_message_at: string;
  last_message_direction: 'inbound' | 'outbound';
  channel: ChannelType;
  unread_count: number;
  ai_enabled: boolean;
  // Handoff support
  assigned_to_human: boolean;
  handoff_reason?: string | null;
  handoff_at?: string | null;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
  variables?: Record<string, string>;
  tags?: string[];
  created_at: string;
}

export type CreateMessageInput = Omit<Message, 'id' | 'created_at' | 'status' | 'read_at'>;
export type CreateTemplateInput = Omit<MessageTemplate, 'id' | 'created_at'>;

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  isError?: boolean;
}

export interface SendMessagePayload {
  chatId: number;
  text: string;
}

// Filter state for messages view
export interface MessagesFilter {
  channel: ChannelType | 'all';
  status: 'all' | 'unread' | 'read';
  search: string;
  assignedTo: 'all' | 'human' | 'ai';
}

// Input for sending media messages
export interface SendMediaInput {
  patient_id: string;
  channel: ChannelType;
  media_type: MediaType;
  file: File;
  caption?: string;
}
