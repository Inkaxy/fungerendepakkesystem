
import { Customer } from '@/types/database';

export const getDisplayPath = (customer: Customer, bakeryId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/display/${customer.display_url}`;
  }
  return bakeryId ? `/display/shared/${bakeryId}` : '/display/shared';
};

export const getSharedDisplayPath = (bakeryId: string): string => {
  return `/display/shared/${bakeryId}`;
};

export const getInternalDisplayPath = (customer: Customer, bakeryId?: string): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/display/${customer.display_url}`;
  }
  return bakeryId ? `/display/shared/${bakeryId}` : '/display/shared';
};

export const getDisplayUrl = (customer: Customer, bakeryId?: string): string => {
  const path = getDisplayPath(customer, bakeryId);
  return `${window.location.origin}${path}`;
};

export const getSharedDisplayUrl = (bakeryId: string): string => {
  return `${window.location.origin}/display/shared/${bakeryId}`;
};

export const generateQrCodeUrl = (url: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
};
