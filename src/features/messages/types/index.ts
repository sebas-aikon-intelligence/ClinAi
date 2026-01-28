export interface TelegramConversation {
  id: string;
  telegram_chat_id: string;
  customer_name: string | null;
  customer_username: string | null;
  is_ai_enabled: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: string;
  message: {
    type: 'human' | 'ai';
    content: string;
    additional_kwargs?: Record<string, unknown>;
    response_metadata?: Record<string, unknown>;
    tool_calls?: unknown[];
    invalid_tool_calls?: unknown[];
  };
}

export interface SendMessagePayload {
  chat_id: string;
  message: string;
}
