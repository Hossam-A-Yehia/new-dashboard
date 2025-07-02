import { useQuery } from '@tanstack/react-query';
import { getClientOrderDtailsAPI, getMyOrderListAPI, getOrderListAPI, getSupplierOrderDtailsAPI } from '@/services/MyOrderList';

export interface GetMyOrderListParams {
  isEnabled?: boolean;
  [key: string]: any;
}

export function useFetchMyOrderList(params: GetMyOrderListParams ) {
  return useQuery({
    queryKey: ['myOrderList', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getMyOrderListAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}



export function useFetchOrderList(params: GetMyOrderListParams ) {
  return useQuery({
    queryKey: ['orderList', ...Object.entries(params)],
    queryFn: () => {
      // Exclude isEnabled from params before passing to API
      const { isEnabled, ...filteredParams } = params;
      return getOrderListAPI(filteredParams);
    },
    enabled: params.isEnabled,
  });
}

export interface UseFetchSupplierOrderDetailsParams {
  orderId: string | number;
}

export function useFetchSupplierOrderDetails(orderId: UseFetchSupplierOrderDetailsParams['orderId']) {
  return useQuery({
    queryKey: ['supplierOrderDetails', orderId],
    queryFn: () => getSupplierOrderDtailsAPI(String(orderId)),
    enabled: !!orderId,
  });
}


export interface UseFetchClientOrderDetailsParams {
  orderId: string | number;
}

export function useFetchClientOrderDetails(orderId: UseFetchClientOrderDetailsParams['orderId']) {
  return useQuery({
    queryKey: ['clientOrderDetails', orderId],
    queryFn: () => getClientOrderDtailsAPI(String(orderId)),
    enabled: !!orderId,
  });
}

