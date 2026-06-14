const cache = new Map();

export const getCached = (key, ttl = 60000) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`Cache hit for key: ${key}`);
    return cached.data;
  }
  console.log(`Cache miss for key: ${key}`);
  return null;
};

export const setCached = (key, data) => {
  console.log(`Setting cache for key: ${key}`);
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = () => {
  console.log("Clearing all cache");
  cache.clear();
};

// Очистка кэша при выходе из системы
export const clearAuthCache = () => {
  for (const key of cache.keys()) {
    if (key.startsWith("requests_page_")) {
      cache.delete(key);
    }
  }
};
