import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { TableFilters, Product } from '../types';

interface FilterBarProps {
  filters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
  onAddUser: () => void;
  products: Product[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onAddUser, products }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const handleProductChange = (event: any) => {
    onFilterChange({ ...filters, product: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFilterChange({ ...filters, status: event.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({ search: '', product: '', status: '' });
  };

  const hasActiveFilters = filters.search || filters.product || filters.status;

  return (
    <Paper
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
          sx={{
            flex: 1,
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FilterIcon fontSize="small" />
              Product
            </Box>
          </InputLabel>
          <Select
            value={filters.product}
            onChange={handleProductChange}
            label="🔧 Product"
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <MenuItem value="">
              <em>All Products</em>
            </MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={handleStatusChange}
            label="Status"
            sx={{
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <MenuItem value="">
              <em>All Status</em>
            </MenuItem>
            <MenuItem value="Active">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                  }}
                />
                Active
              </Box>
            </MenuItem>
            <MenuItem value="Revoked">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                  }}
                />
                Revoked
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Clear
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddUser}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Add User
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterBar;

