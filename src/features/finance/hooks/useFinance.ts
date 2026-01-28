'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, FinanceStats } from '../types';
import { getTransactions } from '../actions/financeActions';

export function useFinance() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<{ start?: string, end?: string }>({});

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        const data = await getTransactions();
        setTransactions(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const stats: FinanceStats = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            const amount = Number(curr.amount);
            if (curr.type === 'income') {
                if (curr.status === 'completed') {
                    acc.totalRevenue += amount;
                    acc.netIncome += amount;
                } else if (curr.status === 'pending') {
                    acc.pendingIncome += amount;
                }
            } else {
                if (curr.status === 'completed') {
                    acc.totalExpenses += amount;
                    acc.netIncome -= amount;
                }
            }
            return acc;
        }, { totalRevenue: 0, totalExpenses: 0, netIncome: 0, pendingIncome: 0 });
    }, [transactions]);

    return { transactions, stats, isLoading, refresh: fetchTransactions, setDateRange };
}
