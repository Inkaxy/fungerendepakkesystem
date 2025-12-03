
export interface UploadStatus {
  products: 'idle' | 'uploading' | 'success' | 'error';
  customers: 'idle' | 'uploading' | 'success' | 'error';
  orders: 'idle' | 'uploading' | 'success' | 'error';
}

export interface IdMapping {
  [originalId: string]: string; // originalId -> databaseUUID
}

export interface UploadResults {
  products: any[];
  customers: any[];
  orders: any[];
}

// Handler types for file uploads
export type ProductUploadHandler = (file: File) => Promise<IdMapping>;
export type CustomerUploadHandler = (file: File) => Promise<IdMapping>;
export type OrderUploadHandler = (file: File, productMapping: IdMapping, customerMapping: IdMapping) => Promise<void>;
