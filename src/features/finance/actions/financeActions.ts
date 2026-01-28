'use server';

import { createClient } from '@/utils/supabase/server';
import { Transaction, CreateTransactionInput, FinanceSummary } from '../types';
import { revalidatePath } from 'next/cache';

export async function getTransactions(): Promise<Transaction[]> {
    const supabase = await createClient();

    // Join with patients to get name
    const { data, error } = await supabase
        .from('transactions')
        .select('*, patient:patients(first_name, last_name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data as Transaction[];
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
    const supabase = await createClient();

    // We can use RPC or simple calc. Simple calc for now.
    const { data, error } = await supabase
        .from('transactions')
        .select('amount, type');

    if (error) {
        console.error('Error fetching summary:', error);
        return { total_income: 0, total_expenses: 0, balance: 0 };
    }

    let income = 0;
    let expenses = 0;

    data.forEach(t => {
        if (t.type === 'income') income += Number(t.amount);
        if (t.type === 'expense') expenses += Number(t.amount);
    });

    return {
        total_income: income,
        total_expenses: expenses,
        balance: income - expenses
    };
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('transactions')
        .insert({
            ...input,
            created_by: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating transaction:', error);
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/finances');
    revalidatePath('/dashboard/finance');
    return data as Transaction;
}

export async function deleteTransaction(id: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting transaction:', error);
        return false;
    }

    revalidatePath('/dashboard/finances');
    return true;
}
