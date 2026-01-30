import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Business } from '@/stores/businessStore';
import { Badge } from '@/components/ui/badge';

interface BusinessCardProps {
  business: Business;
  variant?: 'public' | 'admin';
}

export function BusinessCard({ business, variant = 'public' }: BusinessCardProps) {
  const isPublic = variant === 'public';
  
  return (
    <div className="card-elevated overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.images[0] || business.logo}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <img
            src={business.logo}
            alt={`${business.name} logo`}
            className="w-12 h-12 rounded-xl object-cover border-2 border-background shadow-lg"
          />
          <div>
            <Badge variant={business.status === 'active' ? 'default' : 'secondary'} className="mb-1">
              {business.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {business.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{business.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {business.description}
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{business.floor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{business.schedule}</span>
          </div>
        </div>
        
        {isPublic && (
          <Link 
            to={`/negocio/${business.id}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Ver más <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
