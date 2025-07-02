import { useCallback, useState, useMemo, useEffect } from 'react';
import { Container, Box, Avatar } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { ADMIN_TYPE } from '@/constants/Constants';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useFetchProjects, useMutateDeleteProject } from '@/hooks/Project';
import { toast } from 'react-toastify';
import { useLanguage } from '@/hooks/useLanguage';
import CustomBTN from '@/components/atoms/Button/Button';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import AddProjectModal from './AddProjectModal/AddProjectModal';
import ActionsMenu from './ActionsMenu ';
import CategoriesList from './CategoriesList';
import { FolderOpen } from 'lucide-react';
import ProjectGlobalFilter from '@/components/molecules/GlobalFilters/ProjectsFilter/ProjectsFilter';

const Projects = () => {
  const navigate = useNavigate();
  const queryParams = useQuery();
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const { t } = useTranslation();
  const lang = useLanguage();
  const [value, setValue] = useState<string | null>(null);

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`/projects?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/projects?${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);

  modifiedQueryParams.userId = userData?.business_user_detail?.id;
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/projects?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );

  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);
  const { data, isLoading } = useFetchProjects({ ...modifiedQueryParams, isEnabled: true });

  const projects = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const { mutateAsync: mutateDeleteProjectAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteProject();

  const handleDeleteProjects = async () => {
    try {
      await mutateDeleteProjectAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.info(t('common.success.project_deleted'));
    } catch (err) {
      toast.error((err as any)?.response?.data?.message || t('error_occurred'));
    } finally {
      setDeleteModal(false);
    }
  };

  const columns = [
    {
      accessor: 'url',
      header: t('common.project_form.images'),
      cell: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Avatar
            src={row.images[0]?.url}
            alt={t('common.project_form.images')}
            sx={{ width: 32, height: 32 }}
            variant="circular"
          />
          <button
            onClick={() => window.open(row.images[0]?.url, '_blank')}
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition"
          >
            <FolderOpen className="w-4 h-4 mr-1 text-gray-400" />
            {t('common.view')}
          </button>
        </div>
      ),
    },
    {
      accessor: `title_${lang}`,
      header: t('common.project_form.english_name'),
      cell: (_: any, row: any) => row[`title_${lang}`] ?? row.title_en,
    },
    {
      accessor: `city.name_en`,
      header: t('common.project_form.city'),
    },
    !isNotAdmin && {
      header: t('common.user'),
      cell: (_: any, row: any) => (
        <Link to={`/user-form?id=${row.business_user?.id}`} className="text-muted d-inline-block">
          {row.business_user?.user?.username || t('common.deleted_user')}
        </Link>
      ),
      accessor: 'business_user.user.username',
    },
    {
      header: t('common.categories.title'),
      accessor: 'categories',
      cell: (_: any, row: any) => <CategoriesList categories={row.categories || []} />,
    },
    {
      header: t('common.actions.view'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ActionsMenu
          row={row}
          setSelectedRow={setSelectedRow}
          setIsEdit={setIsEdit}
          setModal={setModal}
          setDeleteModal={setDeleteModal}
        />
      ),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteProjects}
        loading={isMutateDeleteLoading}
        message={t('common.confirmation.delete_project')}
      />

      <AddProjectModal
        setModal={setModal}
        toggle={modal}
        isEdit={isEdit}
        selectedRow={selectedRow}
      />

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[{ label: t('MenuItems.Projects') }]} />
        </Box>

        <div className="flex items-center justify-between w-fit mb-4">
          <CustomBTN
            variant="main"
            icon={<i className="ri-add-fill" />}
            onClick={() => {
              setIsEdit(false);
              setSelectedRow({});
              setModal(true);
            }}
          >
            {t('common.project.add_new')}
          </CustomBTN>
        </div>

        <ProjectGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={t('common.filter.search')}
          isNotAdmin={isNotAdmin}
        />

        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={projects}
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

export default Projects;