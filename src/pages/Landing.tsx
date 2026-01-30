import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Phone, Mail, Clock, Shield, Wifi, Car, Coffee, Menu, X, Store } from 'lucide-react';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { useBusinessStore } from '@/stores/businessStore';
import { EnvironmentCard } from '@/components/EnvironmentCard';
import { BusinessCard } from '@/components/BusinessCard';
import { HeroCarousel } from '@/components/HeroCarousel';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const { environments, fetchEnvironments } = useEnvironmentStore();
  const { businesses, fetchBusinesses } = useBusinessStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    fetchEnvironments();
    fetchBusinesses();
  }, [fetchEnvironments, fetchBusinesses]);

  const availableEnvironments = environments.filter(e => e.status === 'available').slice(0, 3);
  const activeBusinesses = businesses.filter(b => b.status === 'active').slice(0, 6);

  const services = [
    { icon: Shield, title: 'Seguridad 24/7', description: 'Monitoreo de seguridad y control de acceso las 24 horas' },
    { icon: Wifi, title: 'Internet de Alta Velocidad', description: 'Conectividad de fibra óptica en todo el edificio' },
    { icon: Car, title: 'Estacionamiento', description: 'Estacionamiento cubierto con espacios reservados disponibles' },
    { icon: Coffee, title: 'Áreas Comunes', description: 'Sala de estar, cafetería y salas de reuniones' },
  ];

  const navLinks = [
    { href: '#businesses', label: 'Negocios' },
    { href: '#spaces', label: 'Espacios' },
    { href: '#services', label: 'Servicios' },
    { href: '#contact', label: 'Contacto' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">BuildingOS</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="hidden md:flex rounded-xl"
              onClick={() => setLoginModalOpen(true)}
            >
              Acceso Admin
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="nav-link text-primary text-left"
                >
                  Acceso Admin
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Carousel */}
      <HeroCarousel 
        onExplore={() => scrollToSection('#businesses')}
        onContact={() => scrollToSection('#contact')}
      />

      {/* Businesses Section */}
      <section id="businesses" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Store className="h-4 w-4" />
              <span className="text-sm font-medium">Directorio de Negocios</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Negocios en el Edificio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre la variedad de negocios y servicios disponibles en nuestra galería comercial
            </p>
          </motion.div>

          {activeBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No hay negocios disponibles actualmente</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBusinesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BusinessCard business={business} variant="public" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Available Spaces */}
      <section id="spaces" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Espacios Disponibles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección de ambientes de oficina premium listos para ocupación inmediata
            </p>
          </motion.div>

          {availableEnvironments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No hay espacios disponibles actualmente</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEnvironments.map((env, index) => (
                <motion.div
                  key={env.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnvironmentCard environment={env} variant="public" />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a href="#contact">
              <Button variant="outline" size="lg" className="rounded-xl gap-2">
                Consultar Disponibilidad
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Amenidades del Edificio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para un ambiente de trabajo productivo y cómodo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center group hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Building Info */}
      <section id="contact" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ponte en Contacto</h2>
              <p className="text-lg text-muted-foreground mb-8">
                ¿Listo para encontrar tu espacio de oficina perfecto? Contáctanos hoy para agendar un recorrido 
                o conocer más sobre nuestros ambientes disponibles.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-muted-foreground">
                      Av. Distrito Empresarial 123<br />
                      Centro, Ciudad 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-muted-foreground">+52 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                    <p className="text-muted-foreground">arrendamiento@buildingos.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horario de Oficina</h3>
                    <p className="text-muted-foreground">
                      Lun–Vie: 9:00 AM – 6:00 PM<br />
                      Sáb: 10:00 AM – 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-elevated p-8"
            >
              <h3 className="text-xl font-semibold mb-6">Envíanos un Mensaje</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="input-futuristic w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Correo</label>
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      className="input-futuristic w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asunto</label>
                  <input
                    type="text"
                    placeholder="¿Cómo podemos ayudarte?"
                    className="input-futuristic w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensaje</label>
                  <textarea
                    placeholder="Cuéntanos sobre tus necesidades..."
                    rows={4}
                    className="input-futuristic w-full py-3"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 text-base">
                  Enviar Mensaje
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

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

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
