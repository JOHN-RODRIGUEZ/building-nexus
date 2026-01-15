import { create } from 'zustand';

export interface Contract {
  id: string;
  environmentId: string;
  environmentName: string;
  tenantName: string;
  tenantEmail: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: 'active' | 'expired' | 'expiring';
}

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
  fetchContracts: () => Promise<void>;
  addContract: (contract: Omit<Contract, 'id' | 'status'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  getExpiringContracts: () => Contract[];
  getActiveContracts: () => Contract[];
}

const calculateStatus = (endDate: string): 'active' | 'expired' | 'expiring' => {
  const end = new Date(endDate);
  const today = new Date();
  const daysUntilEnd = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilEnd < 0) return 'expired';
  if (daysUntilEnd <= 30) return 'expiring';
  return 'active';
};

const mockContracts: Contract[] = [
  {
    id: '1',
    environmentId: '2',
    environmentName: 'Open Space Office B',
    tenantName: 'TechCorp Inc.',
    tenantEmail: 'contact@techcorp.com',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    monthlyRent: 8500,
    status: 'active',
  },
  {
    id: '2',
    environmentId: '5',
    environmentName: 'Tech Hub E',
    tenantName: 'StartupXYZ',
    tenantEmail: 'hello@startupxyz.io',
    startDate: '2024-06-01',
    endDate: '2025-02-01',
    monthlyRent: 9800,
    status: 'expiring',
  },
  {
    id: '3',
    environmentId: '1',
    environmentName: 'Executive Suite A',
    tenantName: 'LegalFirm LLP',
    tenantEmail: 'info@legalfirm.com',
    startDate: '2023-03-01',
    endDate: '2024-12-31',
    monthlyRent: 4500,
    status: 'expired',
  },
];

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  isLoading: false,
  
  fetchContracts: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedContracts = mockContracts.map(c => ({
      ...c,
      status: calculateStatus(c.endDate),
    }));
    
    set({ contracts: updatedContracts, isLoading: false });
  },
  
  addContract: (contract) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
      status: calculateStatus(contract.endDate),
    };
    set((state) => ({
      contracts: [...state.contracts, newContract],
    }));
  },
  
  updateContract: (id, contract) => {
    set((state) => ({
      contracts: state.contracts.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...contract };
          if (contract.endDate) {
            updated.status = calculateStatus(contract.endDate);
          }
          return updated;
        }
        return c;
      }),
    }));
  },
  
  deleteContract: (id) => {
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    }));
  },
  
  getExpiringContracts: () => {
    return get().contracts.filter(c => c.status === 'expiring');
  },
  
  getActiveContracts: () => {
    return get().contracts.filter(c => c.status === 'active');
  },
}));
