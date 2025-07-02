import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Edit, Delete, Lightbulb } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ActionsMenuProps {
  row: any;
  setSelectedRow: (row: any) => void;
  setIsEdit: (v: boolean) => void;
  setModal: (v: boolean) => void;
  setDeleteModal: (v: boolean) => void;
}

const ActionButton = ({
  icon,
  label,
  color,
  onClick,
  ariaLabel,
  direction,
}: {
  icon: React.ReactNode;
  label: string;
  color: 'primary' | 'success' | 'error';
  onClick: () => void;
  ariaLabel: string;
  direction: 'rtl' | 'ltr';
}) => (
  <Tooltip title={label}>
    <Button
      variant="outlined"
      color={color}
      size="small"
      startIcon={direction === 'rtl' ? undefined : icon}
      endIcon={direction === 'rtl' ? icon : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }}
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
}: ActionsMenuProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const handleNavigateToIdeas = () => {
    navigate(`/projects/${row.id}/ideas?page=1`);
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

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        icon={<Lightbulb fontSize="small" />}
        label={t('MenuItems.Ideas')}
        color="primary"
        onClick={handleNavigateToIdeas}
        ariaLabel={t('common.actions.view_ideas')}
        direction={direction}
      />
      <ActionButton
        icon={<Edit fontSize="small" />}
        label={t('common.actions.edit')}
        color="success"
        onClick={handleEdit}
        ariaLabel={t('common.actions.edit_project')}
        direction={direction}
      />
      <ActionButton
        icon={<Delete fontSize="small" />}
        label={t('common.actions.delete')}
        color="error"
        onClick={handleDelete}
        ariaLabel={t('common.actions.delete_project')}
        direction={direction}
      />
    </div>
  );
};

export default ActionsMenu;
