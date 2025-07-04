import React, { useState } from 'react';
import { Invoice, Contract } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface InvoiceFormProps {
  invoice?: Invoice;
  contracts: Contract[];
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  contracts,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    contractId: invoice?.contractId || '',
    issueDate: invoice?.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : '',
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
    amount: invoice?.amount?.toString() || '',
    status: invoice?.status || 'Pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.contractId) {
      newErrors.contractId = 'Contrato é obrigatório';
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Data de emissão é obrigatória';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      contractId: formData.contractId,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      amount: parseFloat(formData.amount),
      status: formData.status as 'Paid' | 'Pending' | 'Overdue'
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {invoice ? 'Editar Fatura' : 'Nova Fatura'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Contrato"
          value={formData.contractId}
          onChange={(e) => handleChange('contractId', e.target.value)}
          error={errors.contractId}
          options={[
            { value: '', label: 'Selecione um contrato' },
            ...contracts.map(contract => ({ 
              value: contract.id, 
              label: `${contract.branchName} - ${contract.plan}` 
            }))
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de Emissão"
            type="date"
            value={formData.issueDate}
            onChange={(e) => handleChange('issueDate', e.target.value)}
            error={errors.issueDate}
          />

          <Input
            label="Data de Vencimento"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
            placeholder="299.99"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'Pending', label: 'Pendente' },
              { value: 'Paid', label: 'Paga' },
              { value: 'Overdue', label: 'Vencida' }
            ]}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            {invoice ? 'Atualizar' : 'Criar'} Fatura
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};