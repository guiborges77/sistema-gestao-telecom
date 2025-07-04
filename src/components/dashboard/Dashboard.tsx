import React from 'react';
import { StatsCard } from './StatsCard';
import { Charts } from './Charts';
import { DashboardStats } from '../../types';
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const paidInvoices = stats.invoicesByStatus.find(s => s.status === 'Paid')?.count || 0;
  const pendingInvoices = stats.invoicesByStatus.find(s => s.status === 'Pending')?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de telecom</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Faturas"
          value={stats.totalInvoices}
          icon={<FileText className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Valor Total Faturado"
          value={stats.totalAmount}
          icon={<DollarSign className="h-6 w-6" />}
          color="emerald"
        />
        <StatsCard
          title="Faturas Pagas"
          value={paidInvoices}
          icon={<CheckCircle className="h-6 w-6" />}
          color="emerald"
        />
        <StatsCard
          title="Faturas Pendentes"
          value={pendingInvoices}
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <Charts stats={stats} />
    </div>
  );
};