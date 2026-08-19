import type { CatalogProduct, ProductDetails } from '../types';

export type PortalAccountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Disabled';

interface TaskResponse<T> {
  data: T;
  success: boolean;
  errorCode?: string;
  errorMessage?: { message?: string } | string;
}

interface HttpErrorResponse {
  message?: { message?: string } | string;
  errorMessage?: { message?: string } | string;
  title?: string;
  errors?: Record<string, string[]>;
}

export interface RegisterPortalAccountRequest {
  userName: string;
  password: string;
  email: string;
  phone?: string;
  registeredBusinessName: string;
  registeredContactName: string;
  notes?: string;
}

export interface PortalAccountLoginResult {
  accountStatus: PortalAccountStatus;
  token: string;
}

export interface PortalAccountStatusResult {
  accountStatus: PortalAccountStatus;
  updatedAt: string;
  rejectionReason?: string;
}

const API_BASE_URL = (import.meta.env.VITE_PORTAL_API_BASE_URL || 'http://localhost:5020')
  .replace(/\/$/, '');

function messageText(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'message' in value) {
    const message = (value as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

function validationMessage(errors?: Record<string, string[]>): string | undefined {
  if (!errors) return undefined;
  const firstMessages = Object.values(errors).flat();
  return firstMessages.find((item) => typeof item === 'string');
}

export class PortalApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PortalApiError';
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new PortalApiError(
      'Unable to connect to the Jadcup account service. Please try again shortly.',
      0,
    );
  }

  const body = await response.json().catch(() => undefined) as
    | TaskResponse<T>
    | HttpErrorResponse
    | undefined;

  if (!response.ok) {
    const errorBody = body as HttpErrorResponse | undefined;
    throw new PortalApiError(
      messageText(errorBody?.message)
        || messageText(errorBody?.errorMessage)
        || validationMessage(errorBody?.errors)
        || errorBody?.title
        || 'Unable to process your request. Please try again.',
      response.status,
    );
  }

  const taskResponse = body as TaskResponse<T> | undefined;
  if (!taskResponse || taskResponse.success === false) {
    throw new PortalApiError(
      messageText(taskResponse?.errorMessage) || 'The account service returned an invalid response.',
      response.status,
    );
  }

  return taskResponse.data;
}

export const portalAccountApi = {
  register(requestBody: RegisterPortalAccountRequest) {
    return request<boolean>('/api/portal/account/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  login(userName: string, password: string) {
    return request<PortalAccountLoginResult>('/api/portal/account/login', {
      method: 'POST',
      body: JSON.stringify({ userName, password }),
    });
  },

  getStatus(token: string) {
    return request<PortalAccountStatusResult>(
      '/api/portal/account/status',
      { method: 'GET' },
      token,
    );
  },

  getCatalogProducts(token: string) {
    return request<CatalogProduct[]>(
      '/api/Catalog/GetAllCatalogProducts',
      { method: 'GET' },
      token,
    );
  },

  getProductDetails(baseProductId: number, token: string) {
    return request<ProductDetails>(
      `/api/portal/products/${baseProductId}`,
      { method: 'GET' },
      token,
    );
  },
};
