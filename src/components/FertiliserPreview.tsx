import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';

interface FertiliserPreviewProps {
    fertiliserName: string;
    registrationNumber: string;
    lotNumber: string;
    location: string;
    inspectorName: string;
    dateOfInspection: Date;
    organisationName: string;
    organisationAddress: string;
    organisationPhoneNumber: string;
}

/**
 * FertiliserPreview Component
 *
 * This component renders the preview of the fertiliser details.
 */
const FertiliserPreview: React.FC<FertiliserPreviewProps> = ({
    fertiliserName,
    registrationNumber,
    lotNumber,
    location,
    inspectorName,
    dateOfInspection,
    organisationName,
    organisationAddress,
    organisationPhoneNumber,
}) => {
    return (
        <Box
        sx={{
            backgroundColor: '#0a4a6a',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            wordWrap: 'break-word',
            minHeight: '260px',  // Set a consistent height for all boxes
        }}
    >
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            {/* Left Column for Fertiliser Details */}
            <Grid item xs={12} md={6}>
                <Typography variant="h6" component="div" gutterBottom>
                    <strong>{fertiliserName}</strong>&nbsp;&nbsp;{registrationNumber}
                </Typography>
                <Typography variant="body2">{lotNumber}</Typography>
                <Typography variant="body2">{location}</Typography>
            </Grid>

            {/* Right Column for Organisation Details */}
            <Grid item xs={12} md={6} paddingLeft={6} >
                <Typography variant="h6" component="div" gutterBottom>
                    <strong>{organisationName}</strong>
                </Typography>
                <Typography variant="body2">{organisationAddress}</Typography>
                <Typography variant="body2">{organisationPhoneNumber}</Typography>
            </Grid>

            {/* Controls and Footer */}
            <Grid item xs={12} mt={2} alignContent={"end"}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between', // Adjusts items to edges of container
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button variant="contained" color="primary" sx={{ backgroundColor: '#7b7b7b' }}>
                            Download
                        </Button>
                        <Button variant="contained" color="primary" sx={{ backgroundColor: '#7b7b7b' }}>
                            Inspect
                        </Button>
                        <Typography variant="body2" alignSelf={"center"} paddingLeft={1}>
                            {inspectorName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '2rem' }}>
                        <Typography variant="body2">
                            {dateOfInspection.toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </Box>
    );
};

export default FertiliserPreview;
