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
import { ORDER_STATUS } from '@/constants/Constants';


interface MyOrderListGlobalFilterProps {
  updateFilters: (filters: Record<string, string>) => void;
  setValue: (value: string) => void;
  filters: Record<string, string>;
  SearchPlaceholder?: string;
  value: string;
  isSupplier: boolean;
  isServiceProvider?: boolean;
}

const MyOrderListGlobalFilter: React.FC<MyOrderListGlobalFilterProps> = ({
  updateFilters,
  setValue,
  filters,
  SearchPlaceholder = 'Search...',
  value,
  isSupplier,
  isServiceProvider
}) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState("")
  const { t } = useTranslation()
  const filterOptions = useMemo(
    () => [
      { label: t("Order Id"), value: "orderId" },
      ...((isSupplier || isServiceProvider) ? [] : [{ label: t("client_name"), value: "client_name" }, { label: t("supplier_name"), value: "supplier_name" }]),
    ],
    [isSupplier, isServiceProvider],
  );

  useEffect(() => {
    const initialFilter = filterOptions.find((item) => filters[item.value]);
    if (initialFilter) {
      setValue(filters[initialFilter.value]);
      setFilterOption(initialFilter.value);
      setOrderStatusFilter(filters.orderStatus || "");
    }
  }, [filters, setValue, filterOptions]);

  const toggleModal = () => setModalOpen(!modalOpen);

const handleFilter = () => {
  const allPossibleKeys = ['orderId', 'orderStatus', 'client_name', 'supplier_name'];
  const newFilters: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  // Set selected filters
  if (filterOption && value) {
    newFilters[filterOption] = value;
    searchParams.set(filterOption, value);
  }

  if (orderStatusFilter) {
    newFilters.orderStatus = orderStatusFilter;
    searchParams.set('orderStatus', orderStatusFilter);
  }

  allPossibleKeys.forEach((key) => {
    if (!(key in newFilters)) {
      searchParams.delete(key);
    }
  });

  updateFilters(newFilters);

  navigate({
    pathname: window.location.pathname,
    search: searchParams.toString(),
  });

  toggleModal();
};


  const handleClearFilter = () => {
    setFilterOption('');
    setOrderStatusFilter("");
    setValue('');
    updateFilters({});

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('orderId');
    currentParams.delete('orderStatus');
    currentParams.delete('client_name');
    currentParams.delete('supplier_name')

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
          Filter orders
          <IconButton onClick={toggleModal}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Order Status</InputLabel>
            <Select
              value={orderStatusFilter || ''}
              label="Order Status"
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
              }}
            >
              <MenuItem value="">Select Status</MenuItem>
              {ORDER_STATUS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


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
              disabled={!filterOption && !orderStatusFilter}
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

export default MyOrderListGlobalFilter;
