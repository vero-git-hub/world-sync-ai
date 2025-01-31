import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface FilterControlsProps {
    selectedDate: string;
    selectedTeam: string;
    onDateChange: (date: string) => void;
    onTeamChange: (team: string) => void;
    onResetFilter: () => void;
    className?: string;
}

const FilterControls: React.FC<FilterControlsProps> = ({ selectedDate, selectedTeam, onDateChange, onTeamChange, onResetFilter, className }) => {
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onDateChange(event.target.value);
    };

    const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onTeamChange(event.target.value);
    };

    return (
        <Box
            className={className} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                marginBottom: 2,
                padding: 2,
            }}
        >
            <TextField
                label="Filter by Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="Filter by Team"
                type="text"
                value={selectedTeam}
                onChange={handleTeamChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button
                variant="contained"
                color="secondary"
                onClick={onResetFilter}
                disabled={selectedDate.length === 0 && selectedTeam.length === 0}
            >
                Reset Filter
            </Button>
        </Box>
    );
};

export default FilterControls;