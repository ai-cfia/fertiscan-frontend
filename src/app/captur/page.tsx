"use client";
import React, { useState, useEffect } from 'react'; 
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import { Box, Button, Typography } from '@mui/material'; 
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
    const [images, setImages] = useState<string[]>([]);
    
    // Function Dropzone
    async function handleDrop (event: React.DragEvent<HTMLDivElement>) { 
        event.preventDefault(); 
        let files = event.dataTransfer.files; 
        if (files && files.length > 0) { 
            processFile(files[0]);
        }
    };

    function handleDragOver (event: React.DragEvent<HTMLDivElement>) { 
        event.preventDefault(); 
    }

    function handleSetDropzoneState (show: boolean, image_url: string) { 
        setDropzoneState({ visible: show, image_url }); 
    }
    
    // Function Context Menu
    function handleCloseContextMenu () {
        setContextMenuAnchor(null)
    }

    function handleRightClick(event: React.MouseEvent<HTMLDivElement>) { 
        event.preventDefault(); 
        setContextMenuAnchor({ mouseX: event.clientX - 2, mouseY: event.clientY + 4 }); 

    }

    // Function File Upload
    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) { 
        let files = event.target.files; 
        if (files && files.length > 0) { 
            processFile(files[0]);
        } 
    }

    function handleConfirm (selectedImages: string[]) {
        let newFiles: FileUploaded[] = [];
        let baseFileName = 'pdf';

        let count = 1;
        for (let url of selectedImages) {
            let imageFile = new FileUploaded({
                dimension: { width: 0, height: 0 },
                path: url,
                user: { username: 'Anonymous' },
                type: 'png', 
                uploadDate: new Date(),
                tags: [{ name: `${baseFileName}_picture_${count}` }]
            });
            count += 1;
            newFiles.push(imageFile);
        }

        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }

    async function processFile (file: File) {
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
            setImages(images);
            setOpen(true);
        } else {
            setUploadedFiles(prevFiles => [...prevFiles, newFile]);
        }
    }


    return ( 
        <ThemeProvider theme={theme}> 
            <Box sx={{ paddingTop: '10vh' }}> 
                <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center" height="80vh"> 
                    <Grid2 size={{ xs: 10, md: 7 }}> 
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                border: '3px dashed #033a5b', 
                                borderRadius: 1, 
                                textAlign: 'center', 
                                p: 1, 
                                backgroundSize: 'cover', 
                                backgroundColor: 'transparent', 
                                width: '100%', 
                                height: '100%', 
                                minHeight: { xs: '350px', md: '400px' }, 
                            }} 
                            onDragOver={handleDragOver} 
                            onDrop={handleDrop} 
                        > 
                            {dropzoneState.visible && dropzoneState.image_url ? ( 
                                <Box> 
                                    <Box 
                                        component="img" 
                                        src={dropzoneState.image_url} 
                                        alt="Uploaded file" 
                                        sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' }, maxWidth: '100%', maxHeight: '100%' }} 
                                    /> 
                                </Box> 
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
                    <Grid2 size={{ xs: 10, md: 4 }} display={'flex'} maxHeight={'100vh'}> 
                        <Box 
                            sx={{ 
                                border: '3px solid #05486C', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                p: 2, 
                                borderRadius: 1, 
                                width: '100%', 
                                height: '100%', 
                                overflowY: 'auto',
                            }} 
                        > 
                            <Typography variant="h6" gutterBottom> 
                                Uploaded files 
                            </Typography>

                            {uploadedFiles.map((file, index) => ( 
                                <UploadFile 
                                    key={index} 
                                    handleRightClick={handleRightClick} 
                                    handleCloseContextMenu={handleCloseContextMenu} 
                                    setDropZoneState={handleSetDropzoneState} 
                                    contextMenuAnchor={contextMenuAnchor} 
                                    setContextMenuAnchor={setContextMenuAnchor} 
                                    fileName={file.getInfo().tags?.[0]?.name || file.getInfo().path.split('/').pop() || 'filename.jpg'} 
                                    fileUrl={file.getInfo().path} 
                                /> 
                            ))} 
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
                images={images}
                mainImage={images[0]}
                onConfirm={handleConfirm}
            />
        </ThemeProvider> 
    ); 
}

export default Capture;