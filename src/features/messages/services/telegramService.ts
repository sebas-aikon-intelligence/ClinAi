import type { SendMessagePayload } from '../types';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export async function sendManualMessage(payload: SendMessagePayload): Promise<boolean> {
  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL not configured');
    return false;
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: payload.chat_id,
        message: payload.message,
        sender_type: 'human',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending manual message:', error);
    return false;
  }
}
