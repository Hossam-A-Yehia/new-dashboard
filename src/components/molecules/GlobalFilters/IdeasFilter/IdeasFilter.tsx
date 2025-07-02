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
import Button from '@/components/atoms/Button/Button';
import { useTranslation } from 'react-i18next';

interface IdeasGlobalFilterProps {
  updateFilters: (filters: Record<string, string>) => void;
  setValue: (value: string) => void;
  filters: Record<string, string>;
  SearchPlaceholder?: string;
  value: string;
}

const IdeasGlobalFilter: React.FC<IdeasGlobalFilterProps> = ({
  updateFilters,
  setValue,
  filters,
  SearchPlaceholder = 'Search...',
  value,
}) => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('');

  const filterOptions = useMemo(
    () => [
          { label: t("Idea Title"), value: "title" },
          { label: t("Service"), value: "service" },
    ],
    [],
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
    setFilterOption('');
    setValue('');
    updateFilters({});

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('title');
    currentParams.delete('service');

    navigate({
      pathname: window.location.pathname,
      search: currentParams.toString(),
    });

    toggleModal();
  };

  return (
    <>
      <div className="w-fit mb-5 text-right ml-auto">
        <Button variant="main" icon={<FilterList sx={{ color: 'white' }} />} onClick={toggleModal}>
          Filter
        </Button>
      </div>
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Filter Ideas
          <IconButton onClick={toggleModal}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Filter By</InputLabel>
            <Select
              value={filterOption}
              label="Filter By"
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <MenuItem value="">Select a filter option</MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            placeholder='Write here'
            margin="normal"
            label={SearchPlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </DialogContent>

        <DialogActions className="flex items-center justify-between gap-2">
          <div>
            <Button onClick={handleClearFilter} icon={<RotateLeft />} variant="secondary">
              Reset
            </Button>
          </div>
          <div >
            <Button
              onClick={handleFilter}
              disabled={!filterOption}
              icon={<FilterList sx={{ color: 'white' }} />}
              variant="main"
            >
              Apply Filter
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IdeasGlobalFilter;
