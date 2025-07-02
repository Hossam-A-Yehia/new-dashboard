import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Delete, Edit } from '@mui/icons-material';
import { TableContainer } from '@/components/molecules/Table';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import Loader from '@/components/atoms/Loader/Loader';
import { useLanguage } from '@/hooks/useLanguage';
import { SERVICES_STATUS_ENUM, SERVICES_TYPE } from '@/constants/Constants';
import { Button } from '@mui/material';
import CustomBTN from '@/components/atoms/Button/Button';
import { useDeleteServiceRequest, useFetchUserServiceRequests } from '@/hooks/useSuggestServices';
import AddServiceRequestModal from './AddSuugestServiceModal/AddSuugestServiceModal'; 

interface SuggestServiceProps {
  userId: number;
}

const SuggestService: React.FC<SuggestServiceProps> = ({ userId }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const lang = useLanguage();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{
    id: number;
    name_ar: string;
    name_en: string;
    category_id: number;
    category: { name_ar: string; name_en: string };
    service_type: string;
    status: string;
  } | null>(null);

  const { data, isLoading } = useFetchUserServiceRequests({ userId: userId.toString(), pageIndex: 1 });
  const suggestServices = data?.data?.payload?.data;
  const { mutateAsync: mutateDeleteRowAsync, isPending: isMutateDeleteLoading } =
    useDeleteServiceRequest();

  const handleDeleteRow = () => {
    if (selectedRow?.id) {
      mutateDeleteRowAsync(selectedRow.id.toString())
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['UserSuggestions'] });
          toast.info(t('suggestServices.deleteSuggession'));
          setDeleteModal(false);
          setSelectedRow(null);
        })
        .catch((err: { response: { data: { message: string } } }) => {
          toast.error(t(err.response?.data?.message) || t('suggestServices.errorMessage'));
        });
    }
  };

  const handleOpenModal = (edit: boolean, row?: any) => {
    setIsEdit(edit);
    setSelectedRow(row || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setSelectedRow(null);
  };

  const columns = [
    {
      accessor: '_',
      header: t('suggestServices.Name'),
      cell: (_: any, row: any) => row[`name_${lang}`] ?? '_',
      sortable: true,
    },
    {
      accessor: '_',
      header: t('suggestServices.Category'),
      cell: (_: any, row: any) => row.category[`name_${lang}`] ?? '_',
      sortable: true,
    },
    {
      header: t('suggestServices.ServiceType'),
      cell: (_: any, row: any) => {
        const value = row.service_type;
        const label = SERVICES_TYPE?.find((item: { value: any }) => item.value === value)?.label;
        return label ?? '_';
      },
      accessor: '_',
      sortable: true,
    },
    {
      header: t('suggestServices.Status'),
      cell: (_: any, row: any) => {
        const value = row.status;
        const label = SERVICES_STATUS_ENUM?.find((item: { value: any }) => item.value === value)?.label;
        return label ?? '_';
      },
      accessor: 'status',
      filterable: true,
      sortable: true,
    },
    {
      header: t('suggestServices.Action'),
      cell: (_: number, row: any) => (
        <ul className="list-inline gap-2 mb-0 flex">
          <li className="list-inline-item" title="Delete">
            <Button
              startIcon={<Delete sx={{ color: 'red' }} />}
              variant="outlined"
              color="error"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => {
                setSelectedRow(row);
                setDeleteModal(true);
              }}
            >
              {t('suggestServices.Delete')}
            </Button>
          </li>
          <li className="list-inline-item" title="Edit">
            <Button
              sx={{ textTransform: 'capitalize' }}
              startIcon={<Edit sx={{color:"blue"}}/>}
              variant="outlined"
              color="success"
              onClick={() => handleOpenModal(true, row)}
            >
              {t('suggestServices.Edit')}
            </Button>
          </li>
        </ul>
      ),
      accessor: '_',
    },
  ];

  document.title = 'Suggest Service | CraftScene App';

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedRow(null);
        }}
        onConfirm={handleDeleteRow}
        loading={isMutateDeleteLoading}
        message={t('suggestServices.deleteMessage')}
      />
      <AddServiceRequestModal
        open={modalOpen}
        onClose={handleCloseModal}
        isEdit={isEdit}
        userID={userId.toString()}
        selectedRow={selectedRow || undefined}
        selectedUser={{ user: { user_type_value: 'SUPPLIER' } }}
      />
      <div className="flex items-center justify-between w-fit">
        <CustomBTN
          variant="main"
          icon={<i className="ri-add-fill" />}
          onClick={() => handleOpenModal(false)}
        >
          {t('suggestServices.suggestServicesBtn')}
        </CustomBTN>
      </div>
      {isLoading || isMutateDeleteLoading ? (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      ) : (
        <div className="w-full mt-10">
          <TableContainer
            columns={columns}
            data={suggestServices || []}
            usePagination={false}
            totalPages={0}
          />
        </div>
      )}
    </div>
  );
};

export default SuggestService;