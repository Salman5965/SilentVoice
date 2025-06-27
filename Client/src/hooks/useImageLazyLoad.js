import { useState, useRef, useEffect } from "react";
import { useLazyLoad } from "./useIntersectionObserver";
import { preloadImage, getOptimizedImageUrl } from "@/utils/performance";

/**
 * Hook for lazy loading images with optimization and error handling
 */
export const useImageLazyLoad = ({
  src,
  placeholder = "",
  fallback = "/images/placeholder.jpg",
  width,
  quality = 80,
  shouldLazyLoad = true,
  preload = false,
} = {}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef();

  const { ref: lazyRef, shouldLoad } = useLazyLoad(shouldLazyLoad, {
    threshold: 0.1,
    rootMargin: "50px",
  });

  // Combine refs
  const combinedRef = (node) => {
    imageRef.current = node;
    lazyRef.current = node;
  };

  // Load image when it should be loaded
  useEffect(() => {
    if (!src || (!shouldLoad && !preload)) return;

    const loadImage = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const optimizedSrc = getOptimizedImageUrl(src, width, quality);
        await preloadImage(optimizedSrc || src);
        setImageSrc(optimizedSrc || src);
        setIsLoaded(true);
      } catch (error) {
        console.warn("Failed to load image:", src, error);
        setIsError(true);
        setImageSrc(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, shouldLoad, preload, width, quality, fallback]);

  return {
    ref: combinedRef,
    src: imageSrc,
    isLoaded,
    isError,
    isLoading,
    shouldLoad,
  };
};

/**
 * Hook for progressive image loading (blur-up technique)
 */
export const useProgressiveImage = ({
  lowQualitySrc,
  highQualitySrc,
  shouldLazyLoad = true,
}) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, shouldLoad } = useLazyLoad(shouldLazyLoad, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (!shouldLoad || !highQualitySrc) return;

    const loadHighQuality = async () => {
      setIsLoading(true);
      try {
        await preloadImage(highQualitySrc);
        setCurrentSrc(highQualitySrc);
        setIsHighQualityLoaded(true);
      } catch (error) {
        console.warn("Failed to load high quality image:", highQualitySrc);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to show low quality first
    const timer = setTimeout(loadHighQuality, 100);
    return () => clearTimeout(timer);
  }, [shouldLoad, highQualitySrc]);

  return {
    ref,
    src: currentSrc,
    isHighQualityLoaded,
    isLoading,
    shouldLoad,
  };
};

/**
 * Hook for responsive images with different sources for different screen sizes
 */
export const useResponsiveImage = ({
  sources = [],
  defaultSrc,
  shouldLazyLoad = true,
}) => {
  const [currentSrc, setCurrentSrc] = useState(defaultSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref, shouldLoad } = useLazyLoad(shouldLazyLoad);

  useEffect(() => {
    if (!shouldLoad) return;

    const selectBestSource = () => {
      const screenWidth = window.innerWidth;
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Find the best matching source
      const sortedSources = sources.sort((a, b) => a.minWidth - b.minWidth);
      const bestSource =
        sortedSources.find((source) => screenWidth >= source.minWidth) ||
        sortedSources[sortedSources.length - 1];

      const selectedSrc = bestSource?.src || defaultSrc;

      // Consider device pixel ratio for high-DPI displays
      if (devicePixelRatio > 1 && bestSource?.srcHiDPI) {
        return bestSource.srcHiDPI;
      }

      return selectedSrc;
    };

    const loadSelectedImage = async () => {
      const selectedSrc = selectBestSource();
      if (selectedSrc === currentSrc) return;

      try {
        await preloadImage(selectedSrc);
        setCurrentSrc(selectedSrc);
        setIsLoaded(true);
      } catch (error) {
        console.warn("Failed to load responsive image:", selectedSrc);
        setCurrentSrc(defaultSrc);
      }
    };

    loadSelectedImage();

    // Re-evaluate on window resize
    const handleResize = throttle(loadSelectedImage, 250);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [shouldLoad, sources, defaultSrc, currentSrc]);

  return {
    ref,
    src: currentSrc,
    isLoaded,
    shouldLoad,
  };
};

// Throttle function (if not imported from performance utils)
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
