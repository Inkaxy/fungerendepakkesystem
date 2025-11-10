
import { Customer } from '@/types/database';

export const getDisplayPath = (customer: Customer): string => {
  if (customer.has_dedicated_display && customer.display_url) {
    return `/display/${customer.display_url}`;
  }
  return '/dashboard/display/shared';
};

export const getDisplayUrl = (customer: Customer): string => {
  const path = getDisplayPath(customer);
  return `${window.location.origin}${path}`;
};

export const generateQrCodeUrl = (url: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
};
