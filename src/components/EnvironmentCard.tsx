import { motion } from 'framer-motion';
import { Environment } from '@/stores/environmentStore';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { MapPin, Maximize, DollarSign } from 'lucide-react';

interface EnvironmentCardProps {
  environment: Environment;
  onClick?: () => void;
  variant?: 'admin' | 'public';
}

export function EnvironmentCard({ environment, onClick, variant = 'admin' }: EnvironmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card-elevated overflow-hidden cursor-pointer group"
    >
      <PhotoCarousel photos={environment.photos} className="h-48" />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {environment.name}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              environment.status === 'available'
                ? 'status-available'
                : 'status-rented'
            }`}
          >
            {environment.status === 'available' ? 'Disponible' : 'Rentado'}
          </span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {environment.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4" />
            <span>{environment.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>Piso {environment.floor}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-primary">
            <DollarSign className="h-5 w-5" />
            <span className="text-xl font-bold">{environment.rentalPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/mes</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
