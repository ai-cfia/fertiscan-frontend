"use client";
import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import type { DropzoneState } from "@/types/types";
import FileUploaded from "@/classe/File";
import { useTranslation } from "react-i18next";
import useAlertStore from "@/stores/alertStore";

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
}) => {
  const theme = useTheme();
  const { t: tHomePage } = useTranslation("homePage");
  const { t: tAlertBanner } = useTranslation("alertBanner");
  const { showAlert } = useAlertStore();

  const allowedImagesExtensions = [".png", ".jpg", ".jpeg"];

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const items = event.dataTransfer.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
          traverseFileTree(item);
        }
      }
    }
  }

  async function traverseFileTree(item: FileSystemEntry) {
    if (item.isFile) {
      const fileEntry = item as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        if (allowedImagesExtensions.some((ext) => file.name.endsWith(ext))) {
          processFile(file);
        }
      });
    } else if (item.isDirectory) {
      const dirEntry = item as FileSystemDirectoryEntry;
      const dirReader = dirEntry.createReader();
      dirReader.readEntries((entries: FileSystemEntry[]) => {
        for (let i = 0; i < entries.length; i++) {
          traverseFileTree(entries[i]);
        }
      });
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
      (uploadedFile) => uploadedFile.getInfo().name === file.name
    );

    if (alreadyExists) {
      showAlert(tAlertBanner("fileExists"), "error");
      return;
    }

    const newFile = FileUploaded.newFile(
      { username: "user" },
      URL.createObjectURL(file),
      file
    );

    const detectedType = await FileUploaded.detectType(newFile.getInfo().path);
    if (typeof detectedType === "object" && detectedType.type === "pdf") {
      showAlert(tAlertBanner("pdfNotSupported"), "info");
    } else {
      setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
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
          alt={tHomePage("altText.hoveredImageAlt")}
          className="absolute max-w-full max-h-full object-contain w-auto h-auto "
        />
      ) : (
        <Box className="text-center">
          <CloudUpload
            aria-label={tHomePage("dropzone.altText.CloudIconAlt")}
            style={{
              color: theme.palette.secondary.main,
              fontSize: "7rem",
            }}
          />
          <Typography  className="select-none" variant="h5" color={theme.palette.secondary.main}>
            <b>{tHomePage("dropzone.dragDrop")}</b>
          </Typography>
          <Typography className="select-none" variant="h5" color={theme.palette.secondary.main}>
            <b>{tHomePage("dropzone.or")}</b>
          </Typography>
          <Button className="select-none" variant="contained" component="label" color="secondary">
            <b>{tHomePage("dropzone.browseFile")}</b>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
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
