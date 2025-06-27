import React, { memo, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateOptimalChunkSize } from "@/utils/performance";

/**
 * Virtual scrolling list component for performance optimization
 */
const VirtualScrollList = memo(
  ({
    items = [],
    itemHeight = 200,
    hasNextPage = false,
    isNextPageLoading = false,
    loadNextPage = () => {},
    renderItem,
    renderLoadingItem,
    renderEmptyState,
    className = "",
    overscan = 5,
    threshold = 15,
    ...props
  }) => {
    // Calculate total item count including loading items
    const itemCount = hasNextPage ? items.length + 1 : items.length;

    // Check if item is loaded
    const isItemLoaded = useCallback((index) => !!items[index], [items]);

    // Memoized item renderer
    const ItemRenderer = useCallback(
      ({ index, style }) => {
        const isLoading = index >= items.length;
        const item = items[index];

        return (
          <div style={style} className="px-1">
            {isLoading ? (
              renderLoadingItem ? (
                renderLoadingItem({ index, style })
              ) : (
                <VirtualItemSkeleton />
              )
            ) : (
              renderItem({ item, index, style })
            )}
          </div>
        );
      },
      [items, renderItem, renderLoadingItem],
    );

    // Empty state
    if (items.length === 0 && !isNextPageLoading) {
      return renderEmptyState ? renderEmptyState() : <VirtualEmptyState />;
    }

    return (
      <div className={cn("w-full h-full", className)}>
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadNextPage}
              threshold={threshold}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  ref={ref}
                  height={height}
                  width={width}
                  itemCount={itemCount}
                  itemSize={itemHeight}
                  onItemsRendered={onItemsRendered}
                  overscanCount={overscan}
                  {...props}
                >
                  {ItemRenderer}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  },
);

VirtualScrollList.displayName = "VirtualScrollList";

/**
 * Grid-based virtual scrolling component
 */
export const VirtualScrollGrid = memo(
  ({
    items = [],
    itemWidth = 300,
    itemHeight = 200,
    columns = "auto",
    gap = 16,
    hasNextPage = false,
    isNextPageLoading = false,
    loadNextPage = () => {},
    renderItem,
    renderLoadingItem,
    renderEmptyState,
    className = "",
    ...props
  }) => {
    // Calculate columns based on container width
    const calculateColumns = useCallback(
      (containerWidth) => {
        if (typeof columns === "number") return columns;
        return Math.floor((containerWidth + gap) / (itemWidth + gap));
      },
      [columns, itemWidth, gap],
    );

    // Calculate row count
    const getRowCount = useCallback(
      (cols) => {
        const totalItems = hasNextPage ? items.length + cols : items.length;
        return Math.ceil(totalItems / cols);
      },
      [items.length, hasNextPage],
    );

    // Grid item renderer
    const GridRowRenderer = useCallback(
      ({ index: rowIndex, style, containerWidth }) => {
        const cols = calculateColumns(containerWidth);
        const startIndex = rowIndex * cols;
        const endIndex = Math.min(startIndex + cols, items.length);

        return (
          <div style={style} className="flex" role="row">
            {Array.from({ length: cols }, (_, colIndex) => {
              const itemIndex = startIndex + colIndex;
              const item = items[itemIndex];
              const isLoading = itemIndex >= items.length && hasNextPage;

              return (
                <div
                  key={itemIndex}
                  className="flex-shrink-0"
                  style={{
                    width: itemWidth,
                    marginRight: colIndex < cols - 1 ? gap : 0,
                  }}
                  role="gridcell"
                >
                  {isLoading ? (
                    renderLoadingItem ? (
                      renderLoadingItem({ index: itemIndex })
                    ) : (
                      <VirtualItemSkeleton />
                    )
                  ) : item ? (
                    renderItem({ item, index: itemIndex })
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      },
      [
        items,
        calculateColumns,
        itemWidth,
        gap,
        hasNextPage,
        renderItem,
        renderLoadingItem,
      ],
    );

    // Empty state
    if (items.length === 0 && !isNextPageLoading) {
      return renderEmptyState ? renderEmptyState() : <VirtualEmptyState />;
    }

    return (
      <div className={cn("w-full h-full", className)}>
        <AutoSizer>
          {({ height, width }) => {
            const cols = calculateColumns(width);
            const rowCount = getRowCount(cols);

            return (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={rowCount}
                itemSize={itemHeight + gap}
                {...props}
              >
                {({ index, style }) =>
                  GridRowRenderer({ index, style, containerWidth: width })
                }
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      </div>
    );
  },
);

VirtualScrollGrid.displayName = "VirtualScrollGrid";

/**
 * Default skeleton component for loading items
 */
const VirtualItemSkeleton = memo(() => (
  <div className="p-4 border rounded-lg bg-card">
    <div className="flex items-start space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
));

VirtualItemSkeleton.displayName = "VirtualItemSkeleton";

/**
 * Default empty state component
 */
const VirtualEmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      No items found
    </h3>
    <p className="text-muted-foreground">
      There are no items to display at the moment.
    </p>
  </div>
));

VirtualEmptyState.displayName = "VirtualEmptyState";

/**
 * Hook for virtual scroll performance optimization
 */
export const useVirtualScrollConfig = ({
  totalItems = 0,
  viewport = "mobile",
}) => {
  const config = useMemo(() => {
    const optimalChunkSize = calculateOptimalChunkSize();

    const baseConfig = {
      itemHeight: 200,
      overscan: 5,
      threshold: 15,
      chunkSize: optimalChunkSize,
    };

    // Adjust based on viewport
    if (viewport === "mobile") {
      return {
        ...baseConfig,
        itemHeight: 180,
        overscan: 3,
        threshold: 10,
      };
    }

    if (viewport === "tablet") {
      return {
        ...baseConfig,
        itemHeight: 220,
        overscan: 4,
        threshold: 12,
      };
    }

    return baseConfig;
  }, [totalItems, viewport]);

  return config;
};

export default VirtualScrollList;