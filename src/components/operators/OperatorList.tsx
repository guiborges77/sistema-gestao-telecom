import React, { useState } from 'react';
import { Operator } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { formatDate } from '../../utils/dateUtils';
import { Edit, Trash2, Plus, Search, Phone } from 'lucide-react';

interface OperatorListProps {
  operators: Operator[];
  onEdit: (operator: Operator) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const OperatorList: React.FC<OperatorListProps> = ({
  operators,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceTypeBadge = (serviceType: string) => {
    switch (serviceType) {
      case 'Mobile':
        return <Badge variant="info">Móvel</Badge>;
      case 'Fixed':
        return <Badge variant="success">Fixo</Badge>;
      case 'Internet':
        return <Badge variant="warning">Internet</Badge>;
      default:
        return <Badge>{serviceType}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operadoras</h1>
          <p className="text-gray-600">Gerencie as operadoras de telecomunicações</p>
        </div>
        <Button onClick={onAdd} icon={<Plus className="h-4 w-4" />}>
          Nova Operadora
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar operadoras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Operadora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo de Serviço</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contato Suporte</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Criado em</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperators.map((operator) => (
                <tr key={operator.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{operator.name}</p>
                        <p className="text-sm text-gray-500">ID: {operator.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getServiceTypeBadge(operator.serviceType)}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {operator.supportContact}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {formatDate(operator.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(operator)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(operator.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOperators.length === 0 && (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma operadora encontrada' : 'Nenhuma operadora cadastrada'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};