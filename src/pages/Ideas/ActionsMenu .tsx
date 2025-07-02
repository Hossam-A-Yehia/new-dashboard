import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Edit, Delete, Lightbulb } from '@mui/icons-material';

interface ActionsMenuProps {
  row: any;
  t: (key: string) => string;
  setSelectedRow: (row: any) => void;
  setIsEdit: (v: boolean) => void;
  setModal: (v: boolean) => void;
  setDeleteModal: (v: boolean) => void;
  openImage?:any
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
  t,
  setSelectedRow,
  setIsEdit,
  setModal,
  setDeleteModal,
  openImage
}: ActionsMenuProps) => {
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
    openImage()
  };


  

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        icon={<Lightbulb fontSize="small" />}
        label={t('Images')}
        color="primary"
        onClick={handleOpenImages}
        ariaLabel={t('Navigate to Ideas')}
      />
      <ActionButton
        icon={<Edit fontSize="small" />}
        label={t('Edit')}
        color="success"
        onClick={handleEdit}
        ariaLabel={t('Edit project')}
      />
      <ActionButton
        icon={<Delete fontSize="small" />}
        label={t('Delete')}
        color="error"
        onClick={handleDelete}
        ariaLabel={t('Delete project')}
      />
    </div>
  );
};

export default ActionsMenu;
