import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for Intersection Observer API
 * Useful for lazy loading, infinite scrolling, and viewport tracking
 */
export const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
  freezeOnceVisible = false,
} = {}) => {
  const [entry, setEntry] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]) => {
    setEntry(entry);
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [
    elementRef?.current,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
  ]);

  return {
    ref: elementRef,
    entry,
    isVisible,
    isIntersecting: entry?.isIntersecting || false,
  };
};

/**
 * Hook for lazy loading content when element comes into view
 */
export const useLazyLoad = (shouldLoad = true, options = {}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isVisible, ref } = useIntersectionObserver({
    freezeOnceVisible: true,
    ...options,
  });

  useEffect(() => {
    if (isVisible && shouldLoad && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isVisible, shouldLoad, hasLoaded]);

  return {
    ref,
    hasLoaded,
    isVisible,
    shouldLoad: hasLoaded || isVisible,
  };
};

/**
 * Hook for infinite scrolling
 */
export const useInfiniteScroll = (
  loadMore,
  { hasMore = true, threshold = 0.1, rootMargin = "100px" } = {},
) => {
  const [isFetching, setIsFetching] = useState(false);
  const { isVisible, ref } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isVisible && hasMore && !isFetching) {
      setIsFetching(true);
      loadMore()
        .then(() => setIsFetching(false))
        .catch(() => setIsFetching(false));
    }
  }, [isVisible, hasMore, isFetching, loadMore]);

  return {
    ref,
    isFetching,
    isVisible,
  };
};

/**
 * Hook for tracking element visibility percentage
 */
export const useVisibilityPercentage = (options = {}) => {
  const [visibilityPercentage, setVisibilityPercentage] = useState(0);
  const elementRef = useRef();

  useEffect(() => {
    const node = elementRef?.current;
    if (!node || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const percentage = Math.round(entry.intersectionRatio * 100);
        setVisibilityPercentage(percentage);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        ...options,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef?.current, JSON.stringify(options)]);

  return {
    ref: elementRef,
    visibilityPercentage,
    isFullyVisible: visibilityPercentage === 100,
    isPartiallyVisible: visibilityPercentage > 0,
  };
};
