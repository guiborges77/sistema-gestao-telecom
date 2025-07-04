import React from 'react';
import { Card } from '../ui/Card';
import { DashboardStats } from '../../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartsProps {
  stats: DashboardStats;
}

export const Charts: React.FC<ChartsProps> = ({ stats }) => {
  const COLORS = {
    Paid: '#10B981',
    Pending: '#F59E0B',
    Overdue: '#EF4444'
  };

  const pieData = stats.invoicesByStatus.map(item => ({
    name: item.status === 'Paid' ? 'Pagas' : 
          item.status === 'Pending' ? 'Pendentes' : 'Vencidas',
    value: item.count,
    percentage: item.percentage
  }));

  const barData = stats.monthlyInvoices.slice(-6).map(item => ({
    month: item.month,
    Emitidas: item.issued,
    Pagas: item.paid
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição de Faturas por Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[stats.invoicesByStatus[index].status as keyof typeof COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolução Mensal de Faturas
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Emitidas" fill="#3B82F6" />
            <Bar dataKey="Pagas" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};