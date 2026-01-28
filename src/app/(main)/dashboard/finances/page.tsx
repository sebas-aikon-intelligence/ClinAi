import { Suspense } from 'react';
import { getTransactions, getFinanceSummary } from '@/features/finance/actions/financeActions';
import { FinanceView } from '@/features/finance/components/FinanceView';
import { Loader2 } from 'lucide-react';

export default async function FinancePage() {
    const transactions = await getTransactions();
    const summary = await getFinanceSummary();

    return (
        <div className="h-full p-6 flex flex-col space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Finanzas</h1>
                <p className="text-slate-500">Resumen de ingresos y gastos de la clínica.</p>
            </div>

            <div className="flex-1 min-h-0">
                <Suspense fallback={
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                }>
                    <FinanceView initialTransactions={transactions} summary={summary} />
                </Suspense>
            </div>
        </div>
    );
}
