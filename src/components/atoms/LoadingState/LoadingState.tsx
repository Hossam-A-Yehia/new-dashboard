import { Loader } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { t } from "i18next";



const LoadingState = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 8,
        flexDirection: 'column',
        gap: 2
    }}>
        <Loader />
        <Typography variant="body2" color="text.secondary">
            {t("Loading order details...")}
        </Typography>
    </Box>
);
export default LoadingState;