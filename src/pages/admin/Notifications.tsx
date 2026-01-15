import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'warning':
        return <AlertCircle className={`${iconClass} text-warning`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-destructive`} />;
      case 'success':
        return <Check className={`${iconClass} text-success`} />;
      default:
        return <Info className={`${iconClass} text-primary`} />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Justo ahora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return format(then, "d 'de' MMM", { locale: es });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                : '¡Todo al día!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="rounded-xl gap-2">
              <CheckCheck className="h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </motion.div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">Aún no hay notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => markAsRead(notification.id)}
              className={`card-elevated p-5 cursor-pointer transition-all hover:shadow-soft ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  notification.type === 'warning' ? 'bg-warning/10' :
                  notification.type === 'error' ? 'bg-destructive/10' :
                  notification.type === 'success' ? 'bg-success/10' :
                  'bg-primary/10'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {!notification.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
