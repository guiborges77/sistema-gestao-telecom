import { Operator, Contract, Invoice } from '../types';

export const initialOperators: Operator[] = [
  {
    id: '1',
    name: 'Vivo',
    serviceType: 'Mobile',
    supportContact: '(11) 1058-8888',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Claro',
    serviceType: 'Internet',
    supportContact: '(11) 1052-5555',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'TIM',
    serviceType: 'Fixed',
    supportContact: '(11) 1056-4444',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  }
];

export const initialContracts: Contract[] = [
  {
    id: '1',
    branchName: 'Filial São Paulo',
    operatorId: '1',
    plan: 'Plano Empresarial 100GB',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2025-01-01'),
    monthlyValue: 299.99,
    status: 'Active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    branchName: 'Filial Rio de Janeiro',
    operatorId: '2',
    plan: 'Internet Fibra 500MB',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2025-02-01'),
    monthlyValue: 189.99,
    status: 'Active',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  },
  {
    id: '3',
    branchName: 'Filial Belo Horizonte',
    operatorId: '3',
    plan: 'Fixo Ilimitado',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2024-03-01'),
    monthlyValue: 89.99,
    status: 'Inactive',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01')
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: '1',
    contractId: '1',
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-10'),
    amount: 299.99,
    status: 'Paid',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '2',
    contractId: '1',
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-10'),
    amount: 299.99,
    status: 'Paid',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-08')
  },
  {
    id: '3',
    contractId: '2',
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-10'),
    amount: 189.99,
    status: 'Paid',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: '4',
    contractId: '2',
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-10'),
    amount: 189.99,
    status: 'Pending',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '5',
    contractId: '3',
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-10'),
    amount: 89.99,
    status: 'Overdue',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];