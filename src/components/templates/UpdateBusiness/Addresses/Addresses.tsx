import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import Button from '@/components/atoms/Button/Button';
import { Delete } from '@mui/icons-material';
import { TableContainer } from '@/components/molecules/Table';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import Loader from '@/components/atoms/Loader/Loader';
import AddBranchModal from './AddAddressModal/AddAddressModal';
import { useFetchAddress, useMutateDeleteAddress } from '@/hooks/useAddress';

interface User {
  user_id: string;
  username: string;
}

interface BranchesProps {
  selectedUser: User;
}

const Addresses: React.FC<BranchesProps> = ({ selectedUser }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState<number | null>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: addresses = {}, isLoading } = useFetchAddress(selectedUser.user_id);

  const { mutateAsync: mutateDeleteBranchAsync, isPending: isMutateDeleteLoading } =
  useMutateDeleteAddress();

  const handleDeleteBranch = async () => {
    try {
      await mutateDeleteBranchAsync(Number(selectedId));
      queryClient.invalidateQueries({ queryKey: ['Address'] });
      toast.info(t('Address Deleted Successfully!'));
      setSelectedId(null);
      setDeleteModal(false)
    } catch (err: any) {
      toast.error(t(err.response?.data?.message || 'Error deleting branch'));
    }
  };
  
  const columns: any = [
    {
      header: t('addresses.Title'),
      accessor: 'title',
      sortable: true,
    },
    {
      header: t('addresses.StreetAddress'),
      accessor: 'street_address',
      sortable: true,
    },
    {
      header: t('addresses.Email'),
      accessor: 'email',
      sortable: true,
    },
    {
      header: t('addresses.Phone'),
      accessor: 'phone',
      sortable: true,
    },
    {
      header: t('addresses.City'),
      accessor: 'city.name_en',
      sortable: true,
    },
    {
      header: t('addresses.Action'),
      cell: (value: number) => (
        <ul className="list-inline gap-2 mb-0">
          <li className="list-inline-item  " title="Delete">
            <Button
              icon={<Delete sx={{ color: 'red-1/2' }} />}
              variant="delete-outline"
              onClick={() => {setDeleteModal(true)
                setSelectedId(value)
              }
              }
            >
              <i className="ri-delete-bin-fill align-bottom me-2"></i>
               {t('addresses.Delete')}
            </Button>
          </li>
        </ul>
      ),
      accessor: 'id',
    },
  ];

  document.title = 'Address | CraftScene App';

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteBranch}
        loading={isMutateDeleteLoading}
        message={t('addresses.DeleteMessage')}
      />

      <div className="flex items-center justify-between w-fit ">
        <Button
          variant="main"
          icon={<i className="ri-add-fill" />}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {t('add_address.add_addres_btn')}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      ) : (
        <div className="w-full mt-10">
          <TableContainer
            columns={columns}
            data={addresses || []}
            usePagination={false}
            totalPages={0}
          />
        </div>
      )}
      <AddBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={selectedUser.user_id}
      />
    </div>
  );
};

export default Addresses;
