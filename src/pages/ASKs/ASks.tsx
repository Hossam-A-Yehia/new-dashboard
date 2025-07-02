import { useCallback, useMemo, useEffect, useState } from 'react';
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
import { SERVICES_TYPE } from '@/constants/Constants';
import { ADMIN_TYPE } from '@/constants/Constants';
import { formatDate } from '@/utils/generalUtils';
import ASKsGlobalFilter from '@/components/molecules/GlobalFilters/AskFilter/AskFilter';
import Button from '@/components/atoms/Button/Button';
import { useFetchAsks } from '@/hooks/ask';

const ASKs = () => {
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
    navigate(`/asks?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/asks?${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);

  modifiedQueryParams.userId = userData?.business_user_detail?.id;
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/asks?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);

  const { data, isLoading } = useFetchAsks({ ...modifiedQueryParams, isEnabled: true });

  const asks = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const columns = [
    {
      header: t('asks.username'),
      cell: (_: any, row: any) => (
        <Link to={`/user?id=${row.user.id}`} className="text-muted d-inline-block">
          {row.user?.username || t('Deleted User')}
        </Link>
      ),
      accessor: 'user.username',
    },
    {
      header: t('asks.serviceType'),
      accessor: 'service_type',
      cell: (_: any, row: any) => {
        const typeValue = row.service.service_type;
        const typeLabel =
          SERVICES_TYPE.find((item) => item.value === typeValue)?.label || typeValue;
        return <span>{typeLabel}</span>;
      },
      filterable: true,
    },
    {
      header: t('asks.creation_date'),
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
      header: t('asks.service'),
      accessor: `service.name_${lang}`,
      cell: (_: any, row: any) => row.service[`name_${lang}`] ?? row.service.name_en,
      filterable: true,
    },
    {
      header: t('asks.category'),
      accessor: `service.category.name_${lang}`,
      filterable: true,
    },
    {
      header: t('asks.action'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ul className="flex items-center gap-2">
          <li className="list-inline-item" title="Images">
            <Link to={`/rfp-details/${row.id}`}>
              <Button variant="outlinePrimary">{t('rfqs.view_details')}</Button>
            </Link>
          </li>
          <li className="list-inline-item" title="Images">
            <Link to={`/ask/${row.id}/replies`}>
              <Button variant="outlineMain">{t('Replies')}</Button>
            </Link>
          </li>
          <li className="list-inline-item" title="Images">
            <Link to={`/rfp-details/${row.id}`}>
              <Button variant="outlineSuccess">{t('Discussions')}</Button>
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
          <CustomBreadcrumbs items={[{ label: t('asks.ASKs') }]} />
        </Box>

        <ASKsGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={t('asks.filter.searchMessage')}
          isNotAdmin={isNotAdmin}
        />

        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={asks}
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

export default ASKs;
