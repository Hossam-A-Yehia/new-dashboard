import { useCallback, useMemo, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import { InvitationStatusEnum } from '@/constants/Constants';
import { formatDate } from '@/utils/generalUtils';
import Button from '@/components/atoms/Button/Button';
import { useFetchInvitations } from '@/hooks/invitation';
import { getInvitationStatusLabel } from './helperFunctionStatus';


const Invitations = () => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const { userData } = useUser();
  const { t } = useTranslation();
  const lang = useLanguage();

  const modifiedQueryParams = useMemo(() => {
    
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);


  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(
    () => {
      if (modifiedQueryParams?.page === '0') {
        const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
        navigate(`/invitations?${updatedQueryParams}`, { replace: true });
      }
    }, [modifiedQueryParams, navigate]);

  modifiedQueryParams.userId = userData?.business_user_detail?.id
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/invitations?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );

  const { data, isLoading } = useFetchInvitations({ ...modifiedQueryParams, isEnabled: true });

  const invitations = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const columns = [
    {
      header: t("invitations.username"),
      accessor: "invitable.user.username",
      cell: (_: any, row: any) => (
        <Link
          to={`/user?id=${row.invitable.user.id}`}
          className="text-muted d-inline-block"
        >
          {row.invitable.user?.username || t("invitations.deletedUser")}
        </Link>
      ),
      filterable: true,
    },
    {
      header: t("invitations.subject"),
      accessor: "invitable.subject",
      cell: (_: any, row: any) => <span>{row.invitable.subject}</span>,
      filterable: true,
    },
    {
      header: t("invitations.receivedDate"),
      accessor: "created_at",
      cell: (_: any, row: any) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at);
        return (
          <>
            {formattedDate}
            <small className="text-muted"> {formattedTime}</small>
          </>
        );
      },
      filterable: true,
    },
    {
      header: t("invitations.services"),
      accessor: `invitable.service.name_${lang}`,
      cell: (_: any, row: any) =>
        row.invitable.service[`name_${lang}` as keyof typeof row.invitable.service] ??
        row.invitable.service.name_en,
      filterable: true,
    },
    {
      header: t("invitations.status"),
      accessor: "invitable.notifiable_users",
      cell: (_: any, row: any) => {
        const userStatus = row.invitable?.notifiable_users?.find(
          (user: any) => user.user_id === String(userData?.id)
        )?.status as InvitationStatusEnum;

        const label = getInvitationStatusLabel(userStatus);

        return <span>{label}</span>;
      },
      filterable: true,
    },
    {
      header: t("invitations.actions"),
      accessor: "_",
      cell: (_: any, row: any) => (
        <li className="list-inline-item" title="Details">
          <Link to={`/invitation-details/${row.invitable_id}`}>
            <Button variant="outlinePrimary">{t("invitations.viewDetails")}</Button>
          </Link>
        </li>
      ),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  return (
    <div>
      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[
            { label: t('invitations.invitations') },
            { label: t('invitations.invitationsList') }
          ]} />
        </Box>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={invitations}
              customPageSize={customPageSize}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              totalPages={lastPage}
            />
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Invitations;