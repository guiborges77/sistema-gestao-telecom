import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { OperatorList } from './components/operators/OperatorList';
import { OperatorForm } from './components/operators/OperatorForm';
import { ContractList } from './components/contracts/ContractList';
import { ContractForm } from './components/contracts/ContractForm';
import { InvoiceList } from './components/invoices/InvoiceList';
import { InvoiceForm } from './components/invoices/InvoiceForm';
import { NotificationPanel } from './components/notifications/NotificationPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateDashboardStats } from './utils/calculations';
import { initialOperators, initialContracts, initialInvoices } from './data/mockData';
import { ViewType, Operator, Contract, Invoice } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [operators, setOperators] = useLocalStorage('operators', initialOperators);
  const [contracts, setContracts] = useLocalStorage('contracts', initialContracts);
  const [invoices, setInvoices] = useLocalStorage('invoices', initialInvoices);

  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showOperatorForm, setShowOperatorForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const dashboardStats = calculateDashboardStats(invoices, contracts);

  const handleOperatorSubmit = (operatorData: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingOperator) {
      setOperators(prev => prev.map(op => 
        op.id === editingOperator.id 
          ? { ...operatorData, id: editingOperator.id, createdAt: editingOperator.createdAt, updatedAt: now }
          : op
      ));
      setEditingOperator(null);
    } else {
      const newOperator: Operator = {
        ...operatorData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      setOperators(prev => [...prev, newOperator]);
    }
    
    setShowOperatorForm(false);
  };

  const handleContractSubmit = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingContract) {
      setContracts(prev => prev.map(contract => 
        contract.id === editingContract.id 
          ? { ...contractData, id: editingContract.id, createdAt: editingContract.createdAt, updatedAt: now }
          : contract
      ));
      setEditingContract(null);
    } else {
      const newContract: Contract = {
        ...contractData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      setContracts(prev => [...prev, newContract]);
    }
    
    setShowContractForm(false);
  };

  const handleInvoiceSubmit = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingInvoice) {
      setInvoices(prev => prev.map(invoice => 
        invoice.id === editingInvoice.id 
          ? { ...invoiceData, id: editingInvoice.id, createdAt: editingInvoice.createdAt, updatedAt: now }
          : invoice
      ));
      setEditingInvoice(null);
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };
      setInvoices(prev => [...prev, newInvoice]);
    }
    
    setShowInvoiceForm(false);
  };

  const handleOperatorDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta operadora?')) {
      setOperators(prev => prev.filter(op => op.id !== id));
    }
  };

  const handleContractDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      setContracts(prev => prev.filter(contract => contract.id !== id));
    }
  };

  const handleInvoiceDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fatura?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    }
  };

  const handleOperatorEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setShowOperatorForm(true);
  };

  const handleContractEdit = (contract: Contract) => {
    setEditingContract(contract);
    setShowContractForm(true);
  };

  const handleInvoiceEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleOperatorAdd = () => {
    setEditingOperator(null);
    setShowOperatorForm(true);
  };

  const handleContractAdd = () => {
    setEditingContract(null);
    setShowContractForm(true);
  };

  const handleInvoiceAdd = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleCancelForm = () => {
    setShowOperatorForm(false);
    setShowContractForm(false);
    setShowInvoiceForm(false);
    setEditingOperator(null);
    setEditingContract(null);
    setEditingInvoice(null);
  };

  const renderContent = () => {
    if (showOperatorForm) {
      return (
        <OperatorForm
          operator={editingOperator || undefined}
          onSubmit={handleOperatorSubmit}
          onCancel={handleCancelForm}
        />
      );
    }

    if (showContractForm) {
      return (
        <ContractForm
          contract={editingContract || undefined}
          operators={operators}
          onSubmit={handleContractSubmit}
          onCancel={handleCancelForm}
        />
      );
    }

    if (showInvoiceForm) {
      return (
        <InvoiceForm
          invoice={editingInvoice || undefined}
          contracts={contracts}
          onSubmit={handleInvoiceSubmit}
          onCancel={handleCancelForm}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={dashboardStats} />;
      case 'operators':
        return (
          <OperatorList
            operators={operators}
            onEdit={handleOperatorEdit}
            onDelete={handleOperatorDelete}
            onAdd={handleOperatorAdd}
          />
        );
      case 'contracts':
        return (
          <ContractList
            contracts={contracts}
            operators={operators}
            onEdit={handleContractEdit}
            onDelete={handleContractDelete}
            onAdd={handleContractAdd}
          />
        );
      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            contracts={contracts}
            onEdit={handleInvoiceEdit}
            onDelete={handleInvoiceDelete}
            onAdd={handleInvoiceAdd}
          />
        );
      default:
        return <Dashboard stats={dashboardStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {/* Painel de Notificações */}
      <NotificationPanel contracts={contracts} operators={operators} />
    </div>
  );
}

export default App;