export interface Operator {
  id: string;
  name: string;
  serviceType: 'Mobile' | 'Fixed' | 'Internet';
  supportContact: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  branchName: string;
  operatorId: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  monthlyValue: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  contractId: string;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalInvoices: number;
  totalAmount: number;
  monthlyInvoices: { month: string; issued: number; paid: number }[];
  invoicesByStatus: { status: string; count: number; percentage: number }[];
}

export type ViewType = 'dashboard' | 'operators' | 'contracts' | 'invoices';

export interface FilterOptions {
  search: string;
  status?: string;
  serviceType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}