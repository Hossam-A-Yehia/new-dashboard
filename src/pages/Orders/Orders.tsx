import { useCallback, useMemo, useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import { ADMIN_TYPE, DELIVERY_STATUS, ORDER_STATUS, SERVICEPROVIDER_TYPE, SUPPLIER_TYPE } from '@/constants/Constants';
import { useFetchMyOrderList, useFetchOrderList } from '@/hooks/useOrders';
import { formatDate } from '@/utils/generalUtils';
import { deliveryStatusClasses, getStatusLabelAndClass, orderStatusClasses } from './utils';
import Button from '@/components/atoms/Button/Button';
import MyOrderListGlobalFilter from '@/components/molecules/GlobalFilters/Orders/OrdersFilter';


interface OrdersProps {
  isMyOrder?: boolean;
}

const Orders: React.FC<OrdersProps> = ({ isMyOrder }) => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const { userData } = useUser();
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null>(null);

  const path = isMyOrder ? "/my-orders" : "/orders";
  const fetchHook = isMyOrder ? useFetchMyOrderList : useFetchOrderList;

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`${path}?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(
    () => {
      if (modifiedQueryParams?.page === '0') {
        const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
        navigate(`${path}?${updatedQueryParams}`, { replace: true });
      }
    }, [modifiedQueryParams, navigate, path]);

  if (isMyOrder) {
    modifiedQueryParams.userId = userData?.business_user_detail?.id;
  }
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`${path}?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);
  const isSupplier = SUPPLIER_TYPE.includes(userData?.user_type);
  const isServiceProvider = SERVICEPROVIDER_TYPE.includes(userData?.user_type);

  const { data, isLoading } = fetchHook({ ...modifiedQueryParams });

  const orders = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const columns = [

    {
      header: t("Order Id"),
      accessor: "id",
      cell: (_: any, row: any) => {
        const value = row.id;
        return <span>{value}</span>;
      },
    },
    (!isMyOrder || !isNotAdmin) && {
      header: t("Client name"),
      accessor: "client_name",
      cell: (_: any, row: any) => {
        const clientName = row.client_name;
        if (!clientName) {
          return <small className="text-muted">{t("Deleted customer")}</small>;
        }
        return <span>{clientName}</span>;
      }
    },
    (isMyOrder || !isNotAdmin) && {
      header: t("Supplier name"),
      accessor: "supplier_name",
      cell: (_: any, row: any) => {
        const supplierName = row.supplier_name;
        if (!supplierName) {
          return <small className="text-muted">{t("Deleted supplier")}</small>;
        }
        return <span>{supplierName}</span>;
      }
    },
    {
      header: t("Creation date"),
      cell: (_: any, row: any) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at);
        return (
          <>
            {formattedDate}
            <small className="text-muted"> {formattedTime}</small>
          </>
        );
      },
      accessor: "created_at",
      filterable: true,
    },
    {
      header: t("Price"),
      accessor: "total_price",
      filterable: true,
    },
    {
      header: t("Order status"),
      accessor: "status",
      cell: (_: any, row: any) => {
        const { label, statusClass } = getStatusLabelAndClass(
          ORDER_STATUS,
          row.status,
          orderStatusClasses
        );
        return <span className={statusClass}>{label}</span>;
      },
      filterable: true,
    },

    {
      header: t("Delivery status (supplier)"),
      accessor: "deliveryStatus",
      cell: (_: any, row: any) => {
        const { label, statusClass } = getStatusLabelAndClass(
          DELIVERY_STATUS,
          row.supplier_delivery_status,
          deliveryStatusClasses
        );
        return <span className={statusClass}>{label}</span>;
      },
      filterable: true,
    },
    {
      header: t("Delivery status (client)"),
      accessor: "client_delivery_status",
      cell: (_: any, row: any) => {
        const { label, statusClass } = getStatusLabelAndClass(
          DELIVERY_STATUS,
          row.client_delivery_status,
          deliveryStatusClasses
        );
        return <span className={statusClass}>{label}</span>;
      },
      filterable: true,
    },
    {
      header: t('Action'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ul className="list-inline hstack gap-2 mb-0">
          <li className="list-inline-item" title="Images">
            <Link
              to={`${isMyOrder
                ? `/client-order/${row.id}`
                : `/supplier-order/${row.id}`
                }`}
            >
              <Button
                variant="primary"
              >
                {t("view details")}
              </Button>
            </Link>
          </li>
        </ul>
      ),
    },
  ]
    .filter((columns): columns is Exclude<typeof columns, false> => Boolean(columns));
  return (
    <div>

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[{ label: t('Orders') }]} />
        </Box>
        <MyOrderListGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={t("search orders")}
          isSupplier={isSupplier}
          isServiceProvider={isServiceProvider}
        />
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={orders}
              customPageSize={customPageSize}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              totalPages={lastPage}
            />
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Orders;