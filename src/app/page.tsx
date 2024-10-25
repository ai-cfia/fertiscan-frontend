"use client"
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";

interface DropzoneState {
  visible: boolean;
  image_url: string | null;
}

function Home() {
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({ visible: false, image_url: null });

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
                                        <input type="file" accept=".png,.jpg,.jpeg,.pdf" hidden onChange={()=>console.log("handleFileUpload")} />
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid2>
                </Grid2>

                    </Box>
      </ThemeProvider>
  );
}

export default Home;
