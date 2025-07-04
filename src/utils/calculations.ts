import { Invoice, Contract, DashboardStats } from '../types';
import { getMonthName, getMonthsBetween } from './dateUtils';

export const calculateDashboardStats = (
  invoices: Invoice[],
  contracts: Contract[]
): DashboardStats => {
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  // Calculate monthly invoices for the last 12 months
  const now = new Date();
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const months = getMonthsBetween(yearAgo, now);

  const monthlyInvoices = months.map(month => {
    const monthInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate.getMonth() === month.getMonth() && 
             invoiceDate.getFullYear() === month.getFullYear();
    });

    return {
      month: getMonthName(month),
      issued: monthInvoices.length,
      paid: monthInvoices.filter(invoice => invoice.status === 'Paid').length
    };
  });

  // Calculate invoices by status
  const statusCounts = {
    Paid: invoices.filter(invoice => invoice.status === 'Paid').length,
    Pending: invoices.filter(invoice => invoice.status === 'Pending').length,
    Overdue: invoices.filter(invoice => invoice.status === 'Overdue').length
  };

  const invoicesByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: totalInvoices > 0 ? (count / totalInvoices) * 100 : 0
  }));

  return {
    totalInvoices,
    totalAmount,
    monthlyInvoices,
    invoicesByStatus
  };
};

export const calculateMonthlyTotal = (invoices: Invoice[], month: Date) => {
  return invoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate.getMonth() === month.getMonth() && 
             invoiceDate.getFullYear() === month.getFullYear();
    })
    .reduce((sum, invoice) => sum + invoice.amount, 0);
};

export const getUpcomingExpirations = (contracts: Contract[], days: number = 5) => {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return contracts.filter(contract => {
    const endDate = new Date(contract.endDate);
    return contract.status === 'Active' && endDate >= now && endDate <= future;
  });
};