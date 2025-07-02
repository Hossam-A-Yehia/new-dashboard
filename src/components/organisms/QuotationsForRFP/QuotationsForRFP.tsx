import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useFetchQuotations,
  useMutateAcceptQuotation,
  useMutateDeclineQuotation,
} from "@/hooks/rfqs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
import QuotationCard from "@/components/molecules/QuotationCard/QuotationCard";
import QuotationDetails from "../QuotationDetails/QuotationDetails";

function QuotationsForRFP() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [quotationDetails, setQuotationDetails] = useState<QuotationsType | null>(null);

  const handleSetQuotationDetails = (data: QuotationsType) => {
    setQuotationDetails(data);
  };

  const { userData } = useUser();

  const params: GetQuotationsParams = {
    discussionable_id: id || "",
    user_id: userData?.id || "",
    discussionable_type: 1
  };

  const { data: Quotations = [], isLoading } = useFetchQuotations(params);

  const { mutateAsync: mutateAccept, isPending: isLoadingAccept } =
    useMutateAcceptQuotation();
  const { mutateAsync: mutateDecline, isPending: isLoadingDecline } =
    useMutateDeclineQuotation();

  const handleQuotationAction = async (
    user_id: number,
    action: (data: { rfp_id: number; user_id: number }) => Promise<any>,
    successMessage: string
  ) => {
    const structuredData = {
      rfp_id: Number(id),
      user_id,
    };
    try {
      await action(structuredData);
      queryClient.invalidateQueries({ queryKey: ["Quotations"] });
      toast.info(t(successMessage));
      setModal(false);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "quotations.errorMessage";
      toast.error(t(errorMessage));
      return err;
    }
  };

  const handleAcceptQuotation = (user_id: number) =>
    handleQuotationAction(user_id, mutateAccept, t("quotations.acceptedQoutation"));

  const handleDeclineQuotation = (user_id: number) =>
    handleQuotationAction(user_id, mutateDecline, t("quotations.declinedQoutation"));

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
            { label: t('quotations.rfqLabel') },
            { label: t('quotations.quotationList') }
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
            {t("quotations.recievedQuotations")}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            {t("quotations.reviewAndManageAllQuotationsMsg")}
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
            {t("quotations.requestCompletedMsg")}
          </Alert>
        )}

        {(isLoading || isLoadingAccept || isLoadingDecline) ? (
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
                  {t("quotations.noQuotationsRecievedMsg")}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {t("quotations.checkBackLaterForUpdateMsg")}
                </Typography>
              </Box>
            ) : (
              Quotations.map((quote: QuotationsType) => (
                <Box key={quote.id}>
                  <QuotationCard
                    requestId={Number(quote.id)}
                    setQuotationDetails={handleSetQuotationDetails as any}
                    setModal={setModal}
                    data={quote as any}
                    onAccept={handleAcceptQuotation}
                    onReject={handleDeclineQuotation}
                    isLoadingAccept={isLoadingAccept}
                    isLoadingDecline={isLoadingDecline}
                    isAsk={false}
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
            <QuotationDetails
              quotationDetails={quotationDetails as any}
              toggle={toggle}
              onAccept={handleAcceptQuotation}
              onReject={handleDeclineQuotation}
              isLoadingAccept={isLoadingAccept}
              isLoadingDecline={isLoadingDecline}
              isAsk={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default QuotationsForRFP;
