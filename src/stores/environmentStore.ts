import { create } from 'zustand';

export interface Environment {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'rented';
  rentalPrice: number;
  photos: string[];
  area: number;
  floor: number;
}

interface EnvironmentState {
  environments: Environment[];
  selectedEnvironment: Environment | null;
  isLoading: boolean;
  fetchEnvironments: () => Promise<void>;
  addEnvironment: (env: Omit<Environment, 'id'>) => void;
  updateEnvironment: (id: string, env: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  selectEnvironment: (env: Environment | null) => void;
}

const mockEnvironments: Environment[] = [
  {
    id: '1',
    name: 'Executive Suite A',
    description: 'Premium corner office with panoramic city views. Features include private meeting room, executive bathroom, and smart climate control.',
    status: 'available',
    rentalPrice: 4500,
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    ],
    area: 120,
    floor: 15,
  },
  {
    id: '2',
    name: 'Open Space Office B',
    description: 'Modern collaborative workspace designed for teams of 20-30. Includes breakout areas and phone booths.',
    status: 'rented',
    rentalPrice: 8500,
    photos: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
    ],
    area: 350,
    floor: 8,
  },
  {
    id: '3',
    name: 'Creative Studio C',
    description: 'Flexible space ideal for creative agencies. High ceilings, natural light, and industrial aesthetic.',
    status: 'available',
    rentalPrice: 5200,
    photos: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800',
    ],
    area: 180,
    floor: 3,
  },
  {
    id: '4',
    name: 'Conference Center D',
    description: 'State-of-the-art conference facility with A/V equipment, video conferencing, and catering kitchen.',
    status: 'available',
    rentalPrice: 3200,
    photos: [
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800',
    ],
    area: 90,
    floor: 12,
  },
  {
    id: '5',
    name: 'Tech Hub E',
    description: 'Purpose-built for tech companies with dedicated server room, raised flooring, and redundant power.',
    status: 'rented',
    rentalPrice: 9800,
    photos: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    ],
    area: 400,
    floor: 5,
  },
];

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: [],
  selectedEnvironment: null,
  isLoading: false,
  
  fetchEnvironments: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ environments: mockEnvironments, isLoading: false });
  },
  
  addEnvironment: (env) => {
    const newEnv: Environment = {
      ...env,
      id: Date.now().toString(),
    };
    set((state) => ({
      environments: [...state.environments, newEnv],
    }));
  },
  
  updateEnvironment: (id, env) => {
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === id ? { ...e, ...env } : e
      ),
    }));
  },
  
  deleteEnvironment: (id) => {
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
    }));
  },
  
  selectEnvironment: (env) => {
    set({ selectedEnvironment: env });
  },
}));
