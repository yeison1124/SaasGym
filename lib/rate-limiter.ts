/**
 * Rate Limiter en memoria para prevenir ataques de fuerza bruta (Brute Force / DDoS)
 * Implementa ventana deslizante por IP.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpiar registros vencidos cada 5 minutos para evitar fugas de memoria
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Número máximo de peticiones permitidas en la ventana
  windowMs?: number; // Duración de la ventana en milisegundos
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = options.limit || 15; // 15 intentos
  const windowMs = options.windowMs || 60 * 1000; // por minuto
  const now = Date.now();

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
