import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import { useFetchBranches, useMutateDeleteBranch } from '@/hooks/useBranches';
import Button from '@/components/atoms/Button/Button';
import { Delete } from '@mui/icons-material';
import { TableContainer } from '@/components/molecules/Table';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import Loader from '@/components/atoms/Loader/Loader';
import AddBranchModal from './AddBranchModal/AddBranchModal';

interface User {
  user_id: string;
  username: string;
}

interface BranchesProps {
  selectedUser: User;
}

const Branches: React.FC<BranchesProps> = ({ selectedUser }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState<number | null>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: branches = {}, isLoading } = useFetchBranches(selectedUser.user_id);

  const { mutateAsync: mutateDeleteBranchAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteBranch();

  const handleDeleteBranch = async () => {
    try {
      await mutateDeleteBranchAsync(Number(selectedId));
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.info(t('Branch Deleted Successfully!'));
      setSelectedId(null);
      setDeleteModal(false)
    } catch (err: any) {
      toast.error(t(err.response?.data?.message || 'Error deleting branch'));
    }
  };
  
  const columns: any = [
    {
      header: t('branches.Name'),
      accessor: 'branch_name',
      sortable: true,
      className: 'text-gray-500',
    },
    {
      header: t('branches.Email'),
      accessor: 'email',
      sortable: true,
    },
    {
      header: t('branches.Phone'),
      accessor: 'phone',
      sortable: true,
    },
    {
      header: t('branches.City'),
      accessor: 'city.name_en',
      sortable: true,
    },
    {
      header: t('branches.Action'),
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
              {t('branches.Delete')}
            </Button>
          </li>
        </ul>
      ),
      accessor: 'id',
    },
  ];

  document.title = 'Branches | CraftScene App';

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteBranch}
        loading={isMutateDeleteLoading}
        message={t('branches.Message.delete_branch')}
      />

      <div className="flex items-center justify-between w-fit ">
        <Button
          variant="main"
          icon={<i className="ri-add-fill" />}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {t('add_branch.add_branch_btn')}
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
            data={branches || []}
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

export default Branches;
