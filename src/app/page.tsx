"use client";
import FileUploaded from "@/classe/File";
import Dropzone from "@/components/Dropzone";
import FileList from "@/components/FileList";
import type { DropzoneState } from "@/types";
import { Box, Button, Grid2, Tooltip } from "@mui/material";
import { useState } from "react";

function HomePage() {
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({
    visible: false,
    imageUrl: null,
    fillPercentage: 0,
  });
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);

  return (
    <Box className="pt-[10vh]">
      <Grid2
        className="h-[80vh] justify-center"
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid2
          className="content-end justify-center"
          container
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
          className="flex content-end justify-center"
          container
          size={{ xs: 10, md: 4 }}
        >
          <FileList
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            setDropzoneState={setDropzoneState}
          />
        </Grid2>
        <Grid2 sx={{ display: { xs: "none", md: "flex" }}} size={{ xs: 10, md: 7 }} /> {/* Work around since tailwind dont work for none */}
        <Grid2
          className="xs:flex md:flow-root justify-center"
          size={{ xs: 10, md: 4 }}
        >
          <Tooltip
            data-testid="hint-submit-button-disabled"
            title="You need to upload a minimum of 1 file to start analyse"
            disableHoverListener={uploadedFiles.length !== 0}
            placement="top"
          >
            <span className="flex justify-center w-full">
              <Button
                className="xs:w-[96%] md:w-[100%] min-w-[133.44px] max-h-[40px]"
                data-testid="submit-button"
                variant="contained"
                color="secondary"
                disabled={uploadedFiles.length === 0}
                fullWidth
              >
                Submit
              </Button>
            </span>
          </Tooltip>
        </Grid2>
      </Grid2>
    </Box>
  );
}
export default HomePage;
