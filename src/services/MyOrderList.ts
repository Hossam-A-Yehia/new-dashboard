import apiClient from "@/config/apiClient";
import ordersEndpoints from "@/config/endpoints/ordersEndpoints";

interface OrderQueryParams {
  page?: number;
  orderStatus?: string | number;
  deliveryStatus?: string | number;
  orderId?: string | number;
  client_name?: string | number;
  supplier_name?: string | number;
}
interface DeliveryStatusPayload {
  orderId: string;
  structuredData: Record<string, any>; 
}

const buildQueryString = (params: OrderQueryParams): string => {
  const { page = 1, orderStatus, deliveryStatus, orderId, client_name, supplier_name } = params;

  let queryParams = [`page=${page}`];
  if (orderId) queryParams.push(`filters[id][$contains]=${orderId}`);
  if (client_name) queryParams.push(`filters[id][$eq]=${client_name}`);
  if (supplier_name) queryParams.push(`filters[id][$eq]=${supplier_name}`);
  if (orderStatus) queryParams.push(`filters[status][$eq]=${orderStatus}`);
  if (deliveryStatus)
    queryParams.push(`filters[deliveryStatus][$eq]=${deliveryStatus}`);

  return queryParams.join("&");
};

export const getMyOrderListAPI = (params: OrderQueryParams) => {
  const queryString = buildQueryString(params);
  return apiClient.get(`${ordersEndpoints.orders}?${queryString}`, { headers: { paginate: true } });
};

export const getOrderListAPI = (params: OrderQueryParams) => {
  const queryString = buildQueryString(params);
  return apiClient.get(`${ordersEndpoints.incomingOrders}?${queryString}`, { headers: { paginate: true } });
};

export const getSupplierOrderDtailsAPI = (orderId: string) => {
  return apiClient.get(`${ordersEndpoints.orderForSupplier}/${orderId}/details`);
};

export const getClientOrderDtailsAPI = (orderId: string) => {
  return apiClient.get(`${ordersEndpoints.orderForCustomer}/${orderId}/details`);
};

export const mutateAcceptOrder = (data: Record<string, any>, orderId: string) => {
  return apiClient.put(
    `${ordersEndpoints.completeTheOrder}/${orderId}${!data.items ? "/total-accept" : "/partial-accept"}`,
    data
  );
};

export const mutateDeclineOrder = (orderId: string) => {
  return apiClient.put(`${ordersEndpoints.completeTheOrder}/${orderId}/decline`);
};

export const mutateClientAcceptOrder = (orderId: string) => {
  return apiClient.put(`${ordersEndpoints.completeTheOrder}/${orderId}/complete`);
};

export const mutateDeliveryStatus = ({ orderId, structuredData }: DeliveryStatusPayload) => {
  return apiClient.put(`${ordersEndpoints.completeTheOrder}/${orderId}/update-delivery-status`, structuredData);
};

