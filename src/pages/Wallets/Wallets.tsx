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
import WalletsGlobalFilter from '@/components/molecules/GlobalFilters/WalletsFileter/WalletsFilter';
import { useFetchWallets } from '@/hooks/useWallets';
import { ADMIN_TYPE } from '@/constants/Constants';


const Wallets = () => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const { userData } = useUser();
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null>(null);

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.user_id, userData?.user_type]);
  console.log(userData?.business_user_detail.user_id)

  const updateFilters = (filters: Record<string, string | null>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`/wallets?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(
    () => {
      if (modifiedQueryParams?.page === '0') {
        const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
        navigate(`/wallets?${updatedQueryParams}`, { replace: true });
      }
    }, [modifiedQueryParams, navigate]);
  // the business user id optained from user_id not the id according to the api
  // console.log("the passing id", userData?.business_user_detail?.id)
  // console.log("the passing user id",userData?.business_user_detail?.user_id)
  modifiedQueryParams.userId = userData?.business_user_detail?.user_id

  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/wallets?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);

  const { data, isLoading } = useFetchWallets({ ...modifiedQueryParams, isEnabled: true });

  const wallets = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const columns = useMemo(
    () =>
      [
        isNotAdmin
          ? null
          : {
              header: t('Username'),
              cell: (_: any, row: any) => (
                <Link to={`/user?id=${row.user.id}`} className="text-muted d-inline-block">
                  {row.user?.username || t('Deleted User')}
                </Link>
              ),
              accessor: 'user.username',
            },
        {
          header: t("wallets.current_balance"),
          accessor: "current_balance",
        },
        {
          header: t("wallets.total_earned"),
          accessor: "total_earned",
        },
      ].filter((col): col is NonNullable<typeof col> => col !== null),
    [t, isNotAdmin]
  )


  return (
    <div>

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[{ label: t('Wallets') }]} />
        </Box>



        <WalletsGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={t("wallets.search_placeholder")}
          isNotAdmin={isNotAdmin}

        />

        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={wallets}
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

export default Wallets;