import { useEffect, useRef, useCallback } from "react";

const useInfiniteScroll = (hasMore, loading, onLoadMore) => {
  const observerRef = useRef(null);
  const loadMoreRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold: 0.1, rootMargin: "100px" },
      );
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore],
  );

  return { loadMoreRef };
};

export default useInfiniteScroll;
