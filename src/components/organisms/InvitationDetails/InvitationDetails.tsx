import  { FC, useCallback, useState } from "react";
import Typography from "@mui/material/Typography";
import { useLanguage } from "@/hooks/useLanguage";
import { findLabelByValue, formatDate } from "@/utils/generalUtils";
import { t } from "i18next";
import Button from "@/components/atoms/Button/Button";
import { Box, Stack } from "@mui/material";
import { BUSINESS_USER_INVITATIONS_STATUS } from "@/constants/Constants";
import ReplyInvitationModal from "../ReplyInvitationModal/ReplyInvitationModal";
import { useMutateDeclineQuotation } from "@/hooks/rfqs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface InvitationDetailsProps {
  invitation: any;
}

const statusLabels: Record<string, { color: string }> = {
  PENDING: { color: "#f3f4f6" },
  IN_PROGRESS: { color: "#ffedd5" },
  COMPLETED: { color: "#dcfce7" },
  DECLINE: { color: "#fee2e2" },
  ACCEPTED_FOR_ANOTHER_USER: { color: "#dbeafe" },
};

const InvitationDetails: FC<InvitationDetailsProps> = ({ invitation }) => {
    const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formattedDate, formattedTime } = formatDate(invitation.created_at);
  const lang = useLanguage();
  const rfqStatus = invitation.invitable?.status;
  const notifiableUsers = invitation.invitable?.notifiable_users;
  const userStatus = notifiableUsers?.find(
    (user: { user_id: string }) => user.user_id === String(invitation?.user_id)
  )?.status;

  const isButtonDisabled = [3, 2, 4, 5].includes(userStatus) || rfqStatus === 3 || rfqStatus === 2;
  const { mutateAsync: mutateDecline } = useMutateDeclineQuotation();

    const handleDecline = async (userId: number) => {
    const structuredData = {
      rfp_id: invitation.invitable_id,
      user_id: userId,
    };
    try {
      await mutateDecline(structuredData);
      queryClient.invalidateQueries({ queryKey: ["RFPs"] });
      toast.info(t("invitation_details.decline_messgae"));
    } catch (err: any) {
      toast.error(err.response.data.message);
      return err;
    }
  };

  const toggleReplyModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);
  return (
    <Box sx={{ bgcolor: 'white', boxShadow: 2, borderRadius: 2, p: 4, position: 'relative' }} >
      <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
        <Box
          sx={{
            px: 2, py: 1, borderRadius: 999, fontSize: 14, fontWeight: 500,
            bgcolor: statusLabels[userStatus]?.color || '#f3f4f6', color: '#333',
          }}
        >
          {findLabelByValue(userStatus, BUSINESS_USER_INVITATIONS_STATUS)}
        </Box>
      </Box>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box>
            <Typography fontWeight={600}>{t("rfq_details.subject")}</Typography>
            <Typography>{invitation.invitable?.subject}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box>
            <Typography fontWeight={600}>{t("rfq_details.description")}</Typography>
            <Typography>{invitation.invitable?.description}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box>
            <Typography fontWeight={600}>{t("rfq_details.service")}</Typography>
            <Typography>{invitation.invitable?.service?.[`name_${lang}`] || invitation.invitable?.service?.name_en}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box>
            <Typography fontWeight={600}>{t("rfq_details.created_at")}</Typography>
            <Typography>{formattedDate} <sup>{formattedTime}</sup></Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box>
            <Typography fontWeight={600}>{t("rfq_details.files")}</Typography>
            {invitation.invitable?.files && invitation.invitable?.files.length > 0 ? (
              <Stack spacing={1}>
                {invitation.invitable?.files.map((file: any) => (
                  <Typography key={file.id}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline' }}
                    >
                      {file.type} - {file.id}
                    </a>
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography>{t("rfq_details.no_files_available")}</Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <Button variant="outlineMain" dataTestid="discuss">
              {t("quotation_details.discuss")}
            </Button>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <Button
              disabled={isButtonDisabled}
              variant="main"
              dataTestid="reply-button"
              onClick={toggleReplyModal}
            >
              {t("invitation_details.reply")}
            </Button>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <Button
              disabled={isButtonDisabled}
              variant="outlineMain"
              onClick={() => handleDecline(invitation.invitable.user.id)}
              dataTestid="decline-button"
            >
              {t("rfq_details.decline_btn")}
            </Button>
          </Box>
        </Stack>
      </Stack>
      <ReplyInvitationModal
        invitableId={invitation.invitable_id}
        isOpen={isModalOpen}
        onCancel={toggleReplyModal}
      />
    </Box>
  );
};

export default InvitationDetails; 