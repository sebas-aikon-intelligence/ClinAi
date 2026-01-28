export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    patient_id?: string;
    product_service?: string;
    payment_method: 'cash' | 'credit_card' | 'transfer' | 'insurance';
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    created_by: string;
    patient?: {
        first_name: string;
        last_name: string;
    };
}

export interface CreateTransactionInput {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    patient_id?: string;
    product_service?: string;
    payment_method: string;
    status?: string;
}

export interface FinanceSummary {
    total_income: number;
    total_expenses: number;
    balance: number;
}

export interface FinanceStats {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    pendingIncome: number;
}
