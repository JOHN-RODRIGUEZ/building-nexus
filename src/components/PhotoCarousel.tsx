import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoCarouselProps {
  photos: string[];
  className?: string;
}

export function PhotoCarousel({ photos, className = '' }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className={`bg-muted rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground">No photos available</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-background/60 hover:bg-background'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
