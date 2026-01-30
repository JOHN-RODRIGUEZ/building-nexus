import { create } from 'zustand';

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  images: string[];
  phone: string;
  email: string;
  website?: string;
  floor: string;
  schedule: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface BusinessStore {
  businesses: Business[];
  selectedBusiness: Business | null;
  isLoading: boolean;
  fetchBusinesses: () => Promise<void>;
  getBusinessById: (id: string) => Business | undefined;
  addBusiness: (business: Omit<Business, 'id' | 'createdAt'>) => void;
  updateBusiness: (id: string, business: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  setSelectedBusiness: (business: Business | null) => void;
}

// Mock data
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Tech Solutions MX',
    description: 'Empresa líder en desarrollo de software y soluciones tecnológicas empresariales. Ofrecemos servicios de consultoría, desarrollo a medida y soporte técnico especializado.',
    category: 'Tecnología',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    ],
    phone: '+52 555 123 4567',
    email: 'contacto@techsolutions.mx',
    website: 'https://techsolutions.mx',
    floor: 'Piso 3, Local 301',
    schedule: 'Lun-Vie: 9:00 AM - 6:00 PM',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Café Artesanal Origen',
    description: 'Cafetería especializada en café de especialidad de origen mexicano. Ambiente acogedor perfecto para reuniones de trabajo o un momento de descanso.',
    category: 'Gastronomía',
    logo: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
    ],
    phone: '+52 555 234 5678',
    email: 'hola@cafeorigen.mx',
    floor: 'Planta Baja, Local 101',
    schedule: 'Lun-Sáb: 7:00 AM - 8:00 PM',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Consultores Legales Asociados',
    description: 'Despacho de abogados especializados en derecho corporativo, contratos comerciales y propiedad intelectual. Más de 20 años de experiencia.',
    category: 'Servicios Legales',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    ],
    phone: '+52 555 345 6789',
    email: 'info@consultoreslegales.mx',
    website: 'https://consultoreslegales.mx',
    floor: 'Piso 5, Local 502',
    schedule: 'Lun-Vie: 9:00 AM - 7:00 PM',
    status: 'active',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Fitness Center Pro',
    description: 'Gimnasio completamente equipado con las últimas máquinas y equipos. Clases grupales, entrenamiento personal y área de spa.',
    category: 'Salud y Bienestar',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    ],
    phone: '+52 555 456 7890',
    email: 'info@fitnesscenterpro.mx',
    floor: 'Sótano 1',
    schedule: 'Lun-Dom: 5:00 AM - 11:00 PM',
    status: 'active',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '5',
    name: 'Clínica Dental Sonrisa',
    description: 'Clínica dental integral con tecnología de vanguardia. Especialistas en ortodoncia, implantes y estética dental.',
    category: 'Salud',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    ],
    phone: '+52 555 567 8901',
    email: 'citas@clinicasonrisa.mx',
    website: 'https://clinicasonrisa.mx',
    floor: 'Piso 2, Local 205',
    schedule: 'Lun-Sáb: 8:00 AM - 8:00 PM',
    status: 'active',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '6',
    name: 'Agencia Creativa Pixel',
    description: 'Agencia de diseño y marketing digital. Branding, desarrollo web, campañas publicitarias y redes sociales.',
    category: 'Marketing',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    ],
    phone: '+52 555 678 9012',
    email: 'hola@agenciapixel.mx',
    website: 'https://agenciapixel.mx',
    floor: 'Piso 4, Local 401',
    schedule: 'Lun-Vie: 10:00 AM - 7:00 PM',
    status: 'inactive',
    createdAt: new Date('2024-01-10'),
  },
];

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  businesses: [],
  selectedBusiness: null,
  isLoading: false,

  fetchBusinesses: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ businesses: mockBusinesses, isLoading: false });
  },

  getBusinessById: (id: string) => {
    return get().businesses.find((b) => b.id === id);
  },

  addBusiness: (business) => {
    const newBusiness: Business = {
      ...business,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => ({ businesses: [...state.businesses, newBusiness] }));
  },

  updateBusiness: (id, updates) => {
    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
  },

  deleteBusiness: (id) => {
    set((state) => ({
      businesses: state.businesses.filter((b) => b.id !== id),
    }));
  },

  setSelectedBusiness: (business) => {
    set({ selectedBusiness: business });
  },
}));
