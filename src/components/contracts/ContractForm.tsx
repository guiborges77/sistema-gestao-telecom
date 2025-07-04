import React, { useState } from 'react';
import { Contract, Operator } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface ContractFormProps {
  contract?: Contract;
  operators: Operator[];
  onSubmit: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
  contract,
  operators,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    branchName: contract?.branchName || '',
    operatorId: contract?.operatorId || '',
    plan: contract?.plan || '',
    startDate: contract?.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
    endDate: contract?.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
    monthlyValue: contract?.monthlyValue?.toString() || '',
    status: contract?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Nome da filial é obrigatório';
    }
    
    if (!formData.operatorId) {
      newErrors.operatorId = 'Operadora é obrigatória';
    }
    
    if (!formData.plan.trim()) {
      newErrors.plan = 'Plano é obrigatório';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Data de vencimento é obrigatória';
    }
    
    if (!formData.monthlyValue || parseFloat(formData.monthlyValue) <= 0) {
      newErrors.monthlyValue = 'Valor mensal deve ser maior que zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      branchName: formData.branchName,
      operatorId: formData.operatorId,
      plan: formData.plan,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      monthlyValue: parseFloat(formData.monthlyValue),
      status: formData.status as 'Active' | 'Inactive'
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
          {contract ? 'Editar Contrato' : 'Novo Contrato'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Filial"
          value={formData.branchName}
          onChange={(e) => handleChange('branchName', e.target.value)}
          error={errors.branchName}
          placeholder="Ex: Filial São Paulo"
        />

        <Select
          label="Operadora"
          value={formData.operatorId}
          onChange={(e) => handleChange('operatorId', e.target.value)}
          error={errors.operatorId}
          options={[
            { value: '', label: 'Selecione uma operadora' },
            ...operators.map(op => ({ value: op.id, label: op.name }))
          ]}
        />

        <Input
          label="Plano Contratado"
          value={formData.plan}
          onChange={(e) => handleChange('plan', e.target.value)}
          error={errors.plan}
          placeholder="Ex: Plano Empresarial 100GB"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de Início"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            error={errors.startDate}
          />

          <Input
            label="Data de Vencimento"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            error={errors.endDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor Mensal (R$)"
            type="number"
            step="0.01"
            value={formData.monthlyValue}
            onChange={(e) => handleChange('monthlyValue', e.target.value)}
            error={errors.monthlyValue}
            placeholder="299.99"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'Active', label: 'Ativo' },
              { value: 'Inactive', label: 'Inativo' }
            ]}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            {contract ? 'Atualizar' : 'Criar'} Contrato
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};