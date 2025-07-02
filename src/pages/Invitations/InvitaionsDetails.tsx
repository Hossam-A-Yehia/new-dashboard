import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { useTranslation } from 'react-i18next';
import { useFetchInvitations } from '@/hooks/invitation';
import './invitationDetails.css';
import InvitationDetails from '@/components/organisms/InvitationDetails/InvitationDetails';
import Loader from '@/components/atoms/Loader/Loader';

const InvitationsDetails = () => {
  const queryParams = useQuery();
  const { id: discussionable_id } = useParams();
  const { t } = useTranslation();
  queryParams.id = discussionable_id ?? '';
  const { data, isLoading } = useFetchInvitations({ ...queryParams, isEnabled: true });

  const allInvitations = useMemo(() => data?.data?.payload?.data ?? [], [data]);

  const selectedInvitation = allInvitations[0];
  if (isLoading) {
    return (
      <div >
        <Loader />
      </div>
    );
  }

  return (
    <>
      <CustomBreadcrumbs
        items={[
          { label: t('invitation_details.invitationList') },
          { label: t('invitation_details.invitationDetails') },
        ]}
      />
      {selectedInvitation && (
        <div className="mt-8">
          <InvitationDetails invitation={selectedInvitation} />
        </div>
      )}
    </>
  );
};

export default InvitationsDetails;
