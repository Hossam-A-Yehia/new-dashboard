import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActionsMenuProps {
  row: any;
  setSelectedRow: (row: any) => void;
  setIsEdit: (v: boolean) => void;
  setModal: (v: boolean) => void;
  setDeleteModal: (v: boolean) => void;
  openImage: any;
}

const ActionButton = ({
  icon,
  label,
  color,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  color: 'primary' | 'success' | 'error';
  onClick: () => void;
  ariaLabel: string;
}) => (
  <Tooltip title={label}>
    <Button
      variant="outlined"
      color={color}
      size="small"
      startIcon={icon}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {label}
    </Button>
  </Tooltip>
);

const ActionsMenu = ({
  row,
  setSelectedRow,
  setIsEdit,
  setModal,
  setDeleteModal,
  openImage,
}: ActionsMenuProps) => {
  const { t } = useTranslation();

  const handleEdit = () => {
    setSelectedRow(row);
    setIsEdit(true);
    setModal(true);
  };

  const handleDelete = () => {
    setSelectedRow(row);
    setDeleteModal(true);
  };

  const handleOpenImages = () => {
    setSelectedRow(row);
    openImage();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        icon={<Image fontSize="small" />}
        label={t('products.images')}
        color="primary"
        onClick={handleOpenImages}
        ariaLabel={t('products.open_images')}
      />
      <ActionButton
        icon={<Edit fontSize="small" />}
        label={t('common.edit')}
        color="success"
        onClick={handleEdit}
        ariaLabel={t('common.edit_product')}
      />
      <ActionButton
        icon={<Delete fontSize="small" />}
        label={t('common.delete')}
        color="error"
        onClick={handleDelete}
        ariaLabel={t('common.delete_product')}
      />
    </div>
  );
};

export default ActionsMenu;
