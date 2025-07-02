import { useCallback, useMemo, useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useTranslation } from 'react-i18next';
import { useFetchRfqs } from '@/hooks/rfqs';
import { useLanguage } from '@/hooks/useLanguage';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import { RFPStatus } from '@/constants/Constants';
import { ADMIN_TYPE } from '@/constants/Constants';
import { formatDate } from '@/utils/generalUtils';
import RFQsGlobalFilter from '@/components/molecules/GlobalFilters/RFQsFilter/RFQsFilter';
import Button from '@/components/atoms/Button/Button';
import { IoAdd } from 'react-icons/io5';

const RFQs = () => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const { userData } = useUser();
  const { t } = useTranslation();
  const lang = useLanguage();
  const [value, setValue] = useState<string | null>(null);

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`/rfqs?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/rfqs?${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);

  modifiedQueryParams.userId = userData?.business_user_detail?.id;
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/rfqs?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);

  const { data, isLoading } = useFetchRfqs({ ...modifiedQueryParams, isEnabled: true });

  const rfqs = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const columns = [
    {
      header: t('rfqs.username'),
      cell: (_: any, row: any) => (
        <Link to={`/user?id=${row.user.id}`} className="text-muted d-inline-block">
          {row.user?.username || t('Deleted User')}
        </Link>
      ),
      accessor: 'user.username',
    },
    {
      header: t('rfqs.subject'),
      accessor: 'subject',
      filterable: true,
    },
    {
      header: t('rfqs.creation_date'),
      cell: (_: any, row: any) => {
        const { formattedDate, formattedTime } = formatDate(row.created_at);
        return (
          <>
            {formattedDate}
            <small className="text-muted"> {formattedTime}</small>
          </>
        );
      },
      accessor: 'created_at',
      filterable: true,
    },
    {
      header: t('rfqs.services'),
      accessor: `service.name_${lang}`,
      cell: (_: any, row: any) => row.service[`name_${lang}`] ?? row.service.name_en,
      filterable: true,
    },
    {
      header: t('rfqs.category'),
      accessor: `service.category.name_${lang}`,
      filterable: true,
    },
    {
      header: t('rfqs.status'),
      accessor: 'account_status',
      cell: (_: any, row: any) => {
        const value = row.status;
        const label = RFPStatus.find((item) => item.value === value)?.label;
        return <span>{label}</span>;
      },
      filterable: true,
    },
    {
      header: t('rfqs.actions'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ul className="flex items-center gap-2">
          <li className="list-inline-item" title="Images">
            <Link to={`/rfp-details/${row.id}`}>
              <Button variant="outlinePrimary">{t('rfqs.view_details')}</Button>
            </Link>
          </li>
          <li className="list-inline-item" title="Images">
            <Link to={`/rfp/${row.id}/quotations`}>
              <Button variant="outlineMain">{t('rfqs.quotations')}</Button>
            </Link>
          </li>
          <li className="list-inline-item" title="Images">
            <Link to={`/rfp-details/${row.id}`}>
              <Button variant="outlineSuccess">{t('rfqs.discussions')}</Button>
            </Link>
          </li>
        </ul>
      ),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  return (
    <div>
      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[{ label: t('rfqs.rfqs') },
            { label: t('rfqs.rfqsList') }
          ]} />
          <div>
            <div className="w-fit mt-4">
              <Link to="/add-rfq">
                <Button variant="main" icon={<IoAdd />}>
                  {t('common.add_new')}
                </Button>
              </Link>
            </div>
          </div>
        </Box>
        <RFQsGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={t('rfqs.search_placeholder')}
          isNotAdmin={isNotAdmin}
        />
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={rfqs}
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

export default RFQs;
