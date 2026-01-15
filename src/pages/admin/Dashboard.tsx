import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText, Bell, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { useContractStore } from '@/stores/contractStore';
import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { StatCard } from '@/components/StatCard';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { environments, fetchEnvironments, isLoading: envLoading } = useEnvironmentStore();
  const { contracts, fetchContracts, getExpiringContracts, getActiveContracts } = useContractStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchEnvironments();
    fetchContracts();
    fetchNotifications();
  }, [fetchEnvironments, fetchContracts, fetchNotifications]);

  const availableEnvs = environments.filter(e => e.status === 'available').length;
  const expiringContracts = getExpiringContracts();
  const activeContracts = getActiveContracts();
  const recentNotifications = notifications.slice(0, 5);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your building.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Environments"
          value={environments.length}
          subtitle="Managed spaces"
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Available"
          value={availableEnvs}
          subtitle="Ready to rent"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Active Contracts"
          value={activeContracts.length}
          subtitle="Currently running"
          icon={FileText}
          variant="primary"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringContracts.length}
          subtitle="Within 30 days"
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Contracts Expiring Soon
          </h2>
          
          {expiringContracts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No contracts expiring in the next 30 days
            </p>
          ) : (
            <div className="space-y-3">
              {expiringContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="p-4 rounded-xl bg-warning/5 border border-warning/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{contract.environmentName}</p>
                      <p className="text-sm text-muted-foreground">{contract.tenantName}</p>
                    </div>
                    <span className="text-sm text-warning font-medium">
                      Expires {format(new Date(contract.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Notifications
          </h2>
          
          {recentNotifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border ${
                    notification.read
                      ? 'bg-muted/50 border-border'
                      : 'bg-card border-primary/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
