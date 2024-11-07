"use client";
import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import FileElement from "@/components/FileElement";
import FileUploaded from '@/classe/File';
import { DropzoneState } from '@/types'; // Adjust the import path as necessary

/**
 * Props for the FileList component.
 *
 * @interface FileListProps
 */
interface FileListProps {
  uploadedFiles: FileUploaded[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploaded[]>>;
  setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
}

/**
 * FileList component displays a list of uploaded files with options to delete them.
 * It also handles the state of the dropzone.
 *
 * @component
 * @param {FileListProps} props - The properties for the FileList component.
 * @param {Array} props.uploadedFiles - An array of uploaded file objects.
 * @param {Function} props.setUploadedFiles - Function to update the uploaded files state.
 * @param {Function} props.handleSetDropzoneState - Function to set the state of the dropzone.
 *
 * @returns {JSX.Element} The rendered FileList component.
 */
const FileList: React.FC<FileListProps> = ({
  uploadedFiles,
  setUploadedFiles,
  setDropzoneState
}) => {
  const theme = useTheme();

  const handleDelete = (url: string) => {
    setUploadedFiles(
      uploadedFiles.filter(
        (file) => file instanceof FileUploaded && file.getInfo().path !== url,
      ),
    );
    setDropzoneState({ visible: false, imageUrl: null });
  };

  return (
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
        width: {xs:"90%", md:"100%"},
        height: "90%",
        minHeight: { xs: "350px", md: "400px" },
        overflowY: "auto",
        overflowX: "hidden",
        minWidth: "133.44px",
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
              setDropzoneState={setDropzoneState}
              fileName={file.getInfo().name}
              fileUrl={file.getInfo().path}
              handleDelete={() => handleDelete(file.getInfo().path)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default FileList;
