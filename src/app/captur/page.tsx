"use client";
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, IconButton, Typography, Icon } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/system';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContextMenu from '@/components/ContextMenu/ContextMenu';


// Création du thème
const theme = createTheme({
    palette: {
        primary: {
            main: '#033a5b',
        },
    },
});

// Styles personnalisés en utilisant styled de MUI
interface UploadSectionProps {
    showImageInDropZone: boolean;
}

const UploadSection = styled(Box)<UploadSectionProps>(({ theme, showImageInDropZone }) => ({
    display: 'flex', // Enables flexbox
    height: '100%',
    minHeight:'100%',
    flexDirection: 'column', // Stacks children vertically
    justifyContent: 'center', // Centers children vertically in the container
    alignItems: 'center', // Centers children horizontally in the container
    border: '2px dashed #033a5b',
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
    padding: theme.spacing(8), // Increased padding
    backgroundColor: showImageInDropZone ? '#C5C5C5': 'transparent',

}));

const UploadedImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
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
    top: theme.spacing(-3),
    right: theme.spacing(-1.5),
    color: 'black',
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
            display: 'flex',
        },
    },
}));

const FileElement = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
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




function Capture() {
    const [hovered, setHovered] = useState(false);
    const [showImageInDropZone, setShowImageInDropZone] = useState(false);
    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setContextMenuAnchor({ mouseX: event.clientX - 2, mouseY: event.clientY + 4 });
      };
      
    const [contextMenuAnchor, setContextMenuAnchor] = useState<{ mouseX: number; mouseY: number } | null>(null);

    const handleCloseContextMenu = () => {
      setContextMenuAnchor(null);
    };
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#C5C5C5", height: "100vh", paddingTop: "10vh" }} >
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" height="80vh">
                    <Grid size={{ xs: 10, md: 7, lg: 5 }}>
                        <UploadSection showImageInDropZone={showImageInDropZone}>
                            {showImageInDropZone ? (
                                <img src="/img/placeholder.png" alt="Uploaded file" style={{ display:'block', height:'100%', objectFit: 'fill'  }} />
                            ) : (
                                <>
                                    <CloudUpload style={{ fontSize: '120', color: '#033a5b' }} />
                                    <Typography variant="h6" sx={{ fontSize: { xs: '0.7rem', md: '1rem', lg: '1rem' } }}>
                                        <b>Drag & Drop to upload Files</b>
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontSize: { xs: '0.7rem', md: '1rem', lg: '1rem' } }}>
                                        <b>OR</b>
                                    </Typography>
                                    <Button variant="contained" style={{ backgroundColor: '#033a5b', color: '#fff',  }}>
                                        Browse File
                                    </Button>
                                </>
                            )}
                        </UploadSection>
                    </Grid>
                    <Grid size={{ xs: 10, md: 4, lg: 4 }}>
                        <FileListBox>
                            <Typography variant="h6" gutterBottom>
                                Uploaded files
                            </Typography>
                            <UploadedFileContainer
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <FileElement onContextMenu={handleRightClick}>
                                        <UploadedImage src="/img/placeholder.png" alt="uploaded file"
                                            onMouseEnter={() => setShowImageInDropZone(true)}
                                            onMouseLeave={() => setShowImageInDropZone(false)}
                                        />
                                        {/* Need to add on mouse leave */}
                                         <ContextMenu 
                                        contextMenuPosition={contextMenuAnchor} 
                                        setContextMenuPosition={setContextMenuAnchor}
                                        handleClose={handleCloseContextMenu}
                                        />
                                        <Typography variant="h6" sx={{ fontSize: { xs: '0.7rem', md: '1rem', lg: '1rem' } }} style={{ marginLeft: '16px' }}>
                                            <b>
                                                filename.jpg
                                            </b>
                                        </Typography>
                                    </FileElement>
                                    {hovered && (
                                        <CloseIconButton edge="end" aria-label="delete">
                                            <CancelOutlinedIcon fontSize='large'/>
                                        </CloseIconButton>
                                    )}
                                </Box>
                            </UploadedFileContainer>
                        </FileListBox>
                    </Grid>
                    <Grid size={{ xs: 10, md: 7, lg: 5 }} display={{ xs: 'none', md: 'flex' }}>
                    </Grid>
                    <Grid size={{ xs: 10, md: 4, lg: 4 }}>
                        <SubmitButton variant="contained" fullWidth>
                            Submit
                        </SubmitButton>
                    </Grid>
                </Grid>
            </Box>

        </ThemeProvider>
    );
}

export default Capture;


