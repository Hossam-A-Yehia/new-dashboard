import { useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { CustomBreadcrumbs } from "@/components/organisms/Breadcrumbs/CustomBreadcrumbs";
import { useTranslation } from "react-i18next";
import {
  useFetchClientOrderDetails,
  useFetchSupplierOrderDetails,
} from "@/hooks/useOrders";
import { ADMIN_TYPE } from "@/constants/Constants";
import { ContactDetails } from "./Components/ContactDetails";
import OrderProductsTable from "./Components/OrderProductsTable";
import { AddressDetails } from "./Components/AddressDetails";
import { OrderSummary } from "./Components/OrderSummary";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface OrdersProps {
  isMyOrder?: boolean;
}

const OrderDetails: React.FC<OrdersProps> = ({ isMyOrder }) => {
  const { userData } = useUser();
  const { id: orderId } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const fetchHook = isMyOrder
    ? useFetchClientOrderDetails
    : useFetchSupplierOrderDetails;
  const { data, isLoading, isError } = fetchHook(orderId as string);
  const orderDetails = data?.data?.payload || {};
  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);

  const getContactDetails = () => {
    if (!isNotAdmin) {
      return (
        <Stack spacing={2}>
          <ContactDetails
            name={
              orderDetails?.supplier?.username ||
              orderDetails?.supplier?.business_name
            }
            email={
              orderDetails?.supplier?.email ||
              orderDetails?.supplier?.business_email
            }
            phone={orderDetails?.supplier?.phone}
            title={t("Supplier")}
          />
          <ContactDetails
            name={orderDetails?.client?.username}
            email={orderDetails?.client?.email}
            phone={orderDetails?.client?.phone}
            title={t("Customer")}
          />
        </Stack>
      );
    }

    const contact = isMyOrder ? orderDetails?.supplier : orderDetails?.client;
    const title = isMyOrder ? t("Supplier") : t("Customer");

    return (
      <ContactDetails
        name={contact?.username}
        email={contact?.email}
        phone={contact?.phone}
        title={title}
      />
    );
  };

  const address = {
    street: orderDetails?.delivery_address?.street_address,
    city: orderDetails?.delivery_address?.city?.[`name_${lang}`],
    zip: orderDetails?.delivery_address?.post_code,
    country: orderDetails?.delivery_address?.country?.[`name_${lang}`],
  };

  if (!orderDetails && !isLoading) {
    return (
      <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: "#f3f3f9", minHeight: "100vh" }}>
        <CustomBreadcrumbs items={[{ label: t("Order Details") }]} />
        <Typography variant="h6" color="error" mt={4}>
          {t("Order Details Not Found")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: "#f3f3f9", minHeight: "100vh" }}>
      <CustomBreadcrumbs
        items={[
          { label: isMyOrder ? t("My orders") : t("Incoming orders") },
          { label: t("Order Details") },
        ]}
      />

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
          }}
        >
        
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ borderRadius: 3, p: 2 }}>
              <OrderProductsTable
                productsDetails={orderDetails?.products}
                isNotAdmin={isNotAdmin}
                isLoading={isLoading}
                isError={isError}
                isMyOrder={!!isMyOrder}
                orderStatus={orderDetails?.order?.status}
                orderId={orderDetails?.order?.id}
              />
            </Paper>
          </Box>

         
          <Box
            sx={{
              width: { xs: "100%", lg: 340 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <OrderSummary order={orderDetails?.order} />
            {getContactDetails()}
            <AddressDetails
              name={
                isMyOrder
                  ? orderDetails?.supplier?.username
                  : orderDetails?.client?.username
              }
              phone={
                isMyOrder
                  ? orderDetails?.supplier?.phone
                  : orderDetails?.client?.phone
              }
              address={address}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderDetails;
