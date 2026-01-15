import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useContractStore, Contract } from '@/stores/contractStore';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ContractsManagement() {
  const { contracts, fetchContracts, addContract, updateContract, deleteContract, isLoading } = useContractStore();
  const { environments, fetchEnvironments } = useEnvironmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    environmentId: '',
    environmentName: '',
    tenantName: '',
    tenantEmail: '',
    startDate: '',
    endDate: '',
    monthlyRent: 0,
  });

  useEffect(() => {
    fetchContracts();
    fetchEnvironments();
  }, [fetchContracts, fetchEnvironments]);

  const filteredContracts = contracts.filter(c =>
    c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.environmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        environmentId: contract.environmentId,
        environmentName: contract.environmentName,
        tenantName: contract.tenantName,
        tenantEmail: contract.tenantEmail,
        startDate: contract.startDate,
        endDate: contract.endDate,
        monthlyRent: contract.monthlyRent,
      });
    } else {
      setEditingContract(null);
      setFormData({
        environmentId: '',
        environmentName: '',
        tenantName: '',
        tenantEmail: '',
        startDate: '',
        endDate: '',
        monthlyRent: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleEnvironmentChange = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    setFormData(prev => ({
      ...prev,
      environmentId: envId,
      environmentName: env?.name || '',
      monthlyRent: env?.rentalPrice || prev.monthlyRent,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContract) {
      updateContract(editingContract.id, formData);
      toast.success('Contract updated successfully');
    } else {
      addContract(formData);
      toast.success('Contract created successfully');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteContract(id);
    toast.success('Contract deleted');
  };

  const getStatusBadge = (status: Contract['status']) => {
    const styles = {
      active: 'status-available',
      expiring: 'bg-warning/10 text-warning border border-warning/20',
      expired: 'status-expired',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contracts</h1>
            <p className="text-muted-foreground">Manage rental contracts and agreements</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-xl gap-2">
            <Plus className="h-5 w-5" />
            New Contract
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-futuristic w-full pl-12"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="card-elevated animate-pulse h-64 bg-muted" />
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No contracts found</p>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Environment</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Tenant</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Period</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Rent</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <motion.tr
                    key={contract.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{contract.environmentName}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{contract.tenantName}</p>
                      <p className="text-sm text-muted-foreground">{contract.tenantEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">
                        {format(new Date(contract.startDate), 'MMM d, yyyy')} –
                      </p>
                      <p className="text-sm">
                        {format(new Date(contract.endDate), 'MMM d, yyyy')}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">${contract.monthlyRent.toLocaleString()}/mo</p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-lg h-9 w-9"
                          onClick={() => handleOpenModal(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-lg h-9 w-9 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(contract.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingContract ? 'Edit Contract' : 'New Contract'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <select
                value={formData.environmentId}
                onChange={(e) => handleEnvironmentChange(e.target.value)}
                className="input-futuristic w-full"
                required
              >
                <option value="">Select environment...</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.name} - ${env.rentalPrice}/mo
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenant Name</label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                  className="input-futuristic w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tenant Email</label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, tenantEmail: e.target.value }))}
                  className="input-futuristic w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-futuristic w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input-futuristic w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Rent ($)</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: Number(e.target.value) }))}
                className="input-futuristic w-full"
                required
                min="0"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl">
                {editingContract ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
