// Sentraliserte query keys for hele prosjektet
export const QUERY_KEYS = {
  // Public display queries
  PUBLIC_ACTIVE_PRODUCTS: ['public-active-packing-products'] as const,
  PUBLIC_PACKING_DATA: ['public-packing-data-v3'] as const,
  PUBLIC_ACTIVE_DATE: ['public-active-packing-date'] as const,
  PUBLIC_DISPLAY_SETTINGS: ['public-display-settings'] as const,
  PUBLIC_CUSTOMER: ['public-customer'] as const,
  PUBLIC_PACKING_SESSION: ['public-packing-session'] as const,
  
  // Authenticated queries
  DISPLAY_SETTINGS: ['display-settings'] as const,
  PACKING_DATA: ['packing-data'] as const,
  CUSTOMERS: ['customers'] as const,
  ORDERS: ['orders'] as const,
} as const;

// Helper functions for building query keys
export const buildQueryKey = {
  publicActiveProducts: (bakeryId?: string, date?: string) => 
    [QUERY_KEYS.PUBLIC_ACTIVE_PRODUCTS[0], bakeryId, date] as const,
  publicPackingData: (customerId?: string, bakeryId?: string, date?: string, productIds?: string) =>
    [QUERY_KEYS.PUBLIC_PACKING_DATA[0], customerId, bakeryId, date, productIds] as const,
  publicActiveDate: (bakeryId?: string) =>
    [QUERY_KEYS.PUBLIC_ACTIVE_DATE[0], bakeryId] as const,
  publicDisplaySettings: (bakeryId?: string) =>
    [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], bakeryId] as const,
  publicCustomer: (displayUrl: string) =>
    [QUERY_KEYS.PUBLIC_CUSTOMER[0], displayUrl] as const,
};
