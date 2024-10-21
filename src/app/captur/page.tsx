"use client";
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Typography, Stack } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { CloudUpload } from '@mui/icons-material';
import ChooseImageModal from '@/components/PdfImageModal/ChooseImageModal';
import LoginModal from '@/components/Login/Login';
import UploadFile from '@/components/UploadFile/UploadFile';
import { FileUploaded, FileType, } from '@/Classes/File/File';

const theme = createTheme({
    palette: {
        primary: {
            main: '#033a5b',
        },
    },
});

interface DropzoneState {
    visible: boolean;
    image_url: string | null;
}

function Capture() {
    // Login Modal State
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const handleLoginModalOpen = () => setLoginModalOpen(true);
    const handleLoginModalClose = () => setLoginModalOpen(false);

    // Context Menu State
    const [contextMenuAnchor, setContextMenuAnchor] = useState<{ mouseX: number; mouseY: number } | null>(null);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    // Dropzone State
    const [dropzoneState, setDropzoneState] = useState<DropzoneState>({ visible: false, image_url: null });

    // Uploaded files/ images State
    const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);
    const [PageExtracted, setPageExtracted] = useState<FileUploaded[]>([]);

    // Function Dropzone
    async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        let files = event.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    function handleDelete(url: string) {
        setUploadedFiles(uploadedFiles.filter(file => file.getInfo().path !== url
        ));
    }

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function handleSetDropzoneState(show: boolean, image_url: string) {
        setDropzoneState({ visible: show, image_url });
    }

    // Function Context Menu
    function handleCloseContextMenu() {
        setContextMenuAnchor(null)
    }

    function handleRightClick(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        setContextMenuAnchor({ mouseX: event.clientX - 2, mouseY: event.clientY + 4 });

    }

    function handleRename(index: number, newName: string) {
        // This maps through the uploadedFiles array and updates the specific file based on index
        const updatedFiles = uploadedFiles.map((file, i) => {
            if (i === index) {
                file.rename(newName);
                return new FileUploaded({ ...file.getInfo() }); // Create a new instance if necessary
            }
            return file;
        });

        // Now, update the React state with the array of files, which includes the renamed file
        setUploadedFiles(updatedFiles);
    }

    // Function File Upload
    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        let files = event.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }

    function handleConfirm(selectedFiles: FileUploaded[]) {
        let index=0;
        for (let file of selectedFiles) {
            let newFile = new FileUploaded({
                dimension: { width: 0, height: 0 },
                path: file.getInfo().path,
                user: file.getInfo().user,
                type: file.getInfo().type,
                uploadDate: new Date(),
            });
            newFile.addTag({ name: 'Extracted'+index++ }),
            setUploadedFiles(prevFiles => [...prevFiles, newFile]);
        }
    }

    async function processFile(file: File) {
        let newFile = new FileUploaded({
            dimension: { width: 0, height: 0 },
            path: URL.createObjectURL(file),
            user: { username: 'Anonymous' },
            type: file.type.split('/')[1] as FileType,
            uploadDate: new Date(),
        });

        let detectedType = await newFile.detectType();

        if (typeof detectedType === 'object' && detectedType.type === 'pdf') {
            let images = await newFile.extractPagesFromPDF(await (await fetch(newFile.getInfo().path)).arrayBuffer());
            setPageExtracted(images);
            setOpen(true);
        } else {
            setUploadedFiles(prevFiles => [...prevFiles, newFile]);
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ paddingTop: '10vh' }}>
                <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" sx={{ height: "80vh" }}>
                    <Grid2 size={{ xs: 10, md: 7 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                position: 'relative',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '3px dashed #033a5b',
                                borderRadius: 1,
                                textAlign: 'center',
                                p: 1,
                                backgroundSize: 'contain',
                                backgroundColor: 'transparent',
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: '350px', md: '400px' },
                                minWidth: '133.44px',
                            }}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {dropzoneState.visible && dropzoneState.image_url ? (
                                <Box
                                    component="img"
                                    src={dropzoneState.image_url}
                                    alt="Uploaded file"
                                    sx={{
                                        position: 'absolute',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        border: '2px solid #033a5b',
                                    }}
                                />
                            ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                    <CloudUpload sx={{ fontSize: '120px', color: '#033a5b' }} />
                                    <Typography variant="h6" sx={{ fontSize: { xs: '0.7rem', md: '1rem', lg: '1rem' } }}>
                                        <b>Drag & Drop to upload Files</b>
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontSize: { xs: '0.7rem', md: '1rem', lg: '1rem' } }}>
                                        <b>OR</b>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            backgroundColor: '#033a5b',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: '#022d46' },
                                            fontSize: { xs: '0.5rem', sm: '0.7rem', md: '0.7rem', lg: '0.8rem' },
                                        }}
                                    >
                                        Browse File
                                        <input type="file" hidden onChange={handleFileUpload} />
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 4 }} display={'flex'}>
                        <Box
                            sx={{
                                display: 'flex',
                                position: 'relative',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '2px solid #033a5b',
                                borderRadius: 1,
                                textAlign: 'center',
                                p: 1,
                                backgroundSize: 'contain',
                                backgroundColor: 'transparent',
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: '350px', md: '400px' },
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                minWidth: '133.44px',
                                // Styles for the scrollbar for Webkit browsers (Chrome, Safari, and newer Edge)
                                '&::-webkit-scrollbar': {
                                    width: '20px',
                                    marginRight: '10px'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#022d46',
                                    borderRadius: '10px',
                                    WebkitBackgroundClip: 'content-box',
                                    border: '5px solid transparent'
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: uploadedFiles.length === 0 ? '50%' : 'initial',
                                    left: uploadedFiles.length === 0 ? '50%' : 'initial',
                                    transform: uploadedFiles.length === 0 ? 'translate(-50%, -50%)' : 'none', // center the box when there are no uploaded files
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: uploadedFiles.length === 0 ? 'center' : 'flex-start',
                                    alignItems: uploadedFiles.length === 0 ? 'center' : 'flex-start',
                                    textAlign: 'center',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    p: uploadedFiles.length !== 0 ? 2 : 0, // padding when there are files
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {uploadedFiles.length > 0 ? 'Uploaded files' : 'No files uploaded'}
                                </Typography>
                                <Stack
                                    direction="column"
                                    spacing={2}  // adjust spacing as needed
                                    sx={{ width: '100%', alignItems: 'flex-start' }}
                                >
                                    {uploadedFiles.map((file, index) => (
                                        <UploadFile
                                            key={index}
                                            handleRightClick={handleRightClick}
                                            handleCloseContextMenu={handleCloseContextMenu}
                                            setDropZoneState={handleSetDropzoneState}
                                            contextMenuAnchor={contextMenuAnchor}
                                            setContextMenuAnchor={setContextMenuAnchor}
                                            fileName={file.getInfo().tags?.[0]?.name || file.getInfo().path.split('/').pop() || "filename.jpg"}
                                            fileUrl={file.getInfo().path}
                                            handleRename={(newName) => handleRename(index, newName)}
                                            handleDelete={() => handleDelete(file.getInfo().path)}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 7 }} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button variant="contained" color="primary" onClick={handleLoginModalOpen}>
                            Open Login Modal
                        </Button>
                        <LoginModal open={loginModalOpen} onClose={handleLoginModalClose} />
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 4 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#033a5b',
                                color: '#fff',
                                minWidth: '133.44px',
                                '&:hover': { backgroundColor: '#022d46' },
                            }}
                        >
                            Submit
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
            <ChooseImageModal
                open={open}
                handleClose={handleClose}
                images={PageExtracted}
                onConfirm={handleConfirm}
            />
        </ThemeProvider>
    );
}

export default Capture;