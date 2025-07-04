import React, { useState } from 'react';
import { Invoice, Contract } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import { Edit, Trash2, Plus, Search, FileText } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  contracts: Contract[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  contracts,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const contract = contracts.find(c => c.id === invoice.contractId);
    const matchesSearch = contract?.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract?.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getContractInfo = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? `${contract.branchName} - ${contract.plan}` : 'Contrato não encontrado';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paga</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'Overdue':
        return <Badge variant="danger">Vencida</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
          <p className="text-gray-600">Gerencie as faturas dos contratos</p>
        </div>
        <Button onClick={onAdd} icon={<Plus className="h-4 w-4" />}>
          Nova Fatura
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Buscar faturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'Paid', label: 'Paga' },
              { value: 'Pending', label: 'Pendente' },
              { value: 'Overdue', label: 'Vencida' }
            ]}
          />
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-600 mr-2">Total:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contrato</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data Emissão</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data Vencimento</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getContractInfo(invoice.contractId)}</p>
                        <p className="text-sm text-gray-500">ID: {invoice.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {formatDate(invoice.issueDate)}
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter ? 'Nenhuma fatura encontrada' : 'Nenhuma fatura cadastrada'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};