import React from 'react';
import { DialogActions } from '@mui/material';
import { RotateLeft, FilterList } from '@mui/icons-material';
import Button from '@/components/atoms/Button/Button';
import { useTranslation } from 'react-i18next';

interface FilterDialogActionsProps {
  onReset: () => void;
  onApply: () => void;
  isApplyDisabled: boolean;
}

const FilterDialogActions: React.FC<FilterDialogActionsProps> = ({
  onReset,
  onApply,
  isApplyDisabled,
}) => {
  const { t } = useTranslation();

  return (
    <DialogActions className="flex items-center justify-between gap-2 px-4 py-3">
      <div>
        <Button onClick={onReset} icon={<RotateLeft />} variant="secondary">
          {t('Reset')}
        </Button>
      </div>
      <div>
        <Button
          onClick={onApply}
          disabled={isApplyDisabled}
          icon={<FilterList sx={{ color: 'white' }} />}
          variant="main"
        >
          {t('Apply Filter')}
        </Button>
      </div>
    </DialogActions>
  );
};

export default FilterDialogActions;