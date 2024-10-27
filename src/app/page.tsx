"use client"
import { Box, Button, Grid2, Stack, ThemeProvider, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import { getSize } from "@/utils/themeUtils";
import useBreakpoints from "@/utils/useBreakpoints";

interface DropzoneState {
  visible: boolean;
  image_url: string | null;
}

function Home() {
  const theme = useTheme();
  const breakpoints = useBreakpoints();
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({ visible: false, image_url: null });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


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
                            onDragOver={()=>console.log("handleDragOver")}
                            onDrop={()=>console.log("handleDrop")}
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
                                    <CloudUpload sx={{ fontSize:  getSize(theme, "xl", breakpoints) , color: theme.palette.secondary.main }} />
                                    <Typography variant="h3" color={theme.palette.secondary.main}>
                                        <b>Drag & Drop To Upload Files</b>
                                    </Typography>
                                    <Typography variant="h3" color={theme.palette.secondary.main}>
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
                                    backgroundColor: theme.palette.secondary.main,
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
                                    p: uploadedFiles.length !== 0 ? 2 : 0,
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {uploadedFiles.length > 0 ? 'Uploaded files' : 'No files uploaded'}
                                </Typography>
                                <Stack
                                    direction="column"
                                    spacing={2}
                                    sx={{ width: '100%', alignItems: 'flex-start' }}
                                >
                                </Stack>
                            </Box>
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 7 }} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    </Grid2>
                    <Grid2 size={{ xs: 10, md: 4 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: theme.palette.secondary.main,
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
    </ThemeProvider>
  );
}

export default Home;
