import React, { useState } from 'react';
import { Contract, Operator } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import { Edit, Trash2, Plus, Search, Building2 } from 'lucide-react';

interface ContractListProps {
  contracts: Contract[];
  operators: Operator[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  operators,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOperatorName = (operatorId: string) => {
    const operator = operators.find(op => op.id === operatorId);
    return operator?.name || 'Operadora não encontrada';
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' 
      ? <Badge variant="success">Ativo</Badge>
      : <Badge variant="danger">Inativo</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600">Gerencie os contratos por filial</p>
        </div>
        <Button onClick={onAdd} icon={<Plus className="h-4 w-4" />}>
          Novo Contrato
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'Active', label: 'Ativo' },
              { value: 'Inactive', label: 'Inativo' }
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Filial</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Operadora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Plano</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Período</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Valor Mensal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contract.branchName}</p>
                        <p className="text-sm text-gray-500">ID: {contract.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {getOperatorName(contract.operatorId)}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {contract.plan}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    <div className="text-sm">
                      <p>{formatDate(contract.startDate)}</p>
                      <p className="text-gray-500">até {formatDate(contract.endDate)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(contract.monthlyValue)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter ? 'Nenhum contrato encontrado' : 'Nenhum contrato cadastrado'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};