"use client";
import React, { Suspense, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import FileElement from "@/components/FileElement";
import FileUploaded from "@/classe/File";
import { DropzoneState } from "@/types/types"; // Adjust the import path as necessary
import { useTranslation } from "react-i18next";

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

const FileList: React.FC<FileListProps> = ({
  uploadedFiles,
  setUploadedFiles,
  setDropzoneState,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("homePage");
  const [renameFileUrl, setRenameFileUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
    action: (() => void) | null;
  }>({ open: false, message: "", severity: "info", action: null });
  const [previousState, setPreviousState] = useState<FileUploaded[]>([]);

  useEffect(() => {
    setPreviousState([...uploadedFiles]); // Ensure the previous state copies the array whenever uploadedFiles change
  }, [uploadedFiles]);

  const handleDelete = (url: string) => {
    setPreviousState([...uploadedFiles]); // Make a copy of current state
    setUploadedFiles(
      uploadedFiles.filter(
        (file) => file instanceof FileUploaded && file.getInfo().path !== url,
      ),
    );
    setDropzoneState({ visible: false, imageUrl: null });
    setSnackbar({
      open: true,
      message: t("fileList.snackbar.delete"),
      severity: "success",
      action: handleUndo,
    });
  };

  const handleRename = (newName: string) => {
    if (renameFileUrl) {
      const newUploadedFiles = uploadedFiles.map((file) =>
        file.getInfo().path === renameFileUrl
          ? (() => {
              const newFile = new FileUploaded(file.getInfo(), file.getInfo().path, file.getFile());
              newFile.setName(newName);
              return newFile;
            })()
          : file,
      );
      setPreviousState([...uploadedFiles]); // Ensure the previous state copies the array before renaming
      setUploadedFiles(newUploadedFiles);
      setRenameFileUrl(null);
    }
  };

  const handleDeleteAll = () => {
    setPreviousState([...uploadedFiles]); // Make a copy of current state
    setUploadedFiles([]);
    setDropzoneState({ visible: false, imageUrl: null });
    setSnackbar({
      open: true,
      message: t("fileList.snackbar.deleteAll"),
      severity: "success",
      action: handleUndo,
    });
  };

  const handleUndo = () => {
    setUploadedFiles(previousState);
    setDropzoneState({ visible: false, imageUrl: null });
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Suspense fallback="loading">
      <Box
        sx={{
          "&::-webkit-scrollbar": {
            width: "10px",
            marginRight: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#075985", // This matches the border-sky-900 color
            borderRadius: "9999px", // This is 'rounded-full' in Tailwind
            border: "6px solid transparent", // This is border-6 in Tailwind
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
        className={`flex relative flex-col justify-center items-center border-2 border-sky-900
                rounded text-center p-1 bg-transparent bg-contain xs:w-[90%] md:w-[100%] h-[90%]
                xs:min-h-[350px] md:min-h-[400px] overflow-y-auto overflow-x-hidden min-w-[133.44px] md:max-w-[470px]
               `}  // do not modify md:max-w-[470px]
      >
        <Box
          className={`absolute transform w-full h-full flex flex-col justify-start items-start p-2 left-0 top-0 text-center max-w-full max-h-full object-contain `}
        >
          <Box
            className={`w-full flex flex-row items-center ${
              uploadedFiles.length == 0 ? "justify-center mt-[50%]" : "justify-start"
            }`}
          >
            <Typography
              variant="h6"
              color={theme.palette.text.primary}
              gutterBottom
            >
              <b>
                {uploadedFiles.length > 0
                  ? t("fileList.uploadedfiles") +
                    " (" +
                    uploadedFiles.length +
                    ")"
                  : t("fileList.noUploadedfiles")}
              </b>
            </Typography>
            {uploadedFiles.length > 1 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteAll}
                className="mb-4"
                sx={{
                  fontSize: "0.6rem",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                  marginLeft: "auto",
                }}
              >
                {t("fileList.deleteAll")}
              </Button>
            )}
          </Box>
          <Stack
            className="w-full flex flex-col items-center"
            direction="column"
            spacing={2}
          >
            {uploadedFiles.map((file, index) => (
              <FileElement
                key={index}
                setDropzoneState={setDropzoneState}
                fileName={file.getInfo().name}
                fileUrl={file.getInfo().path}
                handleDelete={() => handleDelete(file.getInfo().path)}
                isRenaming={renameFileUrl === file.getInfo().path}
                handleRename={handleRename}
                startRename={() => setRenameFileUrl(file.getInfo().path)}
              />
            ))}
          </Stack>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
          <Button color="primary" size="small" onClick={snackbar.action || (() => {})}>
            {t("fileList.snackbar.undo")}
          </Button>
        </Alert>
      </Snackbar>
    </Suspense>
  );
};

export default FileList;
