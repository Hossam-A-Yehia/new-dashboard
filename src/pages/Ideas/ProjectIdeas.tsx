import { useCallback, useState, useMemo, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { useUser } from '@/context/UserContext';
import { createQueryParams } from '@/helper/query_params_helper';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLanguage } from '@/hooks/useLanguage';
import CustomBTN from '@/components/atoms/Button/Button';
import Loader from '@/components/atoms/Loader/Loader';
import TableContainer from '@/components/molecules/Table/TableContainer';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import AddProjectModal from './AddIdeaModal/AddIdeaModal';
import ActionsMenu from './ActionsMenu ';
import { useFetchIdeas, useMutateDeleteIdea } from '@/hooks/useIdeas';
import IdeasGlobalFilter from '@/components/molecules/GlobalFilters/IdeasFilter/IdeasFilter';
import ImageModalWrapper from '@/components/molecules/Images/ImageModalWrapper';

const ProjectIdeas = () => {
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
  const { id: projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`/projects/${projectId}/ideas?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/projects/${projectId}/ideas?${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);

  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/projects/${projectId}/ideas?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );
  modifiedQueryParams.userId = userData?.id;
  if (projectId) {
    modifiedQueryParams.projectId = projectId;
  }

  const { data, isLoading } = useFetchIdeas({ ...modifiedQueryParams });

  const ideas = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const { mutateAsync: mutateDeleteIdeaAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteIdea();

  const handleDeleteProjects = async () => {
    try {
      await mutateDeleteIdeaAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.info(t('Idea Deleted Successfully!'));
    } catch (err) {
      toast.error((err as any)?.response?.data?.message || 'Error');
    } finally {
      setDeleteModal(false);
    }
  };
  const columns = [
    {
      accessor: `title_${lang}`,
      header: t('Title'),
      cell: (_: any, row: any) => row[`title_${lang}`] ?? row.title_en,
    },
    {
      accessor: `user.username`,
      header: t('User'),
    },
    {
      accessor: `service.name_${lang}`,
      header: t('Service'),
    },
    {
      header: t('Action'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ActionsMenu
          row={row}
          t={t}
          setSelectedRow={setSelectedRow}
          setIsEdit={setIsEdit}
          setModal={setModal}
          setDeleteModal={setDeleteModal}
          openImage={toggleModal}

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
        message={t('Are you sure you want to delete this idea?')}
      />

      <AddProjectModal
        setModal={setModal}
        toggle={modal}
        isEdit={isEdit}
        selectedRow={selectedRow}
      />
      <ImageModalWrapper
        imageable_id={selectedRow?.id}
        imageable_type="idea"
        HideAddPart={false}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs
            items={[{ label: t('Project'), href: '/projects' }, { label: t('Ideas') }]}
          />
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
            {t('Add new idea')}
          </CustomBTN>
        </div>

        <IdeasGlobalFilter
          updateFilters={updateFilters}
          setValue={setValue}
          filters={queryParams}
          value={value ?? ''}
          SearchPlaceholder={'Search For idea'}
        />

        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={ideas}
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

export default ProjectIdeas;
