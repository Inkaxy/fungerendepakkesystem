
import { Customer } from '@/types/database';

// Kort URL-format: /d/{displayUrl} for kunde, /s/{shortId} for delt

export const getDisplayPath = (customer: Customer, shortId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/d/${customer.display_url}`;
  }
  return shortId ? `/s/${shortId}` : '/s';
};

export const getSharedDisplayPath = (shortId: string): string => {
  return `/s/${shortId}`;
};

export const getInternalDisplayPath = (customer: Customer, shortId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/d/${customer.display_url}`;
  }
  return shortId ? `/s/${shortId}` : '/s';
};

export const getDisplayUrl = (customer: Customer, shortId?: string): string => {
  const path = getDisplayPath(customer, shortId);
  return `${window.location.origin}${path}`;
};

export const getSharedDisplayUrl = (shortId: string): string => {
  return `${window.location.origin}/s/${shortId}`;
};

export const generateQrCodeUrl = (url: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
};
