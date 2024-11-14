"use client";
import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import type { ImageLoadEvent, DropzoneState } from '@/types';
import FileUploaded from "@/classe/File";

/**
 * Props for the Dropzone component.
 *
 * @interface DropzoneProps
 */
interface DropzoneProps {
  uploadedFiles: FileUploaded[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploaded[]>>;
  dropzoneState: DropzoneState;
  setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
}

/**
 * Dropzone component for handling file uploads via drag-and-drop or file selection.
 *
 * @property {FileUploaded[]} uploadedFiles - An array of uploaded files.
 * @property {React.Dispatch<React.SetStateAction<FileUploaded[]>>} setUploadedFiles - Function to update the uploaded files state.
 * @property {DropzoneState} dropzoneState - State of the dropzone.
 * @property {React.Dispatch<React.SetStateAction<DropzoneState>>} setDropzoneState - Function to update the dropzone state.
 */
const Dropzone: React.FC<DropzoneProps> = ({
  uploadedFiles,
  setUploadedFiles,
  dropzoneState,
  setDropzoneState
}) => {
  const theme = useTheme();

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
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
    const widthPercentage = (width / parentWidth) * 100;

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
    <Box
      data-testid="dropzone"
      id="dropzone"
      className="relative flex flex-col justify-center items-center border-dashed border-4 border-sky-900 rounded text-center
                p-1 bg-transparent bg-contain w-[90%] h-[90%] xs:min-h-[350px] md:min-h-[400px] min-w-[133.44px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dropzoneState.visible && dropzoneState.imageUrl ? (
        <Box
          data-testid="hovered-image"
          component="img"
          src={dropzoneState.imageUrl}
          alt="Uploaded file"
          onLoad={handleImageLoad}
          className={`absolute max-w-full max-h-full object-contain ${ dropzoneState.fillPercentage && dropzoneState.fillPercentage >= 90
              ? 'w-[80%] h-[80%]'
              : 'w-auto h-auto'}`}
        />
      ) : (
        <Box className="text-center">
          <CloudUpload
            style={{
              color: theme.palette.secondary.main,
              fontSize: '7rem',
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
              /*.pdf*/
              multiple
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Dropzone;
