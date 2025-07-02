import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { useTranslation } from 'react-i18next';

interface ActionsMenuProps {
  row: any;
  setSelectedRow: (row: any) => void;
  setModal?: (v: boolean) => void;
  setDeleteModal: (v: boolean) => void;
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
  setDeleteModal,
}: ActionsMenuProps) => {
  const { t } = useTranslation();
  const handleDelete = () => {
    setSelectedRow(row);
    setDeleteModal(true);
  };
  return (
    <div className="flex flex-wrap gap-2">
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
