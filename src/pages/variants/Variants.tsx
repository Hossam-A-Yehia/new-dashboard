import { useCallback, useState, useMemo, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import {  useLocation, useNavigate } from 'react-router-dom';
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
import ActionsMenu from './ActionsMenu';
import { useFetchProducts } from '@/hooks/useProducts';
import AddProductModal from './AddProductModal/AddVariantModal';
import ImageModalWrapper from '@/components/molecules/Images/ImageModalWrapper';
import { IoAdd } from 'react-icons/io5';
import { useFetchVariants, useMutateDeleteVariant } from '@/hooks/useVariants';

const Variants = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const productId = location.search.includes('product_id')
    ? +(new URLSearchParams(location.search).get('product_id') ?? 0)
    : undefined;

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);
  const { data: productsData } = useFetchProducts([{ productId }]);
    const products = productsData?.data?.payload?.data || [];

  const [product] = products.filter((product: { id: number | undefined; }) => product.id === productId);

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/variants?product_id=${productId}&${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);
  modifiedQueryParams.userId = userData?.id;
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/variants?product_id=${productId}&${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );

  const { data, isLoading } = useFetchVariants({
    params: [
      {
        key: 'page',
        value: pageIndex !== 1 && pageIndex,
      },
      {
        key: 'filters[product_id][$eq]',
        value: productId,
      },
    ],
  });

  const variants = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const { mutateAsync: mutateDeleteVariantAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteVariant();

  const handleDeleteVariant = async () => {
    try {
      await mutateDeleteVariantAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      toast.info(t('variants.messages.deleteVariantSuccess'));
    } catch (err) {
      toast.error((err as any)?.response?.data?.message || 'Error');
    } finally {
      setDeleteModal(false);
    }
  };

  const columns = [
    {
      header: t('variants.quantity'),
      accessor: 'quantity',
    },
    {
      header: t('variants.price'),
      accessor: 'price',
    },
    {
      accessor: `product.title_${lang}`,
      header: t('variants.productName'),
      cell: (_: any, row: any) => row.product[`title_${lang}`] ?? row.product?.title_en,
    },
    {
      header: t('variants.branch'),
      accessor: `branch.branch_name`,
    },
    {
      header: t('variants.actions'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ActionsMenu
          row={row}
          setSelectedRow={setSelectedRow}
          setIsEdit={setIsEdit}
          setModal={setModal}
          setDeleteModal={setDeleteModal}
          openImage={toggleModal}
        />
      ),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  document.title = 'Variants | CraftScene App';

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteVariant}
        loading={isMutateDeleteLoading}
        message={t('variants.messages.deleteConfirmation')}
      />

      <AddProductModal
        setModal={setModal}
        toggle={modal}
        isEdit={isEdit}
        selectedRow={selectedRow}
        product={product}
      />
      <ImageModalWrapper
        imageable_id={selectedRow?.id}
        imageable_type="App\Models\Variant"
        HideAddPart={false}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={[
            { label: t('products.products') }, 
            { label: t('variants.variants') }
            ]} />
        </Box>

        <div className="flex items-center justify-start mb-4 gap-2 ">
          <div>
            <CustomBTN
              variant="main"
              icon={<IoAdd />}
              onClick={() => {
                setIsEdit(false);
                setSelectedRow({});
                setModal(true);
              }}
            >
              {t('variants.addNewVariant')}
            </CustomBTN>
          </div>
        </div>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <TableContainer
              columns={columns}
              data={variants}
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

export default Variants;
