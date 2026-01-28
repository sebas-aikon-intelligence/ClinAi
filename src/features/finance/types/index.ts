export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
    status: 'paid' | 'pending' | 'cancelled';
    patient_id?: string;
    created_at: string;
}

export interface FinanceStats {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    pendingIncome: number;
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'created_at'>;
