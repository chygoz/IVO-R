export interface UserLoginData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  avatar: string;
  passwordDefault: boolean;
  business?: UserBusinessData;
}

export interface UserBusinessData {
  identifier: string;
  subdomain: string;
  name: string;
  signed: boolean;
  role: string;
}

export interface Metadata {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

declare global {
  interface Window {
    _productSyncInterval?: NodeJS.Timeout;
  }
}
