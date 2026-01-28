export const sendPrescriptionWebhook = async (payload: {
    patient_id: string;
    prescription_id: string;
    channel: 'email' | 'whatsapp';
    recipient: string;
}) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/send-prescription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': process.env.N8N_API_KEY || ''
            },
            body: JSON.stringify(payload)
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending prescription webhook:', error);
        return false;
    }
};
