import {
  useFetchCategories,
  useFetchUserCategories,
  useMutateDeleteUserCategory,
} from '@/hooks/useCategories';
import generateNestedNames from '@/utils/generateNestedNames';
import UserCategoryForm from '@/components/molecules/UserCategoryForm/UserCategoryForm';
import { CategoryTypesEnum } from './ValidationSchema';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { t } from 'i18next';
import { useState } from 'react';
import { Column, TableContainer } from '@/components/molecules/Table';
import Button from '@/components/atoms/Button/Button';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import { Delete } from '@mui/icons-material';

interface Category {
  id: number;
  name: string;
  email: string;
  active: boolean;
  role: string;
  lastLogin: string;
}

function UpdateUserCategories() {
  const [pageIndex, setPageIndex] = useState(0);
  const [categoryId, setCategoryId] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const queryClient = useQueryClient();
  const { userData } = useUser();
  const categoryType = CategoryTypesEnum[userData?.user_type_value || ''];
  const { data: categoriesData } = useFetchCategories({ category_type: categoryType });
  const { mutateAsync: mutateDeleteRowAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteUserCategory();
  const { data: userCategories } = useFetchUserCategories(userData?.id ?? 0);

  const userCategoryIds =
    userCategories?.data?.payload?.map(
      (category: { category_id: number }) => category.category_id,
    ) || [];

  const allCategories = categoriesData?.data?.payload || [];

  const mappedCategories = generateNestedNames(allCategories).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const handleDeleteCategory = async () => {
    try {
      await mutateDeleteRowAsync(categoryId);
      queryClient.invalidateQueries({ queryKey: ['userCategories'] });
      toast.info(t('update_user_categories.deleted_succcess_message'));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteModal(false);
      setCategoryId(null);
    }
  };

  const columns: Column<Category>[] = [
    {
      header: t('update_user_categories.name_en'),
      accessor: 'category.name_en',
      sortable: true,
      className: 'text-gray-500',
    },
    {
      header: t('update_user_categories.name_ar'),
      accessor: 'category.name_ar',
      sortable: true,
    },
    {
      header: t('update_user_categories.Action'),
      cell: (value) => (
        <ul className="list-inline gap-2 mb-0">
          <li className="list-inline-item w-2/3 " title="Delete">
            <Button
              icon={<Delete sx={{ color: 'red-1/2' }} />}
              variant="delete-outline"
              onClick={() => {
                setDeleteModal(true);
                setCategoryId(() => value);
              }}
            >
              <i className="ri-delete-bin-fill align-bottom me-2"></i> {t('update_user_categories.delete')}
            </Button>
          </li>
        </ul>
      ),
      accessor: 'id',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <UserCategoryForm
        userData={userData}
        mappedCategories={mappedCategories}
        userCategoryIds={userCategoryIds}
      />

      <TableContainer
        columns={columns}
        data={userCategories?.data?.payload || []}
        customPageSize={5}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        usePagination={false}
        totalPages={0}
      />
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteCategory}
        loading={isMutateDeleteLoading}
        message={t('update_user_categories.Message.delete_category')}
      />
    </div>
  );
}

export default UpdateUserCategories;
