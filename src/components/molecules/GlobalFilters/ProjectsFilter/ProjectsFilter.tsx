import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import { FilterList, RotateLeft, Close, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/atoms/Button/Button';

interface ProjectGlobalFilterProps {
  updateFilters: (filters: Record<string, string>) => void;
  setValue: (value: string) => void;
  filters: Record<string, string>;
  SearchPlaceholder?: string;
  value: string;
  isNotAdmin: boolean;
}

const ProjectGlobalFilter: React.FC<ProjectGlobalFilterProps> = ({
  updateFilters,
  setValue,
  filters,
  SearchPlaceholder = 'Search...',
  value,
  isNotAdmin,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const direction = i18n.dir();

  const filterOptions = useMemo(
    () => [
      { label: t('common.filter.project_title'), value: 'title' },
      { label: t('common.filter.category'), value: 'category' },
      ...(isNotAdmin ? [] : [{ label: t('common.filter.username'), value: 'username' }]),
    ],
    [isNotAdmin, t],
  );

  useEffect(() => {
    const initialFilter = filterOptions.find((item) => filters[item.value]);
    if (initialFilter) {
      setValue(filters[initialFilter.value]);
      setFilterOption(initialFilter.value);
    }
  }, [filters, setValue, filterOptions]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleFilter = () => {
    if (filterOption) {
      updateFilters({ [filterOption]: value });

      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set(filterOption, value);
      navigate({
        pathname: window.location.pathname,
        search: currentParams.toString(),
      });
    }
    toggleModal();
  };

  const handleClearFilter = () => {
    setValue('');
    updateFilters({});

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('title');
    currentParams.delete('category');
    currentParams.delete('username');

    navigate({
      pathname: window.location.pathname,
      search: currentParams.toString(),
    });

    toggleModal();
  };

  return (
    <div className={`w-fit mb-5 ${direction === 'rtl' ? 'text-right rtl:mr-auto' : 'text-left ltr:ml-auto'}`}>
      <Button variant="main" icon={<FilterList sx={{ color: 'white' }} />} onClick={toggleModal}>
        {t('common.filter.filter')}
      </Button>
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {t('common.filter.filter_projects')}
          <IconButton onClick={toggleModal}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('common.filter.filter_by')}</InputLabel>
            <Select
              value={filterOption}
              label={t('common.filter.filter_by')}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <MenuItem value="">{t('common.filter.select_filter_option')}</MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            placeholder={t('common.filter.write_here')}
            margin="normal"
            label={SearchPlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </DialogContent>

        <DialogActions >
          <div className="flex items-center justify-between gap-3 w-full">
          <Button onClick={handleClearFilter} icon={<RotateLeft />} variant="secondary">
            {t('common.filter.reset')}
          </Button>
          <Button
            onClick={handleFilter}
            disabled={!filterOption}
            icon={<FilterList sx={{ color: 'white' }} />}
            variant="main"
          >
            {t('common.filter.apply_filter')}
          </Button>

          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectGlobalFilter;
