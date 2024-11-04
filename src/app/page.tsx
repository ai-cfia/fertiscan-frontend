"use client";
import {
  Box,
  Button,
  Grid2,
  Stack,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import FileElement from "@/components/FileElement";
import FileUploaded from "@/classe/File";

/**
 * Represents the state of a dropzone component.
 *
 * @interface DropzoneState
 * @property {boolean} visible - Indicates whether the dropzone is visible.
 * @property {string | null} image_url - The URL of the image in the dropzone, or null if no image is present.
 * @property {number} [fillPercentage] - Optional property representing the fill percentage of the dropzone.
 */
interface DropzoneState {
  visible: boolean;
  image_url: string | null;
  fillPercentage?: number;
}

/**
 * Interface representing an image load event in a React application.
 * Extends the React.SyntheticEvent interface with a target of type HTMLImageElement.
 *
 * @interface ImageLoadEvent
 * @extends {React.SyntheticEvent<HTMLImageElement>}
 * @property {HTMLImageElement} target - The target element of the event, which is an HTMLImageElement.
 */
interface ImageLoadEvent extends React.SyntheticEvent<HTMLImageElement> {
    target: HTMLImageElement;
}

/**
 * Interface representing the dimensions of a parent element.
 *
 * @property {number} width - The width of the parent element.
 * @property {number} height - The height of the parent element.
 */
interface ParentDimensions {
    width: number;
    height: number;
}

function Home() {
  const theme = useTheme();
  const [dropzoneState, setDropzoneState] = useState<DropzoneState>({
    visible: false,
    image_url: null,
    fillPercentage: 0,
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);

/**
 * Updates the state of the dropzone component.
 *
 * @param {boolean} show - Determines whether the dropzone should be visible.
 * @param {string} image_url - The URL of the image to be displayed in the dropzone.
 */
  function handleSetDropzoneState(show: boolean, image_url: string) {
    setDropzoneState({ visible: show, image_url });
  }


/**
 * Handles the drop event for a drag-and-drop operation.
 * Prevents the default behavior and processes each file dropped.
 *
 * @param {React.DragEvent<HTMLDivElement>} event - The drag event triggered by dropping files.
 */
  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  }

/**
 * Handles the file upload event, processes each selected file, and updates the dropzone state.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
 */
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  }

/**
 * Handles the drag over event for a div element.
 *
 * @param event - The drag event triggered when an element is dragged over the div.
 * @remarks This function prevents the default behavior of the drag over event.
 */
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

/**
 * Processes a file by checking if it already exists in the uploaded files list,
 * and if not, creates a new file object and detects its type.
 *
 * @param {File} file - The file to be processed.
 * @returns {Promise<void>} - A promise that resolves when the file processing is complete.
 *
 * @todo Implement error message when the file already exists.
 * @todo Implement user link to the uploaded file.
 * @todo Handle the case when the detected file type is a PDF.
 */
  async function processFile(file: File) {
    const alreadyExists = uploadedFiles.some(
      (uploadedFile) => uploadedFile.getInfo().name === file.name,
    );

    if (alreadyExists) {
      // TODO: Implement error message
      return;
    }

    // TODO: Implement user link to file uploaded.
    const newFile = FileUploaded.newFile(
      { username: "user" },
      URL.createObjectURL(file),
      file,
    );

    const detectedType = await FileUploaded.detectType(newFile.getInfo().path);
    if (typeof detectedType === "object" && detectedType.type === "pdf") {
      // TODO:  https://github.com/ai-cfia/fertiscan-frontend/blob/256-nextjs-test/src/app/captur/page.tsx
    } else {
      setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
    }
  }

/**
 * Handles the deletion of a file from the uploaded files list.
 *
 * @param {string} url - The URL of the file to be deleted.
 */
  function handleDelete(url: string) {
    setUploadedFiles(
      uploadedFiles.filter(
        (file) => file instanceof FileUploaded && file.getInfo().path !== url,
      ),
    );
  }

/**
 * Handles the image load event and calculates the fill percentage of the image
 * relative to its parent dimensions. If the width or height percentage of the
 * image is greater than or equal to 90%, it updates the dropzone state with the
 * maximum fill percentage. Otherwise, it sets the fill percentage to 0.
 *
 * @param {ImageLoadEvent} event - The image load event containing the image dimensions.
 */
  function handleImageLoad(event: ImageLoadEvent) {
    const { width } = event.target;

    const dropzoneElement = document.getElementById("dropzone");
    if (!dropzoneElement) {
      console.error("Dropzone element not found");
      return;
    }

    // Get the dimensions of the dropzone element
    const { width: parentWidth, height: parentHeight } = dropzoneElement.getBoundingClientRect();

    const parentDimensions: ParentDimensions = { width: parentWidth, height: parentHeight };
    const widthPercentage = (width / parentDimensions.width) * 100;

    if (widthPercentage >= 70 ) {
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
            id="dropzone"
            data-testid="dropzone"
            container
            justifyContent="center"
            alignContent="center"
            size={{ xs: 10, md: 7 }}
          >
            <Box
              sx={{
                display: "flex",
                position: "relative",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "3px dashed ",
                borderColor: theme.palette.secondary.main,
                borderRadius: 1,
                textAlign: "center",
                p: 1,
                backgroundSize: "contain",
                backgroundColor: "transparent",
                width: "90%",
                height: "90%",
                minHeight: { xs: "350px", md: "400px" },
                minWidth: "133.44px",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {dropzoneState.visible && dropzoneState.image_url ? (
                <Box
                data-testid="hovered-image"
                component="img"
                  src={dropzoneState.image_url}
                  alt="Uploaded file"
                  onLoad={(event: ImageLoadEvent) => handleImageLoad(event)}
                  sx={{
                    position: "absolute",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderColor: theme.palette.secondary.main,
                    width:
                      dropzoneState.fillPercentage &&
                      dropzoneState.fillPercentage >= 90
                        ? "80%"
                        : "auto",
                    height:
                      dropzoneState.fillPercentage &&
                      dropzoneState.fillPercentage >= 90
                        ? "80%"
                        : "auto",
                  }}
                />
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <CloudUpload
                    sx={{
                      color: theme.palette.secondary.main,
                      fontSize: "7rem",
                    }}
                  />
                  <Typography variant="h5" color={theme.palette.secondary.main}>
                    <b>Drag & Drop To Upload Files</b>
                  </Typography>
                  <Typography variant="h5" color={theme.palette.secondary.main}>
                    <b>OR</b>
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                  >
                    <b>Browse File</b>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,"
                      /*.pdf*/ multiple
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>
              )}
            </Box>
          </Grid2>
          <Grid2
            container
            size={{ xs: 10, md: 4 }}
            display={"flex"}
            alignContent="center"
          >
            <Box
              sx={{
                display: "flex",
                position: "relative",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid",
                borderColor: theme.palette.secondary.main,
                borderRadius: 1,
                textAlign: "center",
                p: 1,
                backgroundSize: "contain",
                backgroundColor: "transparent",
                width: "100%",
                height: "90%",
                minHeight: { xs: "350px", md: "400px" },
                overflowY: "auto",
                overflowX: "hidden",
                minWidth: "133.44px",
                // Styles for the scrollbar for Webkit browsers (Chrome, Safari, and newer Edge)
                "&::-webkit-scrollbar": {
                  width: "20px",
                  marginRight: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.text.primary,
                  borderRadius: "10px",
                  WebkitBackgroundClip: "content-box",
                  border: "6px solid transparent",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: uploadedFiles.length === 0 ? "50%" : "initial",
                  left: uploadedFiles.length === 0 ? "50%" : "initial",
                  transform:
                    uploadedFiles.length === 0
                      ? "translate(-50%, -50%)"
                      : "none",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent:
                    uploadedFiles.length === 0 ? "center" : "flex-start",
                  alignItems:
                    uploadedFiles.length === 0 ? "center" : "flex-start",
                  textAlign: "center",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  p: uploadedFiles.length !== 0 ? 2 : 0,
                }}
              >
                <Typography
                  variant="h5"
                  color={theme.palette.text.primary}
                  gutterBottom
                >
                  <b>
                    {" "}
                    {uploadedFiles.length > 0
                      ? "Uploaded files" + " (" + uploadedFiles.length + ")"
                      : "No uploaded files"}
                  </b>
                </Typography>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ width: "100%", alignItems: "center" }}
                >
                  {uploadedFiles.map((file, index) => (
                    <FileElement
                      key={index}
                      //handleRightClick={()=>console.log("handleRightClick")}
                      //handleCloseContextMenu={()=>console.log("handleCloseContextMenu")}
                      setDropZoneState={handleSetDropzoneState}
                      //contextMenuAnchor={()=>console.log("contextMenuAnchor")}
                      //setContextMenuAnchor={()=>console.log("setContextMenuAnchor")}
                      fileName={file.getInfo().name}
                      fileUrl={file.getInfo().path}
                      //handleRename={()=>console.log("(newName) => handleRename(index, newName)")}
                      handleDelete={() => {
                        handleDelete(file.getInfo().path);
                        setDropzoneState({ visible: false, image_url: null });
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid2>
          <Grid2
            size={{ xs: 10, md: 7 }}
            sx={{ display: { xs: "none", md: "flex" } }}
          ></Grid2>
          <Grid2 size={{ xs: 10, md: 4 }}>
            {uploadedFiles.length > 0 && (
              <Button
                data-testid="submit-button"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  width: "100%",
                  minWidth: "133.44px",
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
