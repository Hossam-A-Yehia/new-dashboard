import Button from '@/components/atoms/Button/Button';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import { Column } from '@/components/molecules/Table';
import TableContainer from '@/components/molecules/Table/TableContainer';
import UserServicesForm from '@/components/molecules/UserServices/UserServicesForm/UserServicesForm';
import { useUser } from '@/context/UserContext';
import { useMutateDeleteUserService } from '@/hooks/useServices';
import { useFetchUserServices } from '@/hooks/useUser';
import { Delete } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Service {
  id: number;
  name: string;
  email: string;
  active: boolean;
  role: string;
  lastLogin: string;
}

function UpdateUserServices() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [serviceId, setServiceId] = useState<any>();

  const queryClient = useQueryClient();
  const { mutateAsync: mutateDeleteServiceAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteUserService();

  const { userData } = useUser();
  const { data: { payload: userServices = [] } = {} } = useFetchUserServices(String(userData?.id));

  const handleDeleteService = () => {
    mutateDeleteServiceAsync(serviceId)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['user-services', userData?.id],
        });
        toast.info(t('update_user_services.deleted_succcess_message'));
        setDeleteModal(false);
      })
      .catch((err: any) => {
        toast.error(err.message);
        return err;
      });
  };

  const columns: Column<Service>[] = [
    {
      header: t('update_user_services.name_en'),
      accessor: 'service.name_en',
      sortable: true,
      className: 'text-gray-500',
    },
    {
      header: t('update_user_services.name_ar'),
      accessor: 'service.name_ar',
      sortable: true,
    },
    {
      header: t('update_user_services.Action'),
      cell: (value) => (
        <ul className="list-inline gap-2 mb-0">
          <li className="list-inline-item w-2/3 " title="Delete">
            <Button
              icon={<Delete sx={{ color: 'red-1/2' }} />}
              variant="delete-outline"
              onClick={() => {
                setDeleteModal(true);
                setServiceId(() => value);
              }}
            >
              <i className="ri-delete-bin-fill align-bottom me-2"></i> {t('update_user_services.delete')}
            </Button>
          </li>
        </ul>
      ),
      accessor: 'id',
    },
  ];

  return (
    <>
      <UserServicesForm
        userServices={userServices}
        userId={userData?.id}
        userType={userData?.user_type}
      />
      <div className="mt-10">
        <TableContainer
          columns={columns}
          data={userServices?.data || []}
          usePagination={false}
          totalPages={0}
        />
      </div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteService}
        loading={isMutateDeleteLoading}
        message={t('update_user_services.Message.delete_service_message')}
      />
    </>
  );
}

export default UpdateUserServices;
