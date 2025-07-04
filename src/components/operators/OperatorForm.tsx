import React, { useState } from 'react';
import { Operator } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface OperatorFormProps {
  operator?: Operator;
  onSubmit: (operator: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const OperatorForm: React.FC<OperatorFormProps> = ({
  operator,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: operator?.name || '',
    serviceType: operator?.serviceType || 'Mobile',
    supportContact: operator?.supportContact || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da operadora é obrigatório';
    }
    
    if (!formData.supportContact.trim()) {
      newErrors.supportContact = 'Contato de suporte é obrigatório';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData as Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>);
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
          {operator ? 'Editar Operadora' : 'Nova Operadora'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Operadora"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Ex: Vivo, Claro, TIM"
        />

        <Select
          label="Tipo de Serviço"
          value={formData.serviceType}
          onChange={(e) => handleChange('serviceType', e.target.value)}
          options={[
            { value: 'Mobile', label: 'Móvel' },
            { value: 'Fixed', label: 'Fixo' },
            { value: 'Internet', label: 'Internet' }
          ]}
        />

        <Input
          label="Contato de Suporte"
          value={formData.supportContact}
          onChange={(e) => handleChange('supportContact', e.target.value)}
          error={errors.supportContact}
          placeholder="Ex: (11) 1234-5678"
        />

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            {operator ? 'Atualizar' : 'Criar'} Operadora
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};