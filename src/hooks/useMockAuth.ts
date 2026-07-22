import { mockCustomer } from '../mocks/data';
import type { CustomerAccount } from '../types';

interface MockAuthState {
  isAuthenticated: boolean;
  customer: CustomerAccount;
}

/**
 * Development-only mock authentication.
 * Always returns authenticated state for prototype previewing.
 * No real security logic — will be replaced with JWT auth.
 */
export function useMockAuth(): MockAuthState {
  return {
    isAuthenticated: true,
    customer: mockCustomer,
  };
}
