import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { t } from "i18next";
import { FiCheckCircle as CheckCircle, FiXCircle as XCircle, FiPackage, FiShoppingBag } from "react-icons/fi";
import { TableContainer } from "@/components/molecules/Table";
import { ORDER_STATUS } from "@/constants/Constants";
import { Box, Container, CardContent, Typography } from "@mui/material";
// Import styles from the styles file
import {
  StyledCard,
  ProductImageContainer,
  ProductStatusBadge,
  PriceDisplay,
} from "../Stylings/OrderProductsTable.styles";
import ErrorState from "@/components/atoms/ErrorState/ErrorState";
import LoadingState from "@/components/atoms/LoadingState/LoadingState";


interface OrderProductsTableProps {
  productsDetails: Array<any>;
  isNotAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  isMyOrder: boolean;
  orderStatus: number;
  orderId: string | number;
}

const OrderProductsTable: React.FC<OrderProductsTableProps> = ({
  productsDetails,
  isNotAdmin,
  isLoading,
  isError,
  isMyOrder,
  orderStatus: currentOrderStatus,
  orderId
}) => {
  const [lang] = useState(() => localStorage.getItem("I18N_LANGUAGE"));
  const [checkedState, setCheckedState] = useState({
    checkedAll: false,
    checkedItems: {},
  });

  interface CheckedItems {
    [orderProductId: string]: boolean;
  }

  interface CheckedState {
    checkedAll: boolean;
    checkedItems: CheckedItems;
  }

  const handleCheck = useCallback(
    (id: string | number) => {
      setCheckedState((prev: CheckedState) => {
        const newCheckedItems: CheckedItems = {
          ...prev.checkedItems,
          [id]: !prev.checkedItems[id],
        };
        const allChecked = productsDetails?.every(
          (item: { order_product_id: string | number }) => newCheckedItems[item.order_product_id]
        );
        return { checkedAll: allChecked, checkedItems: newCheckedItems };
      });
    },
    [productsDetails]
  );

  interface HandleCheckAll {
    (checkAllNewState: boolean): void;
  }

  interface ProductDetail {
    order_product_id: string | number;
    [key: string]: any;
  }

  const handleCheckAll: HandleCheckAll = useCallback(
    (checkAllNewState: boolean) => {
      setCheckedState(() => {
        const newCheckedItems: CheckedItems = {};
        (productsDetails as ProductDetail[])?.forEach((item: ProductDetail) => {
          newCheckedItems[item.order_product_id] = checkAllNewState;
        });
        return { checkedAll: checkAllNewState, checkedItems: newCheckedItems };
      });
    },
    [productsDetails]
  );

  // Memoize the checked handlers to avoid creating new functions on every render
  const memoizedHandlers = useMemo(() => {
    return {
      handleCheck,
      handleCheckAll,
    };
  }, [handleCheck, handleCheckAll]);

  useEffect(() => {
    memoizedHandlers.handleCheckAll(true);
  }, [productsDetails, memoizedHandlers]);

  interface OrderStatus {
    label: string;
    value: number;
  }

  const getStatusValue = (label: string): number | null => {
    const status: OrderStatus | undefined = ORDER_STATUS.find((status: OrderStatus) => status.label === label);
    return status ? status.value : null;
  };

  const pendingStatus = getStatusValue(t("Pending"));
  const partiallyAcceptedStatus = getStatusValue(t("Partialy accepted"));
  const rejectedStatus = getStatusValue(t("Declined"));
  const completedStatus = getStatusValue(t("Completed"));


  const showCheckboxColumn =
    isNotAdmin && !isMyOrder && currentOrderStatus === pendingStatus;

  const columns = useMemo(() => {
    interface Product {
      product_status: number;
      variant_images: Array<{ url: string }>;
      [key: string]: any;
    }

    interface Row {
      original: Product;
    }

    const renderProductDetailsCell = (row: Row): JSX.Element => {
      const product = row.original;
      const isSelected = product.product_status === 2;
      const isNotSelected = product.product_status === 1;
      const isOrderConditionMet =
        currentOrderStatus === partiallyAcceptedStatus ||
        currentOrderStatus === completedStatus;

      const isNotSelectedCondition = isNotSelected && isOrderConditionMet;
      const isSelectedCondition = isSelected && isOrderConditionMet;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <ProductImageContainer>
            {product.variant_images[0]?.url ? (
              <img
                src={product.variant_images[0]?.url}
                alt={product[`title_${lang}`]}
                loading="lazy"
              />
            ) : (
              <FiPackage size={32} color="#8e9aaf" />
            )}
          </ProductImageContainer>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#2c3e50',
                mb: 1,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {product[`title_${lang}`] || product[`title_en`]}
            </Typography>

            {(isNotSelectedCondition || isSelectedCondition) && (
              <ProductStatusBadge isSelected={isSelectedCondition}>
                {isSelectedCondition ? (
                  <>
                    <CheckCircle size={14} />
                    {t("SELECTED")}
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    {t("NOT_SELECTED")}
                  </>
                )}
              </ProductStatusBadge>
            )}
          </Box>
        </Box>
      );
    };

    interface RenderPriceCellRow {
      original: Product;
    }

    const renderPriceCell = (row: RenderPriceCellRow): JSX.Element => {
      const product = row.original;
      return <PriceDisplay>${(product.price * product.quantity).toFixed(2)}</PriceDisplay>;
    };

    return [
      {
        header: t("Product details"),
        accessor: "product_status",
        cell: (_: any, row: any) => renderProductDetailsCell({ original: row }),
      },
      {
        header: t("Item price"),
        accessor: "price",
        cell: (_: any, row: any) => {
          const price = row.price;
          return <PriceDisplay>${price.toFixed(2)}</PriceDisplay>;
        }
      },
      {
        header: t("Quantity"),
        accessor: "quantity",
        cell: (_: any, row: any) => (
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: '#f8f9fa',
            padding: '6px 12px',
            borderRadius: '8px',
            fontWeight: 600,
            color: '#495057'
          }}>
            <FiShoppingBag size={16} />
            {row.quantity}
          </Box>
        ),
      },
      {
        header: t("Total"),
        accessor: "total",
        cell: (_: any, row: any) => renderPriceCell({ original: row }),
      },
    ].filter(Boolean);
  }, [
    showCheckboxColumn,
    checkedState.checkedItems,
    checkedState.checkedAll,
    lang,
    isMyOrder,
    completedStatus,
    currentOrderStatus,
    handleCheck,
    handleCheckAll,
    partiallyAcceptedStatus,
  ]);

  const statusLabel = ORDER_STATUS.find(
    (status) => status.value === currentOrderStatus
  )?.label;


  return (
    <Container className="shadow-sm rounded border-light">
      <StyledCard>
        <Box className="bg-light border-bottom p-4">
          <div className="d-flex align-items-center">
            <h5 className="card-title flex-grow-1 mb-0 fw-bold p-2">
              {t(`Order no [${orderId}] status`)}
              {statusLabel && (
                <span
                  className={`ms-2 fs-6 fw-bold ${currentOrderStatus === pendingStatus
                    ? "text-warning"
                    : currentOrderStatus === rejectedStatus
                      ? "text-danger"
                      : "text-success"
                    }`}
                >
                  ({t(statusLabel)})
                </span>
              )}
            </h5>
          </div>
        </Box>
        <span className="text-muted fs-6 fw-bold p-4 ">
          {t("No of Products")} ({productsDetails?.length || 0})
        </span>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState />
          ) : (
            <Box sx={{ p: 3 }}>
              <TableContainer
                columns={columns}
                data={productsDetails || []}
                customPageSize={4}
                pageIndex={1}
                totalPages={1}
                className="custom-header-css"
              />
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </Container>
  );
};
export default OrderProductsTable;