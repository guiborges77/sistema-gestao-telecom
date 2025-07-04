import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { emailNotificationService, EmailNotification } from '../../services/emailService';
import { formatDate } from '../../utils/dateUtils';
import { Bell, Mail, Clock, CheckCircle, X, Send } from 'lucide-react';

interface NotificationPanelProps {
  contracts: any[];
  operators: any[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  contracts,
  operators
}) => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Verificar contratos vencendo
    emailNotificationService.checkExpiringContracts(contracts, operators);
    loadNotifications();
  }, [contracts, operators]);

  const loadNotifications = () => {
    setNotifications(emailNotificationService.getNotifications());
  };

  const handleSendNotification = async (notification: EmailNotification) => {
    setIsLoading(true);
    try {
      const success = await emailNotificationService.sendEmailNotification(notification);
      if (success) {
        loadNotifications();
        alert('✅ Notificação enviada com sucesso!');
      } else {
        alert('❌ Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar notificação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAllPending = async () => {
    setIsLoading(true);
    try {
      await emailNotificationService.sendPendingNotifications();
      loadNotifications();
      alert('✅ Todas as notificações pendentes foram enviadas!');
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    emailNotificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const pendingNotifications = notifications.filter(n => !n.emailSent);
  const sentNotifications = notifications.filter(n => n.emailSent);

  if (!showPanel) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowPanel(true)}
          className="relative shadow-lg"
          size="lg"
        >
          <Bell className="h-5 w-5" />
          {pendingNotifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {pendingNotifications.length}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Notificações de Vencimento
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPanel(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{pendingNotifications.length}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </Card>
            <Card className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{sentNotifications.length}</p>
              <p className="text-sm text-gray-600">Enviadas</p>
            </Card>
            <Card className="text-center">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </Card>
          </div>

          {/* Ações */}
          {pendingNotifications.length > 0 && (
            <div className="mb-6">
              <Button
                onClick={handleSendAllPending}
                loading={isLoading}
                icon={<Send className="h-4 w-4" />}
                className="w-full md:w-auto"
              >
                Enviar Todas as Notificações Pendentes
              </Button>
            </div>
          )}

          {/* Notificações Pendentes */}
          {pendingNotifications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📬 Notificações Pendentes ({pendingNotifications.length})
              </h3>
              <div className="space-y-4">
                {pendingNotifications.map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-orange-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge variant="warning" className="mr-2">
                            {notification.daysUntilExpiration} dias
                          </Badge>
                          <h4 className="font-medium text-gray-900">
                            {notification.branchName}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Operadora:</strong> {notification.operatorName}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Plano:</strong> {notification.plan}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Vencimento:</strong> {formatDate(notification.expirationDate)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSendNotification(notification)}
                          loading={isLoading}
                          icon={<Send className="h-4 w-4" />}
                        >
                          Enviar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Marcar como Lida
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notificações Enviadas */}
          {sentNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✅ Notificações Enviadas ({sentNotifications.length})
              </h3>
              <div className="space-y-4">
                {sentNotifications.slice(0, 5).map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-green-500 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge variant="success" className="mr-2">
                            Enviada
                          </Badge>
                          <h4 className="font-medium text-gray-900">
                            {notification.branchName}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Operadora:</strong> {notification.operatorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Enviada em:</strong> {notification.sentAt ? formatDate(notification.sentAt) : 'N/A'}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </Card>
                ))}
                {sentNotifications.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... e mais {sentNotifications.length - 5} notificações enviadas
                  </p>
                )}
              </div>
            </div>
          )}

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma notificação de vencimento encontrada</p>
              <p className="text-sm text-gray-400 mt-2">
                As notificações aparecerão quando houver contratos vencendo nos próximos 5 dias
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};