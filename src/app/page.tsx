"use client";
import React, { useState } from "react";
import { Box, Button, Grid2, ThemeProvider, useTheme, Tooltip } from "@mui/material";
import FileUploaded from "@/classe/File";
import Dropzone from "@/components/Dropzone";
import FileList from "@/components/FileList";
import type { DropzoneState } from "@/types";

function HomePage() {
  const theme = useTheme();
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({
    visible: false,
    image_url: null,
    fillPercentage: 0,
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);

  function handleSetDropzoneState(show: boolean, image_url: string | null) {
    setDropzoneState({ visible: show, image_url });
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ paddingTop: "10vh" }}>
        <Grid2
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
          sx={{ height: "80vh" }}
        >
          <Grid2
            container
            justifyContent="center"
            alignContent="end"
            size={{ xs: 10, md: 7 }}
          >
            <Dropzone
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              dropzoneState={dropzoneState}
              setDropzoneState={setDropzoneState}
            />
          </Grid2>
          <Grid2
            container
            size={{ xs: 10, md: 4 }}
            display={"flex"}
            alignContent="end"
            justifyContent="center"
          >
            <FileList
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              handleSetDropzoneState={handleSetDropzoneState}
            />
          </Grid2>
          <Grid2
            size={{ xs: 10, md: 7 }}
            sx={{ display: { xs: "none", md: "flex" } }}
          ></Grid2>
          <Grid2 size={{ xs: 10, md: 4 }} justifyContent="center" display={{xs:"flex", md:"flow"}}
          >
            <Tooltip data-testid="hint-submit-button-disabled" title="You need to upload a minimum of 1 file to start analyse" sx={{fontSize:"1rem"}}>
              <span style={{ display:"flex", justifyContent:"center", width: '100%' }}>
              <Button
                data-testid="submit-button"
                variant="contained"
                color="secondary"
                disabled={uploadedFiles.length === 0}
                fullWidth
                sx={{
                  width: {xs:"90%", md:"100%"},
                  minWidth: "133.44px",
                }}
              >
                Submit
              </Button>
              </span>
              </Tooltip>
          </Grid2>
        </Grid2>
      </Box>
    </ThemeProvider>
  );
}
export default HomePage;
