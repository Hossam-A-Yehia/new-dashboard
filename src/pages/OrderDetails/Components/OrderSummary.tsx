import CardContent from '@mui/material/CardContent';
import { Box, Typography, Divider } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { t } from "i18next";
import { DateChip, IconWrapper, PriceDisplay, StyledCard, StyledCardHeader, SummaryRow, TotalPriceDisplay, TotalRow } from '../Stylings/OrderSummary.styles';

interface OrderSummaryProps {
  order: {
    delivery_date?: string;
    total_price: number;
    shipping?: number;
  };
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <StyledCard>
      <StyledCardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <ReceiptIcon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {t("Order summary")}
            </Typography>
          </Box>
        }
      />

      <CardContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

          {/* Delivery Date */}
          {order?.delivery_date && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#718096',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {t("Delivery date")}
              </Typography>
              <DateChip
                icon={<CalendarTodayIcon />}
                label={formatDate(order.delivery_date)}
                variant="outlined"
              />
            </Box>
          )}

          {order?.delivery_date && <Divider sx={{ my: 2, opacity: 0.6 }} />}

          {/* Sub Total */}
          <SummaryRow>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconWrapper>
                <ReceiptIcon sx={{ fontSize: '20px', color: '#718096' }} />
              </IconWrapper>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: '#4a5568',
                  fontSize: '1rem'
                }}
              >
                {t("Sub Total")}
              </Typography>
            </Box>
            <PriceDisplay variant="body1" sx={{ fontSize: '1.1rem' }}>
              {formatPrice(order?.total_price)}
            </PriceDisplay>
          </SummaryRow>

          {/* Shipping Costs */}
          {order?.shipping && (
            <SummaryRow>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconWrapper>
                  <LocalShippingIcon sx={{ fontSize: '20px', color: '#718096' }} />
                </IconWrapper>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: '#4a5568',
                    fontSize: '1rem'
                  }}
                >
                  {t("Shipping costs")}
                </Typography>
              </Box>
              <PriceDisplay variant="body1" sx={{ fontSize: '1.1rem' }}>
                {formatPrice(order.shipping)}
              </PriceDisplay>
            </SummaryRow>
          )}

          <Divider sx={{ my: 1, opacity: 0.6 }} />

          {/* Total */}
          <TotalRow>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginRight: '12px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}>
                <AttachMoneyIcon sx={{ fontSize: '20px', color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#2d3748',
                  fontSize: '1.2rem',
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {t("Total")} {t("(USD)")}
              </Typography>
            </Box>
            <TotalPriceDisplay>
              {order?.shipping
                ? formatPrice(order.shipping + order.total_price)
                : formatPrice(order?.total_price)
              }
            </TotalPriceDisplay>
          </TotalRow>
        </Box>
      </CardContent>
    </StyledCard>
  );
};