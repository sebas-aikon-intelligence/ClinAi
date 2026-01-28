'use server';

import { createClient } from '@/utils/supabase/server';
import { Transaction, CreateTransactionInput } from '../types';
import { revalidatePath } from 'next/cache';

export async function getTransactions(start?: string, end?: string): Promise<Transaction[]> {
    const supabase = await createClient();
    let query = supabase.from('transactions').select('*').order('date', { ascending: false });

    if (start) query = query.gte('date', start);
    if (end) query = query.lte('date', end);

    const { data, error } = await query;
    if (error) return [];
    return data;
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('transactions').insert([input]).select().single();

    if (error) {
        console.error('Error creating transaction:', error);
        return null;
    }

    revalidatePath('/dashboard/finance');
    return data;
}

export async function deleteTransaction(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return false;
    revalidatePath('/dashboard/finance');
    return true;
}
