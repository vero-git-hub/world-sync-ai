import React from 'react';
import { Box, Button } from '@mui/material';

interface PaginationControlsProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    className
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <Box className={className} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginTop: 3 }}>
            <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </Button>
        </Box>
    );
};

export default PaginationControls;