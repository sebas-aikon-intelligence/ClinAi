export interface Message {
  id: string;
  patient_id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: 'whatsapp' | 'email' | 'sms';
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
