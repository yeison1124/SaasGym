/**
 * GymPulse Security Utilities
 * Funciones de sanitización, validación server-side y protección de inputs.
 */

// 1. Sanitización básica anti-XSS para inputs de texto
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Elimina etiquetas HTML
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

// 2. Validación de Emails
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

// 3. Validación de Teléfonos (E.164 o local LATAM)
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim());
}

// 4. Validación de subida de archivos (MIME Types e Imágenes seguras)
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageUpload(file: File, maxSizeBytes: number = 5 * 1024 * 1024): FileValidationResult {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no permitido. Solo se aceptan imágenes JPG, PNG o WebP.',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo supera el tamaño máximo permitido (${Math.round(maxSizeBytes / (1024 * 1024))}MB).`,
    };
  }

  return { valid: true };
}
