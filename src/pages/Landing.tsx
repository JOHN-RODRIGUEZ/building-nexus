import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, MapPin, Phone, Mail, Clock, Shield, Wifi, Car, Coffee } from 'lucide-react';
import { useEnvironmentStore } from '@/stores/environmentStore';
import { EnvironmentCard } from '@/components/EnvironmentCard';
import { Button } from '@/components/ui/button';
import heroBuildingImage from '@/assets/hero-building.jpg';

export default function LandingPage() {
  const { environments, fetchEnvironments } = useEnvironmentStore();

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  const availableEnvironments = environments.filter(e => e.status === 'available').slice(0, 3);

  const services = [
    { icon: Shield, title: '24/7 Security', description: 'Round-the-clock security monitoring and access control' },
    { icon: Wifi, title: 'High-Speed Internet', description: 'Fiber optic connectivity throughout the building' },
    { icon: Car, title: 'Parking', description: 'Covered parking with reserved spots available' },
    { icon: Coffee, title: 'Common Areas', description: 'Lounge, cafeteria, and meeting rooms' },
  ];

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
            <a href="#spaces" className="text-muted-foreground hover:text-foreground transition-colors">Spaces</a>
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>

          <Link to="/login">
            <Button variant="outline" className="rounded-xl">
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBuildingImage}
            alt="Modern office building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Premium Office Spaces<br />
              <span className="text-primary">for Modern Business</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              State-of-the-art commercial spaces designed for productivity and success. 
              Find your perfect workspace today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#spaces">
                <Button size="lg" className="rounded-xl text-lg px-8 h-14 gap-2">
                  Explore Spaces <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="rounded-xl text-lg px-8 h-14 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                  Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 rounded-full bg-primary-foreground/60"
            />
          </div>
        </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Spaces</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our selection of premium office environments ready for immediate occupancy
            </p>
          </motion.div>

          {availableEnvironments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No spaces currently available</p>
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
                View All Spaces <ArrowRight className="h-5 w-5" />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Building Amenities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a productive and comfortable work environment
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Ready to find your perfect office space? Contact us today to schedule a tour 
                or learn more about our available environments.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      123 Business District Avenue<br />
                      Downtown, City 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">leasing@buildingos.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Mon–Fri: 9:00 AM – 6:00 PM<br />
                      Sat: 10:00 AM – 2:00 PM
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
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input-futuristic w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="input-futuristic w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="input-futuristic w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    placeholder="Tell us about your needs..."
                    rows={4}
                    className="input-futuristic w-full py-3"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 text-base">
                  Send Message
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
            © {new Date().getFullYear()} BuildingOS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
