import { LRUCache } from 'lru-cache';

const originCache = new LRUCache<string, boolean>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// CORS configuration
const CORS_CONFIG = {
  allowedOrigins: ['http://localhost:8081'],
  allowedPatterns: [/^https:\/\/[a-zA-Z0-9-]+\.expo\.app$/],
};

const isOriginAllowed = (origin: string): boolean => {
  // Check static origins
  const isOriginInList = CORS_CONFIG.allowedOrigins.some((allowedOrigin) => {
    if (origin.includes(allowedOrigin)) {
      return true;
    }
    return false;
  });

  if (isOriginInList) {
    return true;
  }

  // Check pattern-based origins
  return CORS_CONFIG.allowedPatterns.some((pattern) => pattern.test(origin));
};

export const validateOrigin = (origin: string): boolean => {
  const cached = originCache.get(origin);
  if (cached !== undefined) {
    return cached;
  }

  const isValid = isOriginAllowed(origin);
  originCache.set(origin, isValid);
  return isValid;
};
