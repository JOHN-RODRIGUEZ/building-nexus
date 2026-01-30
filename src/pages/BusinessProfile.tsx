import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Building2,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BusinessProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { businesses, fetchBusinesses, getBusinessById } = useBusinessStore();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (businesses.length === 0) {
      fetchBusinesses();
    }
  }, [businesses.length, fetchBusinesses]);

  const business = getBusinessById(id || '');

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Negocio no encontrado</h1>
          <Link to="/">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % business.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + business.images.length) % business.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">BuildingOS</span>
          </Link>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Image Gallery */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <motion.img
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={business.images[currentImage]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Navigation */}
          {business.images.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {business.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImage
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Business Card */}
            <div className="card-elevated p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={business.logo}
                  alt={`${business.name} logo`}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge className="rounded-lg">{business.category}</Badge>
                    <Badge 
                      variant={business.status === 'active' ? 'default' : 'secondary'}
                      className="rounded-lg"
                    >
                      {business.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{business.name}</h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {business.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location & Schedule */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Ubicación y Horario</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">{business.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Horario</p>
                      <p className="text-muted-foreground">{business.schedule}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="card-elevated p-6">
                <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <a 
                        href={`tel:${business.phone}`}
                        className="text-primary hover:underline"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Correo</p>
                      <a 
                        href={`mailto:${business.email}`}
                        className="text-primary hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                  {business.website && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sitio Web</p>
                        <a 
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {business.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">BuildingOS</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BuildingOS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
