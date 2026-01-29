
import { Customer } from '@/types/database';

// Kort URL-format: /d/{displayUrl} for kunde, /s/{shortId} for delt
// shortId er en 6-tegns identifikator (f.eks. "cf3819")

/**
 * Sjekker om en streng er en full UUID (36 tegn med bindestreker)
 */
export const isUUID = (str: string): boolean => {
  return str.length === 36 && str.includes('-');
};

/**
 * Genererer display-path for en kunde
 * Bruker kort short_id for felles display, eller display_url for dedikerte
 */
export const getDisplayPath = (customer: Customer, shortId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/d/${customer.display_url}`;
  }
  return shortId ? `/s/${shortId}` : '/s';
};

/**
 * Genererer path for felles display med short_id
 */
export const getSharedDisplayPath = (shortId: string): string => {
  return `/s/${shortId}`;
};

export const getInternalDisplayPath = (customer: Customer, shortId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/d/${customer.display_url}`;
  }
  return shortId ? `/s/${shortId}` : '/s';
};

/**
 * Genererer full URL for kunde-display
 */
export const getDisplayUrl = (customer: Customer, shortId?: string): string => {
  const path = getDisplayPath(customer, shortId);
  return `${window.location.origin}${path}`;
};

/**
 * Genererer full URL for felles display med short_id
 */
export const getSharedDisplayUrl = (shortId: string): string => {
  return `${window.location.origin}/s/${shortId}`;
};

/**
 * Genererer QR-kode URL via ekstern tjeneste
 */
export const generateQrCodeUrl = (url: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
};
