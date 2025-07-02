import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import AddImage from './AddImages/AddImage';
import { useTranslation } from 'react-i18next';
import { useFetchImages, useMutateDeleteImage } from '@/hooks/image';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import TableContainer from '../Table/TableContainer';
import { usePermissions } from '@/context/PermissionContext';

interface IndexProps {
  setModal: (open: boolean) => void;
  toggle: () => void;
  imageable_id: string | number;
  imageable_type: string;
  HideAddPart?: boolean;
}

export const Index: React.FC<IndexProps> = ({
  setModal,
  toggle,
  imageable_id,
  imageable_type,
  HideAddPart = false,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const [isEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const { canDeleteImage } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useFetchImages({
    params: [
      { key: 'page', value: pageIndex !== 1 && pageIndex },
      { key: 'filters[imageable_id][$eq]', value: imageable_id },
      { key: 'filters[imageable_type][$eq]', value: imageable_type },
    ],
  });

  const Images = data?.data?.payload?.data || [];
  const lastPage = data?.data?.payload?.last_page || 1;
  const customPageSize = data?.data?.payload?.per_page || 5;

  const { mutateAsync: mutateDeleteImageAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteImage();

  const handleDeleteImage = async () => {
    try {
      await mutateDeleteImageAsync(selectedRow?.id);
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.info(t('commonImageCard.message.imageDeletedSuccessfully'));
      setDeleteModal(false);
    } catch (err: any) {
      toast.error(t(err.response?.data?.message || t('commonImageCard.message.erroDeleteImage')));
    }
  };

  const onCloseDeleteModal = () => {
    if (!isMutateDeleteLoading) {
      setDeleteModal(false);
      setSelectedRow({});
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: t('commonImageCard.table.image'),
        accessor: 'url',
        cell: (_: any, row: any) => (
          <Box display="flex" alignItems="center" width="300px">
            {row.url ? (
              <img src={row.url} alt="" className="size-10  rounded-full" />
            ) : (
              <Box className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                {row.title?.charAt(0) || '?'}
              </Box>
            )}
          </Box>
        ),
      },
      {
        accessor: '_',
        header: t('commonImageCard.table.actions'),
        cell: (_: any, row: any) => (
          <ul className="flex gap-2 w-1/2">
            <li>
              <Link
                to="#"
                className="inline-block px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(row.url, '_blank');
                }}
              >
                <i className="ri-eye-fill mr-1"></i> {t('commonImageCard.table.view')}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="inline-block px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(row.url);
                  toast.info(t('commonImageCard.message.imageLinkCopiedSuccess'));
                }}
              >
                <i className="ri-file-copy-line mr-1"></i> {t('commonImageCard.table.copyLink')}
              </Link>
            </li>
              <li>
                <button
                  className="inline-block px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    setSelectedRow(row);
                    setDeleteModal(true);
                  }}
                >
                  <i className="ri-delete-bin-fill mr-1"></i> {t('commonImageCard.table.delete')}
                </button>
              </li>
          </ul>
        ),
      },
    ];

    if (!HideAddPart) {
      baseColumns.splice(
        1,
        0,
        {
          header: t('commonImageCard.table.title'),
          accessor: 'title',
          cell: (_: any, row: any) => <span>{row.title || t('commonImageCard.table.noTitile')}</span>,
        },
        {
          header: t('commonImageCard.table.caption'),
          accessor: 'caption',
          cell: (_: any, row: any) => <span>{row.caption || t('commonImageCard.table.noCaption')}</span>,
        },
        {
          header: t('commonImageCard.table.altText'),
          accessor: 'alt',
          cell: (_: any, row: any) => <span>{row.alt || t('commonImageCard.table.noAltText')}</span>,
        },
      );
    }

    return baseColumns;
  }, [HideAddPart, canDeleteImage, t]);

  document.title = 'Images | CraftScene App';

  return (
    <Box>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={onCloseDeleteModal}
        onConfirm={handleDeleteImage}
        loading={isMutateDeleteLoading}
        message={t('commonImageCard.message.deleteConfirmation')}
      />

        <div className=" mb-6">
          <AddImage
            setModal={setModal}
            toggle={toggle}
            imageable_id={imageable_id}
            imageable_type={imageable_type}
            selectedRow={selectedRow}
            isEdit={isEdit}
          />
        </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center py-8">
            {t('commonImageCard.message.errorLoadImage')}
          </div>
        ) : Images.length > 0 ? (
          <TableContainer
            columns={columns}
            data={Images}
            customPageSize={customPageSize}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            totalPages={lastPage}
          />
        ) : (
          <Box className="text-center py-8">{t('commonImageCard.message.noDataToPreview')}</Box>
        )}
      </div>
    </Box>
  );
};

export default Index;
