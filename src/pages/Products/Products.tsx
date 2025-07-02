import { useCallback, useState, useMemo, useEffect } from 'react';
import { Container, Box, Avatar } from '@mui/material';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@/hooks/useQuery';
import { ADMIN_TYPE, SUPPLIER_TYPE } from '@/constants/Constants';
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
import ActionsMenu from './ActionsMenu ';
import { Download, FolderOpen, Image, Upload } from 'lucide-react';
import { useFetchProducts, useMutateDeleteProduct } from '@/hooks/useProducts';
import AddProductModal from './AddProductModal/AddProductModal';
import ImageModalWrapper from '@/components/molecules/Images/ImageModalWrapper';
import ProductsGlobalFilter from '@/components/molecules/GlobalFilters/ProductsFilter/ProductsFilter';
import { IoAdd } from 'react-icons/io5';
import UserGallery from '@/components/templates/UpdateBusiness/Gallery/Gallery';
import DownloadTemplateForm from './DownloadTemplateForm/DownloadTemplateForm';
import AddBulkProduct from './AddBulkProduct/AddBulkProduct';

const Products = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSupplier = SUPPLIER_TYPE.includes(userData?.user_type);
  const [bulkModal, setBulkModal] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    return query;
  }, [queryParams, userData?.business_user_detail?.id, userData?.user_type]);

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const updatedParams = createQueryParams({ ...modifiedQueryParams, ...filters, page: 1 });
    navigate(`/products?${updatedParams}`);
  };

  const pageIndex =
    parseInt(modifiedQueryParams?.page) > 0 ? parseInt(modifiedQueryParams?.page) - 1 : 0;

  useEffect(() => {
    if (modifiedQueryParams?.page === '0') {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: 1 });
      navigate(`/products?${updatedQueryParams}`, { replace: true });
    }
  }, [modifiedQueryParams, navigate]);
  modifiedQueryParams.userId = userData?.id;
  const setPageIndex = useCallback(
    (page: number) => {
      const updatedQueryParams = createQueryParams({ ...modifiedQueryParams, page: page + 1 });
      navigate(`/products?${updatedQueryParams}`);
    },
    [modifiedQueryParams, navigate],
  );

  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);
  const { data, isLoading } = useFetchProducts([{ ...modifiedQueryParams }]);

  const products = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const { mutateAsync: mutateDeleteProductAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteProduct();

  const handleDeleteProjects = async () => {
    try {
      await mutateDeleteProductAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.info(t('Product Deleted Successfully!'));
    } catch (err) {
      toast.error((err as any)?.response?.data?.message || 'Error');
    } finally {
      setDeleteModal(false);
    }
  };

  const bulkToggle = useCallback(() => {
    setBulkModal(!bulkModal);
  }, [bulkModal]);
  const templateModalToggle = useCallback(() => {
    setTemplateModal(!templateModal);
  }, [bulkModal]);

  const columns = [
    {
      accessor: 'url',
      header: t('products.image'),
      cell: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Avatar
            src={row.images[0]?.url}
            alt="Image"
            sx={{ width: 32, height: 32 }}
            variant="circular"
          />
          <button
            onClick={() => window.open(row.images[0]?.url, '_blank')}
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition"
          >
            <FolderOpen className="w-4 h-4 mr-1 text-gray-400" />
            {t('products.viewImage')}
          </button>
        </div>
      ),
    },
    {
      accessor: `title_${lang}`,
      header: t('products.productName'),
      cell: (_: any, row: any) => row[`title_${lang}`] ?? row.title_en,
    },
    !isNotAdmin && {
      header: t('products.username'),
      cell: (_: any, row: any) => (
        <Link to={`/user-form?id=${row.business_user?.id}`} className="text-muted d-inline-block">
          {row.business_user?.user?.username || t('Deleted User')}
        </Link>
      ),
      accessor: 'business_user.user.username',
    },
    {
      header: t('products.productGroup'),
      accessor: `-`,
      cell: (_: any, row: any) => row.service[`name_${lang}`] ?? row.service.name_en,
    },
    {
      header: t('products.actions'),
      accessor: '_',
      cell: (_: any, row: any) => (
        <ActionsMenu
          row={row}
          setSelectedRow={setSelectedRow}
          setIsEdit={setIsEdit}
          setModal={setModal}
          setDeleteModal={setDeleteModal}
          openImage={toggleModal}
          VariantsCount={row.variants?.length}
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
        message={t('products.messages.deleteMessage')}
      />

      <AddProductModal
        setModal={setModal}
        toggle={modal}
        isEdit={isEdit}
        selectedRow={selectedRow}
      />
      <ImageModalWrapper
        imageable_id={selectedRow?.id}
        imageable_type="product"
        HideAddPart={false}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <DownloadTemplateForm
        setModal={setTemplateModal}
        toggle={templateModalToggle}
        userId={userData?.id}
        templateModal={templateModal}
      />
      <AddBulkProduct
        setModal={setBulkModal}
        toggle={bulkToggle}
        templateModal={bulkModal}
      />
      {galleryOpen ? (
        <Container>
          <UserGallery
            userId={userData?.id}
          />
        </Container>
      ) : (
        <Container maxWidth="xl">
          <Box mb={2}>
            <CustomBreadcrumbs items={[
              { label: t('products.productsList') },
              { label: t('products.products') }
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
                {t('common.add_new')}
              </CustomBTN>
            </div>
            {isSupplier && (
              <>
                <div>
                  <CustomBTN
                    variant="main"
                    data-testid="bulk-add-product-btn"
                    onClick={() => {
                      setBulkModal(true);
                    }}
                    icon={<IoAdd />}
                  >
                    <span>{t('products.bulk_add_products')}</span>
                  </CustomBTN>
                </div>
                <div>
                  <CustomBTN
                    variant="edit"
                    icon={<Download />}
                    data-testid="download-products-template-btn"
                    onClick={() => {
                      setTemplateModal(true);
                    }}
                  >
                    <span>{t('products.download_template')}</span>
                  </CustomBTN>
                </div>
                <div>
                  <CustomBTN
                    variant="secondary"
                    data-testid="bulk-add-product-btn"
                    onClick={() => {
                      setGalleryOpen(true);
                    }}
                    icon={<Image />}
                  >
                    <span>{t('products.gallery')}</span>
                  </CustomBTN>
                </div>
              </>
            )}
          </div>
          {isSupplier && (
            <div className="w-full mb-4">
              <div className="mt-4 p-4 bg-orange-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-5 h-5 text-green-700" />
                  <h3 className="font-semibold text-green-800">
                    {t("products.instructions.header")}
                  </h3>
                </div>

                <div className="text-sm text-gray-700 space-y-2 ml-8">
                  <p>1. {t("products.instructions.paragraph1")}</p>
                  <p>2. {t("products.instructions.paragraph2")}</p>
                  <p>3. {t("products.instructions.paragraph3")}</p>
                  <p>4. {t("products.instructions.paragraph4")}</p>
                  <p>5. {t("products.instructions.paragraph5")}</p>
                </div>
              </div>{' '}
            </div>
          )}
          <ProductsGlobalFilter
            updateFilters={updateFilters}
            setValue={setValue}
            filters={queryParams}
            value={value ?? ''}
            SearchPlaceholder={t('products.filter.searchMessage')}
            isSupplier={isSupplier}
          />
          <Box>
            {isLoading ? (
              <Loader />
            ) : (
              <TableContainer
                columns={columns}
                data={products}
                customPageSize={customPageSize}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                totalPages={lastPage}
              />
            )}
          </Box>
        </Container>
      )}
    </div>
  );
};

export default Products;
