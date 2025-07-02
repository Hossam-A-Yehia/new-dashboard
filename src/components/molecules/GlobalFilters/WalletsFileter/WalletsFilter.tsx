import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import { FilterList, Close, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button/Button';
import { BALANCE_OPTIONS } from '@/constants/Constants';
import FilterDialogActions from '@/components/atoms/DialogActiions/FilterDialogActions';

interface WalletsGlobalFilterProps {
  updateFilters: (filters: Record<string, string | null>) => void;
  setValue: (value: string) => void;
  filters: Record<string, string>;
  SearchPlaceholder?: string;
  value: string;
  isNotAdmin: boolean;
}


const WalletsGlobalFilter: React.FC<WalletsGlobalFilterProps> = ({
  updateFilters,
  filters,
  isNotAdmin,
}) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBalanceFilter, setCurrentBalanceFilter] = useState('');
  const [totalEarnedFilter, setTotalEarnedFilter] = useState('');
  const [usernameValue, setUsernameValue] = useState('');

  useEffect(() => {
    if (!isNotAdmin) {
      setUsernameValue(filters.username || '');
    }
    setCurrentBalanceFilter(filters.currentBalanceRange || '');
    setTotalEarnedFilter(filters.totalEarnedRange || '');
  }, [filters, isNotAdmin]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleFilter = () => {
    const newFilters: Record<string, string | null> = {
      currentBalanceRange: currentBalanceFilter || null,
      totalEarnedRange: totalEarnedFilter || null,
    };

    if (!isNotAdmin) {
      newFilters.username = usernameValue || null;
    }

    updateFilters(newFilters);

    const currentParams = new URLSearchParams(window.location.search);
    if (!isNotAdmin && usernameValue) currentParams.set('username', usernameValue);
    if (currentBalanceFilter) currentParams.set('currentBalanceRange', currentBalanceFilter);
    if (totalEarnedFilter) currentParams.set('totalEarnedRange', totalEarnedFilter);

    navigate({
      pathname: window.location.pathname,
      search: currentParams.toString(),
    });

    toggleModal();
  };

  const handleClearFilter = () => {
    setUsernameValue('');
    setCurrentBalanceFilter('');
    setTotalEarnedFilter('');
    updateFilters({});

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('username');
    currentParams.delete('currentBalanceRange');
    currentParams.delete('totalEarnedRange');

    navigate({
      pathname: window.location.pathname,
      search: currentParams.toString(),
    });

    toggleModal();
  };
  const isFilterValid = isNotAdmin
    ? !!currentBalanceFilter || !!totalEarnedFilter
    : !!usernameValue || !!currentBalanceFilter || !!totalEarnedFilter;


  return (
    <>
      <div className="w-fit mb-5 text-right ml-auto">
        <Button variant="main" icon={<FilterList sx={{ color: 'white' }} />} onClick={toggleModal}>
          Filter
        </Button>
      </div>
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Filter Wallets
          <IconButton onClick={toggleModal}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {!isNotAdmin && (
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              placeholder="Search by username"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Current Balance Range</InputLabel>
            <Select
              value={currentBalanceFilter}
              label="Current Balance Range"
              onChange={(e) => setCurrentBalanceFilter(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {BALANCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Total Earned Range</InputLabel>
            <Select
              value={totalEarnedFilter}
              label="Total Earned Range"
              onChange={(e) => setTotalEarnedFilter(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {BALANCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <FilterDialogActions
          onReset={handleClearFilter}
          onApply={handleFilter}
          isApplyDisabled={!isFilterValid}
        />
      </Dialog>
    </>
  );
};

export default WalletsGlobalFilter;
