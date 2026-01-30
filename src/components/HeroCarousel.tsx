import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

const slides: HeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920',
    title: 'Espacios de Oficina Premium',
    subtitle: 'Diseñados para la productividad y el éxito de tu negocio',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
    title: 'Ambientes Modernos',
    subtitle: 'Tecnología de punta y amenidades de primer nivel',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920',
    title: 'Ubicación Estratégica',
    subtitle: 'En el corazón del distrito empresarial',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920',
    title: 'Comunidad Empresarial',
    subtitle: 'Conecta con otros negocios y profesionales',
  },
];

interface HeroCarouselProps {
  onExplore?: () => void;
  onContact?: () => void;
}

export function HeroCarousel({ onExplore, onContact }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id + '-text'}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                {slides[current].title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-primary">
                  {slides[current].title.split(' ').slice(-1)}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                {slides[current].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="rounded-xl text-lg px-8 h-14 gap-2"
                  onClick={onExplore}
                >
                  Explorar Espacios
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl text-lg px-8 h-14 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
                  onClick={onContact}
                >
                  Contáctanos
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="pointer-events-auto h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 hover:text-primary-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="pointer-events-auto h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 hover:text-primary-foreground"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
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
  );
}
