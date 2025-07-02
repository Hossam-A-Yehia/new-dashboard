import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { t } from "i18next";
import { GetQuotationsParams, QuotationsType } from "@/types/RFQs";

import {
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";
import { CheckCheck } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { CustomBreadcrumbs } from "../Breadcrumbs/CustomBreadcrumbs";
import ReplyDetails from "../ReplyDetails/ReplyDetails";
import { useFetchReplies } from "@/hooks/ask";
import ReplyCard from "@/components/molecules/ReplyCard/ReplyCard";

function RepliesForAsk() {
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState<QuotationsType | null>(null);

  const handleSetQuotationDetails = (data: QuotationsType) => {
    setQuotationDetails(data);
  };

  const { userData } = useUser();

  const params: GetQuotationsParams = {
    discussionable_id: id || "",
    user_id: userData?.id || "",
  };

  const { data: Quotations = [], isLoading } = useFetchReplies(params);


  const toggle = useCallback(() => {
    setModal((prev) => !prev);
  }, []);

  const rfqStatus = Quotations[0]?.discussionable?.status;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box mb={3}>
          <CustomBreadcrumbs items={[
            { label: t('Asks') },
            { label: t('Replies') }
          ]} />
        </Box>

        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 4,
            pb: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="600"
            sx={{ mb: 1 }}
          >
            {t("Replies")}
          </Typography>
        </Box>

        {rfqStatus === 3 && (
          <Alert
            icon={<CheckCheck className="stroke-blue-500" />}
            severity="info"
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {t("The request is complete, and you cannot accept or decline it anymore.")}
          </Alert>
        )}

        {(isLoading) ? (
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {Quotations.length === 0 ? (
              <Box 
                sx={{ 
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  py: 8,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {t("No quotations received yet")}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {t("Check back later for updates")}
                </Typography>
              </Box>
            ) : (
              Quotations.map((quote: QuotationsType) => (
                <Box key={quote.id}>
                  <ReplyCard
                    setQuotationDetails={handleSetQuotationDetails as any}
                    setModal={setModal}
                    data={quote as any}
                  />
                </Box>
              ))
            )}
          </Box>
        )}
      </Paper>

      <Dialog 
        open={modal} 
        onClose={toggle} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {quotationDetails && (
            <ReplyDetails
              quotationDetails={quotationDetails as any}
              toggle={toggle}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default RepliesForAsk;
