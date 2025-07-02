import { INVITATION_STATUS_OPTIONS, InvitationStatusEnum } from "@/constants/Constants";
import { t } from "i18next";

// Showing the user invitaiton status in the table
export function getInvitationStatusLabel(status: InvitationStatusEnum): string {
  return (
    INVITATION_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? t("Unknown")
  );
}