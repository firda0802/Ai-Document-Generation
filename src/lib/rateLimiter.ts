// Device-based rate limiting utility

const RATE_LIMIT_KEY = 'docmaker_rate_limit';
const DEVICE_ID_KEY = 'docmaker_device_id';

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface RateLimitStore {
  [action: string]: RateLimitEntry;
}

// Generate or get device ID
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// Get rate limit store
function getRateLimitStore(): RateLimitStore {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save rate limit store
function saveRateLimitStore(store: RateLimitStore): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(store));
}

// Rate limits per action (requests per time window in ms)
const RATE_LIMITS = {
  document_generation: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour for free
  presentation_generation: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  spreadsheet_generation: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  chat_message: { maxRequests: 30, windowMs: 60 * 60 * 1000 }, // 30 per hour
  story_generation: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
};

// Premium rate limits (much higher)
const PREMIUM_RATE_LIMITS = {
  document_generation: { maxRequests: 100, windowMs: 60 * 60 * 1000 },
  presentation_generation: { maxRequests: 100, windowMs: 60 * 60 * 1000 },
  spreadsheet_generation: { maxRequests: 100, windowMs: 60 * 60 * 1000 },
  chat_message: { maxRequests: 1000, windowMs: 60 * 60 * 1000 },
  story_generation: { maxRequests: 100, windowMs: 60 * 60 * 1000 },
};

export type RateLimitAction = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  message?: string;
}

export function checkRateLimit(action: RateLimitAction, isPremium: boolean = false): RateLimitResult {
  const limits = isPremium ? PREMIUM_RATE_LIMITS[action] : RATE_LIMITS[action];
  const store = getRateLimitStore();
  const now = Date.now();
  
  const entry = store[action];
  
  // If no entry or window has passed, allow and start fresh
  if (!entry || (now - entry.firstRequest) > limits.windowMs) {
    store[action] = {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    };
    saveRateLimitStore(store);
    return {
      allowed: true,
      remaining: limits.maxRequests - 1,
      resetIn: limits.windowMs,
    };
  }
  
  // Within window, check count
  if (entry.count >= limits.maxRequests) {
    const resetIn = limits.windowMs - (now - entry.firstRequest);
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      message: `Rate limit exceeded. Please wait ${Math.ceil(resetIn / 60000)} minutes before trying again.`,
    };
  }
  
  // Increment count
  store[action] = {
    ...entry,
    count: entry.count + 1,
    lastRequest: now,
  };
  saveRateLimitStore(store);
  
  return {
    allowed: true,
    remaining: limits.maxRequests - entry.count - 1,
    resetIn: limits.windowMs - (now - entry.firstRequest),
  };
}

// Get remaining requests for an action
export function getRemainingRequests(action: RateLimitAction, isPremium: boolean = false): number {
  const limits = isPremium ? PREMIUM_RATE_LIMITS[action] : RATE_LIMITS[action];
  const store = getRateLimitStore();
  const now = Date.now();
  
  const entry = store[action];
  
  if (!entry || (now - entry.firstRequest) > limits.windowMs) {
    return limits.maxRequests;
  }
  
  return Math.max(0, limits.maxRequests - entry.count);
}

// Reset rate limit for an action (for testing or admin purposes)
export function resetRateLimit(action: RateLimitAction): void {
  const store = getRateLimitStore();
  delete store[action];
  saveRateLimitStore(store);
}

// Get daily credits remaining (based on all generation actions)
export function getDailyCreditsRemaining(isPremium: boolean = false): number {
  const actions: RateLimitAction[] = ['document_generation', 'presentation_generation', 'spreadsheet_generation', 'story_generation'];
  const baseLimit = isPremium ? 100 : 5;
  
  let totalUsed = 0;
  for (const action of actions) {
    const limits = isPremium ? PREMIUM_RATE_LIMITS[action] : RATE_LIMITS[action];
    const remaining = getRemainingRequests(action, isPremium);
    totalUsed += (limits.maxRequests - remaining);
  }
  
  // Total daily credits = sum of all action limits (simplified to 25 for free, 999 for premium)
  const totalCredits = isPremium ? 999 : 25;
  return Math.max(0, totalCredits - totalUsed);
}
