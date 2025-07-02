import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, CircularProgress, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateDeleteImage } from '@/hooks/image';
import { t } from 'i18next';
import { TableContainer } from '@/components/molecules/Table';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal/DeleteConfirmationModal';
import Button from '@/components/atoms/Button/Button';

interface Props {
  userImages: any;
  isLoading: boolean;
}

const ImageIndex: React.FC<Props> = ({ userImages, isLoading }) => {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState(false);

  const { mutateAsync: mutateDeleteImageAsync, isPending: isMutateDeleteLoading } =
    useMutateDeleteImage();

  const handleDeleteImage = () => {
    mutateDeleteImageAsync(selectedRow?.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['images'] });
        toast.info('Image Deleted Successfully!');
        setDeleteModal(false);
      })
      .catch((err) => {
        toast.error(t(err.response.data.message));
        return err;
      });
  };

  const columns: any = [
    {
      header: t('Image'),
      accessor: 'url',
      cell: (value: any) => (
        <Box display="flex" alignItems="center" width={300}>
          {value ? (
            <img src={value} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={32}
              height={32}
              borderRadius="50%"
              bgcolor="success.light"
            ></Box>
          )}
        </Box>
      ),
    },
    {
      header: t('Action'),
      accessor: '-',
      cell: (_: any, row: any) => (
        <Box display="flex" gap={1}>
          <Button
            variant="main"
            onClick={() => window.open(row.url, '_blank')}
            icon={
              <VisibilityIcon
                sx={{
                  color: 'white',
                }}
              />
            }
          >
            {t('View')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigator.clipboard.writeText(row.url);
              toast.info(t('commonImageCard.message.imageLinkCopiedSuccess'));
            }}
            icon={<ContentCopyIcon sx={{color:"white"}} />}
          >
            {t('Copy')}
          </Button>
          <Button
            variant="delete-outline"
            onClick={() => {
              setSelectedRow(row);
              setDeleteModal(true);
            }}
            icon={<DeleteIcon sx={{ color: 'red1/2' }} />}
          >
            {t('Delete')}
          </Button>
        </Box>
      ),
    },
  ];
  document.title = 'Images | CraftScene App';

  return (
    <div>
      <DeleteConfirmationModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteImage}
        loading={isMutateDeleteLoading}
        message={t('Are you sure you want to delete this image?')}
      />
      <div>
        {isLoading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : userImages?.length > 0 ? (
          <TableContainer columns={columns} data={userImages || []} totalPages={0} />
        ) : (
          <Typography align="center" p={4}>
            {t('No Data to Preview!')}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ImageIndex;
