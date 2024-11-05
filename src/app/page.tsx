"use client";
import React, { useState } from "react";
import { Box, Button, Grid2, ThemeProvider, useTheme, Tooltip } from "@mui/material";
import FileUploaded from "@/classe/File";
import Dropzone from "@/components/Dropzone";
import FileList from "@/components/FileList";
import type { DropzoneState, ImageLoadEvent, ParentDimensions } from "@/types";

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

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  }

  async function processFile(file: File) {
    const alreadyExists = uploadedFiles.some(
      (uploadedFile) => uploadedFile.getInfo().name === file.name,
    );

    if (alreadyExists) {
      // TODO: Implement error message
      return;
    }

    const newFile = FileUploaded.newFile(
      { username: "user" },
      URL.createObjectURL(file),
      file,
    );

    const detectedType = await FileUploaded.detectType(newFile.getInfo().path);
    if (typeof detectedType === "object" && detectedType.type === "pdf") {
      // TODO: Handle PDF files
    } else {
      setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
    }
  }

  function handleDelete(url: string) {
    setUploadedFiles(
      uploadedFiles.filter(
        (file) => file instanceof FileUploaded && file.getInfo().path !== url,
      ),
    );
  }

  /**
   * Handles the image load event and updates the dropzone state based on the image width.
   */
  function handleImageLoad(event: ImageLoadEvent) {
    const { width } = event.target;

    const dropzoneElement = document.getElementById("dropzone");
    if (!dropzoneElement) {
      console.error("Dropzone element not found");
      return;
    }

    const { width: parentWidth } = dropzoneElement.getBoundingClientRect();
    const parentDimensions: ParentDimensions = {
      width: parentWidth,
      height: 0,
    };
    const widthPercentage = (width / parentDimensions.width) * 100;

    if (widthPercentage >= 70) {
      setDropzoneState((prevState) => ({
        ...prevState,
        fillPercentage: Math.max(widthPercentage, 100),
      }));
    } else {
      setDropzoneState((prevState) => ({
        ...prevState,
        fillPercentage: 0,
      }));
    }
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
              handleFileUpload={handleFileUpload}
              handleDragOver={(event) => event.preventDefault()}
              handleDrop={handleDrop}
              handleImageLoad={handleImageLoad}
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
              handleDelete={handleDelete}
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
