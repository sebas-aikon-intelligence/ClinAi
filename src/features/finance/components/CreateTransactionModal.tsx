'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createTransaction } from '../actions/financeActions';
import { getPatients } from '@/features/patients/actions/patientActions';
import { Patient } from '@/features/patients/types';
import { Loader2, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTransactionModal({ isOpen, onClose }: CreateTransactionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);

    // Form state
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');
    const [patientId, setPatientId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    useEffect(() => {
        if (isOpen) {
            loadPatients();
        }
    }, [isOpen]);

    const loadPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data);
        } catch (error) {
            console.error('Failed to load patients', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createTransaction({
                description,
                amount: parseFloat(amount),
                type: type as 'income' | 'expense',
                patient_id: patientId || undefined,
                payment_method: paymentMethod,
                status: 'completed'
            });

            toast.success('Transacción registrada');
            onClose();
            // Reset form
            setDescription('');
            setAmount('');
            setType('income');
            setPatientId('');
        } catch (error) {
            console.error(error);
            toast.error('Error al registrar transacción');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border-white/20">
                <DialogHeader>
                    <DialogTitle>Nueva Transacción</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Ingreso</SelectItem>
                                    <SelectItem value="expense">Gasto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Monto</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-9"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Consulta General"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Paciente (Opcional)</Label>
                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- Ninguno --</SelectItem>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.first_name} {p.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Método de Pago</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Efectivo</SelectItem>
                                <SelectItem value="credit_card">Tarjeta Crédito</SelectItem>
                                <SelectItem value="debit_card">Tarjeta Débito</SelectItem>
                                <SelectItem value="transfer">Transferencia</SelectItem>
                                <SelectItem value="insurance">Seguro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className={type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Registrar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
