"use client";
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Container, IconButton, Typography, AppBar, Toolbar, Icon } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CloudUpload, Menu, AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';


// Création du thème
const theme = createTheme({
    palette: {
        primary: {
            main: '#033a5b',
        },
    },
});

// Styles personnalisés en utilisant styled de MUI
const UploadSection = styled(Box)(({ theme }) => ({
    display: 'flex', // Enables flexbox
    height: '100%',
    flexDirection: 'column', // Stacks children vertically
    justifyContent: 'center', // Centers children vertically in the container
    alignItems: 'center', // Centers children horizontally in the container
    border: '2px dashed #033a5b',
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
    padding: theme.spacing(8), // Increased padding
    backgroundColor: '#C5C5C5',
}));

const UploadedImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
        maxWidth: '30%',
    },
    [theme.breakpoints.up('xs')]: {
        maxWidth: '20%',
    },
}));


const SubmitButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#033a5b',
    color: '#fff',
    display: 'flex',
    '&:hover': {
        backgroundColor: '#022d46',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

// Styles pour l'icône de fermeture
const CloseIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    display: 'flex',
}));

const UploadedFileContainer = styled(Box)(({ theme }) => ({
    border: '2px solid #05486C',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: '#C5C5C5',
    position: 'relative',
    marginBottom: theme.spacing(2),
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
    '&:hover': {
        '.MuiIconButton-root': {
            display: 'flex', // This displays the button on hover
        },
    },
}));

const FileListBox = styled(Box)(({ theme }) => ({
    border: '3px solid #05486C',
    display: 'flex',
    height: '100%',
    backgroundColor: '#C5C5C5',
    flexDirection: 'column',
    padding: theme.spacing(2), 
    borderRadius: 10,
}));

// Composant principal
function Capture() {
    const [hovered, setHovered] = useState(false);

    return (
        <ThemeProvider theme={theme}>

                <Grid container rowSpacing={1}  columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" height="80vh" marginTop="10vh"  sx={{
          '--Grid-borderWidth': '5px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'black',
          },
        }}>
                    <Grid size={{ xs: 10, md:7, lg: 5 }}>
                        <UploadSection>
                            <CloudUpload style={{ fontSize: 50, color: '#033a5b' }} />
                            <Typography variant="h6">Drag & Drop to upload Files</Typography>
                            <Typography variant="h6">OR</Typography>
                            <Button variant="contained" style={{ backgroundColor: '#033a5b', color: '#fff', marginTop: '16px' }}>
                                Browse File
                            </Button>
                        </UploadSection>
                    </Grid>
                    <Grid size={{xs: 10, md:4, lg: 4 }}>
                    <FileListBox>
                                <Typography variant="h6" gutterBottom>
                                    Uploaded files
                                </Typography>
                                <UploadedFileContainer
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                                        <Box display="flex" alignItems="center">
                                            <UploadedImage src="/img/placeholder.png" alt="uploaded file" />
                                            <Typography variant="h6" style={{ marginLeft: '16px' }}>
                                                filename.jpg
                                            </Typography>
                                        </Box>
                                        {hovered && (
                                            <CloseIconButton edge="end" aria-label="delete">
                                                <Icon>close</Icon> {/* Placeholder for close icon */}
                                            </CloseIconButton>
                                        )}
                                    </Box>
                                </UploadedFileContainer>
                            </FileListBox>
                    </Grid>
                    <Grid size={{ xs: 10, md:7, lg: 5 }} display={{ xs: 'none', md:'flex' }}>
                    </Grid>
                    <Grid size={{xs: 10, md:4, lg: 4 }}>
                    <SubmitButton variant="contained" fullWidth>
                            Submit
                        </SubmitButton>
                    </Grid>
                </Grid>
            

    </ThemeProvider>
    );
}

export default Capture;


