import { useCallback, useMemo, useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import { formatDate } from '@/utils/generalUtils';
import { useFetchBasicUsers, useMutateForceDeleteBasicUser } from '@/hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import ActionsMenu from './ActionsMenu ';

const SubUsers = () => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const { t } = useTranslation();

  const [selectedRow, setSelectedRow] = useState<any>({});
  console.log(selectedRow.id)
  const [modal, setModal] = useState(false);
  const [forceDeleteModal, setForceDeleteModal] = useState(false);
  const { mutateAsync: mutateForceDeleteUserAsync, isPending: isMutateForceDeleteLoading,
  } = useMutateForceDeleteBasicUser();

  const handleDeleteProjects = async () => {
    try {
      await mutateForceDeleteUserAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['basicUsers'] });
      toast.info(t('employee Deleted Successfully!'));
    } catch (err) {
      toast.error((err as any)?.response?.data?.message || 'Error');
    } finally {
      setForceDeleteModal(false);
      setSelectedRow({});
    }
  };

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
        navigate(`/users?${updatedQueryParams}`, { replace: true });
      }
    }, [modifiedQueryParams, navigate]);

  modifiedQueryParams.createdBy = userData?.id
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/users?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  const { data, isLoading } = useFetchBasicUsers({ ...modifiedQueryParams, isEnabled: true });

  const SubUsers = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const missingStyle = useMemo(
    () => ({
      color: "red",
      fontWeight: "bold",
    }),
    []
  );

  const columns = [
    {
      header: t('Username'),
      cell: (_: any, row: any) => (
        <Link to={`/user/${row.creator?.id}`} className="text-muted d-inline-block">
          {row.username || t('Deleted User')}
        </Link>
      ),
      accessor: 'user.username',
    },
    {
      header: t("First Name"),
      cell: (_: any, row: any) => {
        return (
          <span
            style={
              row.first_name ? {} : missingStyle
            }
          >
            {row.first_name ?? "_"}
          </span>
        );
      },
      accessor: 'first_name',
      filterable: true,
    },
    {
      header: t("First Name"),
      cell: (_: any, row: any) => {
        return (
          <span
            style={
              row.last_name ? {} : missingStyle
            }
          >
            {row.last_name ?? "_"}
          </span>
        );
      },
      accessor: 'last_name',
      filterable: true,
    },
    {
      header: t("Email"),
      cell: (_: any, row: any) => {
        return (
          <span
            style={
              row.email ? {} : missingStyle
            }
          >
            {row.email ?? "_"}
          </span>
        );
      },
      accessor: 'email',
      filterable: true,
    },
    {
      header: t("Role"),
      cell: (_: any, row: any) => {
        return <span>{row.roles[0]?.name}</span>;
      },
      accessor: "roles",
      filterable: true,
    },
    {
      header: t("Created At"),
      cell: (_: any, row: any) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at);
        return (
          <>
            {formattedDate}
            <small className="text-muted"> {formattedTime}</small>
          </>
        );
      },
      accessor: "created_at",
      filterable: true,
    },
    {
      header: t("Action"),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ActionsMenu
          row={row}
          setSelectedRow={setSelectedRow}
          setModal={setModal}
          setDeleteModal={setForceDeleteModal}
        />
      ),
    },

  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  return (
    <div>

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[{ label: t('Sub Users') }]} />
        </Box>
        <div>
          <DeleteConfirmationModal
            open={forceDeleteModal}
            onClose={() => setForceDeleteModal(false)}
            onConfirm={handleDeleteProjects}
            loading={isMutateForceDeleteLoading}
            message={t('Are you sure you want to delete this product?')}
          />
        </div>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={SubUsers}
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

export default SubUsers;