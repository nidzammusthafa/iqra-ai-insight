import { useState, useEffect } from 'react';

export const useScroll = (threshold = 10) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: NodeJS.Timeout | null = null;

  const handleScroll = () => {
    if (window.scrollY > threshold) {
      setIsVisible(true);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide after 3 seconds of no scrolling
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold]);

  return isVisible;
};
