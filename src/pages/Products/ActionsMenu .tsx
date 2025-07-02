import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActionsMenuProps {
  row: any;
  setSelectedRow: (row: any) => void;
  setIsEdit: (v: boolean) => void;
  setModal: (v: boolean) => void;
  setDeleteModal: (v: boolean) => void;
  openImage: any;
  VariantsCount:number
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
  VariantsCount
}: ActionsMenuProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigateToVariants = () => {
    navigate(`/variants?product_id=${row.id}`);
  };

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
        label={t('products.variants') + ` (${VariantsCount})`}
        color="success"
        onClick={handleNavigateToVariants}
        ariaLabel={t('products.navigate_to_variants')}
        icon={undefined}
      />

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
