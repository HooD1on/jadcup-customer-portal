import type { OrderDetail, OrderSummary } from '../types';
import { PortalApiError } from './portalAccountApi';

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

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface OrderItemStatus {
  itemId: string;
  productId: number;
  quantity: number;
  unitPrice: number | null;
  included: boolean;
  locked: boolean;
  status: 'ok' | 'quotation_expired' | 'inactive';
}

export interface ReorderResult {
  order: OrderDetail;
  items: OrderItemStatus[];
}

export interface UpdateOrderItemResult {
  item: OrderItemStatus;
  orderTotalPrice: number;
}

export interface UpdateUrgentFlagResult {
  isUrgent: boolean;
  custOrderNo: string | null;
  orderTotalPrice: number;
}

// success:false 这里不当异常处理——order_has_invalid_items 这种失败要把 invalidItems
// 具体是哪几行一起带回来,调用方需要同时看 success 和 data,不能只处理 catch 分支。
export interface SubmitOrderResult {
  orderId: string | null;
  status: string | null;
  invalidItems: OrderItemStatus[] | null;
}

export interface SubmitOrderResponse {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  data: SubmitOrderResult | null;
}

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
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

async function rawRequest(path: string, options: RequestInit, token: string): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new PortalApiError(
      'Unable to connect to the Jadcup order service. Please try again shortly.',
      0,
    );
  }
}

// 跟 portalAccountApi.ts 里的 request<T> 是同一套逻辑,这里单独复制一份而不是导出共用——
// 项目里没有跨 service 文件共享内部请求逻辑的先例,按现有惯例各 service 自己实现。
async function request<T>(path: string, options: RequestInit, token: string): Promise<T> {
  const response = await rawRequest(path, options, token);

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
      messageText(taskResponse?.errorMessage) || 'The order service returned an invalid response.',
      response.status,
    );
  }

  return taskResponse.data;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const ordersApi = {
  getOrders(params: OrderQueryParams, token: string) {
    const query = buildQueryString({
      page: params.page,
      pageSize: params.pageSize,
      keyword: params.keyword,
      status: params.status,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });
    return request<PagedResult<OrderSummary>>(`/api/orders${query}`, { method: 'GET' }, token);
  },

  getOrderDetail(orderId: string, token: string) {
    return request<OrderDetail>(`/api/orders/${orderId}`, { method: 'GET' }, token);
  },

  reorder(sourceOrderId: string, token: string) {
    return request<ReorderResult>('/api/orders/reorder', {
      method: 'POST',
      body: JSON.stringify({ sourceOrderId }),
    }, token);
  },

  updateOrderItem(
    orderId: string,
    itemId: string,
    changes: { quantity?: number; included?: boolean },
    token: string,
  ) {
    return request<UpdateOrderItemResult>(`/api/orders/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }, token);
  },

  updateUrgentFlag(orderId: string, changes: { isUrgent: boolean; custOrderNo?: string }, token: string) {
    return request<UpdateUrgentFlagResult>(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }, token);
  },

  // 不复用 request<T>——那个 helper 只要 success:false 就直接 throw,会把
  // order_has_invalid_items 情况下的 data.invalidItems 丢掉。这里把完整的
  // { success, data, errorCode, errorMessage } 原样返回给调用方自己判断。
  async submitOrder(orderId: string, token: string): Promise<SubmitOrderResponse> {
    const response = await rawRequest(`/api/orders/${orderId}/submit`, { method: 'POST' }, token);

    const body = await response.json().catch(() => undefined) as
      | TaskResponse<SubmitOrderResult>
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

    const taskResponse = body as TaskResponse<SubmitOrderResult> | undefined;
    return {
      success: taskResponse?.success ?? false,
      errorCode: taskResponse?.errorCode,
      errorMessage: messageText(taskResponse?.errorMessage),
      data: taskResponse?.data ?? null,
    };
  },
};
