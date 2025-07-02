// OrderProductsTable.styles.ts

import { Box, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCard = styled(Card)(() => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
}));

export const ProductImageContainer = styled(Box)({
  width: "80px",
  height: "80px",
  borderRadius: "12px",
  overflow: "hidden",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export const ProductStatusBadge = styled(Box)<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    ...(isSelected
      ? {
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
        }
      : {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
        }),
  })
);

export const PriceDisplay = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#2c3e50",
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
});
