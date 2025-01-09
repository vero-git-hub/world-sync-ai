import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface FilterControlsProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onResetFilter: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ selectedDate, onDateChange, onResetFilter }) => {
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onDateChange(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <TextField
                label="Filter by Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button
                variant="contained"
                color="secondary"
                onClick={onResetFilter}
                disabled={selectedDate.length === 0}
            >
                Reset Filter
            </Button>
        </Box>
    );
};

export default FilterControls;