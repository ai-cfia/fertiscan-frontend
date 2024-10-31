"use client"
import { Box, Button, Grid2, Stack, ThemeProvider, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import FileElement from "@/components/FileElement";
import FileUploaded, { FileType } from '@/classe/File';


interface DropzoneState {
  visible: boolean;
  image_url: string | null;
}

function Home() {
  const theme = useTheme();
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({ visible: false, image_url: null });
  const [uploadedFiles, setUploadedFiles] = useState<(File | FileUploaded)[]>([]);

  function handleSetDropzoneState(show: boolean, image_url: string) {
    setDropzoneState({ visible: show, image_url });
    }

    async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    async function processFile(file: File) {
        const newFile = new FileUploaded({
            dimension: { width: 0, height: 0 },
            path: URL.createObjectURL(file),
            user: { username: 'Anonymous' },
            type: file.type.split('/')[1] as FileType,
            uploadDate: new Date(),
        });

        const detectedType = await newFile.detectType();

        if (typeof detectedType === 'object' && detectedType.type === 'pdf') {
           // TODO:  https://github.com/ai-cfia/fertiscan-frontend/blob/256-nextjs-test/src/app/captur/page.tsx
        } else {
            setUploadedFiles(prevFiles => [...prevFiles, newFile]);
        }
    }

    function handleDelete(url: string) {
        setUploadedFiles(uploadedFiles.filter(file => file instanceof FileUploaded && file.getInfo().path !== url));
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
                                border: '3px dashed ',
                                borderColor: theme.palette.secondary.main,
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
                                        border: '2px solid',
                                        borderColor: theme.palette.secondary.main,
                                    }}
                                />
                            ) : (
                                <Box sx={{ textAlign: 'center' }}>
                                    <CloudUpload sx={{color: theme.palette.secondary.main, fontSize: '7rem'}} />
                                    <Typography variant="h4" color={theme.palette.secondary.main}>
                                        <b>Drag & Drop To Upload Files</b>
                                    </Typography>
                                    <Typography variant="h4" color={theme.palette.secondary.main}>
                                        <b>OR</b>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary">
                                        Browse File
                                        <input type="file" accept=".png,.jpg,.jpeg,.pdf" hidden onChange={()=>console.log("handleFileUpload")} />
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
                                border: '2px solid',
                                borderColor: theme.palette.secondary.main,
                                borderRadius: 1,
                                textAlign: 'center',
                                p: 1,
                                backgroundSize: 'contain',
                                backgroundColor: theme.palette.secondary.main,
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
                                    backgroundColor: theme.palette.text.primary,
                                    borderRadius: '10px',
                                    WebkitBackgroundClip: 'content-box',
                                    border: '6px solid transparent'
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
                                    p: uploadedFiles.length !== 0 ? 2 : 0,
                                }}
                            >
                                <Typography variant="h5" color={theme.palette.text.primary} gutterBottom>
                                   <b> {uploadedFiles.length > 0 ? 'Uploaded files'+" ("+uploadedFiles.length+")" : 'No files uploaded'}</b>
                                </Typography>
                                <Stack
                                    direction="column"
                                    spacing={2}
                                    sx={{ width: '100%', alignItems: 'center' }}
                                >
                                    {
                                    uploadedFiles.map((file, index) => (
                                        <FileElement
                                            key={index}
                                            //handleRightClick={()=>console.log("handleRightClick")}
                                            //handleCloseContextMenu={()=>console.log("handleCloseContextMenu")}
                                            setDropZoneState={handleSetDropzoneState}
                                            //contextMenuAnchor={()=>console.log("contextMenuAnchor")}
                                            //setContextMenuAnchor={()=>console.log("setContextMenuAnchor")}
                                            fileName={file instanceof FileUploaded ? file.getInfo().tags?.[0]?.name || file.getInfo().path.split('/').pop() || "filename.jpg" : file.name}
                                            fileUrl={file instanceof FileUploaded ? file.getInfo().path : URL.createObjectURL(file)}
                                            //handleRename={()=>console.log("(newName) => handleRename(index, newName)")}
                                            handleDelete={() => {
                                                if (file instanceof FileUploaded) {
                                                    handleDelete(file.getInfo().path);
                                                    setDropzoneState({ visible: false, image_url: null });
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 7 }} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 4 }}>
                        {uploadedFiles.length > 0 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            sx={{
                                minWidth: '133.44px',
                            }}
                        >
                            Submit
                        </Button>
                        )}
                    </Grid2>
                </Grid2>
              </Box>
    </ThemeProvider>
  );
}

export default Home;
