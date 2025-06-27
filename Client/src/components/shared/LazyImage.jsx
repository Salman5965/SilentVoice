import React, { memo } from "react";
import { cn } from "@/lib/utils";
import {
  useImageLazyLoad,
  useProgressiveImage,
} from "@/hooks/useImageLazyLoad";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Optimized lazy loading image component with progressive enhancement
 */
const LazyImage = memo(
  ({
    src,
    alt = "",
    width,
    height,
    className = "",
    placeholder = "",
    fallback = "/images/placeholder.jpg",
    quality = 80,
    shouldLazyLoad = true,
    progressive = false,
    lowQualitySrc = "",
    onLoad,
    onError,
    ...props
  }) => {
    // Use progressive loading if enabled and low quality source is provided
    const useProgressive = progressive && lowQualitySrc;

    const lazyImageProps = useImageLazyLoad({
      src: useProgressive ? undefined : src,
      placeholder,
      fallback,
      width,
      quality,
      shouldLazyLoad,
    });

    const progressiveProps = useProgressiveImage({
      lowQualitySrc,
      highQualitySrc: src,
      shouldLazyLoad,
    });

    // Choose which props to use based on progressive loading
    const {
      ref,
      src: imageSrc,
      isLoaded,
      isError,
      isLoading,
    } = useProgressive ? progressiveProps : lazyImageProps;

    const handleLoad = (e) => {
      onLoad?.(e);
    };

    const handleError = (e) => {
      onError?.(e);
    };

    // Show skeleton while loading
    if (isLoading && !imageSrc) {
      return (
        <div ref={ref} className={cn("relative overflow-hidden", className)}>
          <Skeleton className="w-full h-full" />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300",
            {
              "opacity-0": !isLoaded && !isError,
              "opacity-100": isLoaded || isError,
              "blur-sm": progressive && !progressiveProps.isHighQualityLoaded,
            },
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={shouldLazyLoad ? "lazy" : "eager"}
          decoding="async"
          {...props}
        />

        {/* Loading overlay */}
        {isLoading && imageSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    );
  },
);

LazyImage.displayName = "LazyImage";

/**
 * Avatar image with lazy loading and fallback
 */
export const LazyAvatar = memo(
  ({ src, alt, fallback, size = "md", className = "", ...props }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
    };

    return (
      <LazyImage
        src={src}
        alt={alt}
        fallback={fallback || "/images/default-avatar.png"}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className,
        )}
        shouldLazyLoad={true}
        {...props}
      />
    );
  },
);

LazyAvatar.displayName = "LazyAvatar";

/**
 * Cover image with aspect ratio and lazy loading
 */
export const LazyCoverImage = memo(
  ({
    src,
    alt,
    aspectRatio = "16/9",
    className = "",
    progressive = true,
    ...props
  }) => {
    // Generate low quality placeholder URL (you can implement this based on your image service)
    const lowQualitySrc = src ? `${src}?w=50&q=10` : "";

    return (
      <div
        className={cn("relative overflow-hidden bg-muted", className)}
        style={{ aspectRatio }}
      >
        <LazyImage
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          progressive={progressive}
          lowQualitySrc={lowQualitySrc}
          fallback="/images/default-cover.jpg"
          {...props}
        />
      </div>
    );
  },
);

LazyCoverImage.displayName = "LazyCoverImage";

/**
 * Responsive image that adapts to different screen sizes
 */
export const ResponsiveLazyImage = memo(
  ({ srcSet = [], src, alt, className = "", ...props }) => {
    // Convert srcSet to sizes if needed
    const sizes =
      srcSet.length > 0
        ? srcSet
            .map(({ breakpoint, src }) => `(min-width: ${breakpoint}) ${src}`)
            .join(", ")
        : undefined;

    return (
      <LazyImage
        src={src}
        alt={alt}
        className={className}
        sizes={sizes}
        {...props}
      />
    );
  },
);

ResponsiveLazyImage.displayName = "ResponsiveLazyImage";

export default LazyImage;