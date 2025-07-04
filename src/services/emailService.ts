import { Contract, Operator } from '../types';
import { formatDate } from '../utils/dateUtils';

export interface EmailNotification {
  id: string;
  contractId: string;
  branchName: string;
  operatorName: string;
  plan: string;
  expirationDate: Date;
  daysUntilExpiration: number;
  emailSent: boolean;
  sentAt?: Date;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

class EmailNotificationService {
  private notifications: EmailNotification[] = [];
  private config: EmailConfig | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.loadNotifications();
    this.startBackgroundService();
  }

  // Configurar credenciais de e-mail
  configureEmail(config: EmailConfig) {
    this.config = config;
    localStorage.setItem('emailConfig', JSON.stringify(config));
  }

  // Carregar notificações do localStorage
  private loadNotifications() {
    try {
      const stored = localStorage.getItem('emailNotifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          expirationDate: new Date(n.expirationDate),
          sentAt: n.sentAt ? new Date(n.sentAt) : undefined
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }

  // Salvar notificações no localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('emailNotifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  // Verificar contratos que vencem nos próximos 5 dias
  checkExpiringContracts(contracts: Contract[], operators: Operator[]) {
    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const expiringContracts = contracts.filter(contract => {
      const endDate = new Date(contract.endDate);
      return contract.status === 'Active' && 
             endDate >= now && 
             endDate <= fiveDaysFromNow;
    });

    expiringContracts.forEach(contract => {
      const operator = operators.find(op => op.id === contract.operatorId);
      const daysUntilExpiration = Math.ceil(
        (new Date(contract.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Verificar se já existe notificação para este contrato
      const existingNotification = this.notifications.find(
        n => n.contractId === contract.id && !n.emailSent
      );

      if (!existingNotification) {
        const notification: EmailNotification = {
          id: `notif_${contract.id}_${Date.now()}`,
          contractId: contract.id,
          branchName: contract.branchName,
          operatorName: operator?.name || 'Operadora não encontrada',
          plan: contract.plan,
          expirationDate: new Date(contract.endDate),
          daysUntilExpiration,
          emailSent: false
        };

        this.notifications.push(notification);
        this.saveNotifications();
      }
    });

    return this.notifications.filter(n => !n.emailSent);
  }

  // Simular envio de e-mail (em produção, integraria com serviço real)
  async sendEmailNotification(notification: EmailNotification): Promise<boolean> {
    try {
      // Simulação de envio de e-mail
      console.log('📧 Enviando notificação de vencimento:', {
        to: 'admin@empresa.com',
        subject: `⚠️ Contrato vencendo em ${notification.daysUntilExpiration} dias`,
        body: this.generateEmailBody(notification)
      });

      // Em produção, aqui seria a integração com serviço de e-mail real
      // Exemplo com Nodemailer, SendGrid, AWS SES, etc.
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Marcar como enviado
      notification.emailSent = true;
      notification.sentAt = new Date();
      this.saveNotifications();

      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  // Gerar corpo do e-mail
  private generateEmailBody(notification: EmailNotification): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e74c3c;">⚠️ Alerta de Vencimento de Contrato</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c3e50;">Detalhes do Contrato</h3>
              <p><strong>Filial:</strong> ${notification.branchName}</p>
              <p><strong>Operadora:</strong> ${notification.operatorName}</p>
              <p><strong>Plano:</strong> ${notification.plan}</p>
              <p><strong>Data de Vencimento:</strong> ${formatDate(notification.expirationDate)}</p>
              <p><strong>Dias até o vencimento:</strong> 
                <span style="color: #e74c3c; font-weight: bold;">
                  ${notification.daysUntilExpiration} dias
                </span>
              </p>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Ação Necessária:</strong></p>
              <p style="margin: 5px 0 0 0;">
                Entre em contato com a operadora para renovar ou renegociar o contrato antes do vencimento.
              </p>
            </div>

            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Este é um e-mail automático do Sistema de Gestão de Telecom.
              <br>
              Enviado em: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </body>
      </html>
    `;
  }

  // Enviar todas as notificações pendentes
  async sendPendingNotifications(): Promise<void> {
    const pendingNotifications = this.notifications.filter(n => !n.emailSent);
    
    for (const notification of pendingNotifications) {
      await this.sendEmailNotification(notification);
      // Aguardar 2 segundos entre envios para evitar spam
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Iniciar serviço em background (verifica a cada hora)
  private startBackgroundService() {
    // Verificar imediatamente
    this.runBackgroundCheck();
    
    // Configurar verificação a cada hora (3600000 ms)
    this.intervalId = setInterval(() => {
      this.runBackgroundCheck();
    }, 3600000);
  }

  // Executar verificação em background
  private runBackgroundCheck() {
    try {
      // Carregar dados do localStorage
      const contracts = JSON.parse(localStorage.getItem('contracts') || '[]')
        .map((c: any) => ({
          ...c,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));

      const operators = JSON.parse(localStorage.getItem('operators') || '[]')
        .map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt)
        }));

      // Verificar contratos vencendo
      const pendingNotifications = this.checkExpiringContracts(contracts, operators);
      
      if (pendingNotifications.length > 0) {
        console.log(`🔔 ${pendingNotifications.length} contratos vencendo nos próximos 5 dias`);
        
        // Enviar notificações automaticamente (opcional)
        // this.sendPendingNotifications();
      }
    } catch (error) {
      console.error('Erro na verificação em background:', error);
    }
  }

  // Parar serviço em background
  stopBackgroundService() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Obter todas as notificações
  getNotifications(): EmailNotification[] {
    return [...this.notifications];
  }

  // Obter notificações pendentes
  getPendingNotifications(): EmailNotification[] {
    return this.notifications.filter(n => !n.emailSent);
  }

  // Limpar notificações antigas (mais de 30 dias)
  cleanOldNotifications() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.notifications = this.notifications.filter(n => 
      !n.sentAt || new Date(n.sentAt) > thirtyDaysAgo
    );
    this.saveNotifications();
  }

  // Marcar notificação como lida
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.emailSent = true;
      notification.sentAt = new Date();
      this.saveNotifications();
    }
  }
}

// Instância singleton do serviço
export const emailNotificationService = new EmailNotificationService();