"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import FileElement from "@/components/FileElement";
import FileUploaded from "@/classe/File";
import { DropzoneState } from "@/types/types"; // Adjust the import path as necessary
import { useTranslation } from "react-i18next";
import FileContextMenu from "@/components/FileContextMenu";

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
  setDropzoneState,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("homePage");
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    fileUrl: string;
  } | null>(null);
  const [renameFileUrl, setRenameFileUrl] = useState<string | null>(null);

  const handleDelete = (url: string) => {
    setUploadedFiles(
      uploadedFiles.filter(
        (file) => file instanceof FileUploaded && file.getInfo().path !== url,
      ),
    );
    setDropzoneState({ visible: false, imageUrl: null });
  };

  const handleRename = (newName: string) => {
    if (renameFileUrl) {
      setUploadedFiles(
        uploadedFiles.map((file) =>
          file.getInfo().path === renameFileUrl
            ? (() => { file.setName(newName); return file; })()
            : file,
        ),
      );
      setRenameFileUrl(null);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, fileUrl: string) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            fileUrl: fileUrl,
          }
        : null,
    );
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      if (
        contextMenu &&
        (event.clientX < contextMenu.mouseX - 50 ||
          event.clientX > contextMenu.mouseX + 250 ||
          event.clientY < contextMenu.mouseY - 50 ||
          event.clientY > contextMenu.mouseY + 250)
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      window.addEventListener("mousemove", handleMouseOut);
    } else {
      window.removeEventListener("mousemove", handleMouseOut);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseOut);
    };
  }, [contextMenu]);

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
                xs:min-h-[350px] md:min-h-[400px] overflow-y-auto overflow-x-hidden min-w-[133.44px]
               `}
      >
        <Box
          className={`absolute transform w-full h-full flex flex-col
                    ${
                      uploadedFiles.length === 0
                        ? "justify-center items-center p-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        : "justify-start items-start p-2 left-0 top-0 translate-x-none translate-y-none"
                    }
                    text-center max-w-full max-h-full object-contain `}
        >
          <Typography
            variant="h5"
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
                onContextMenu={handleContextMenu}
                isRenaming={renameFileUrl === file.getInfo().path}
                handleRename={handleRename}
              />
            ))}
          </Stack>
        </Box>
      </Box>
      {contextMenu !== null && (
        <FileContextMenu
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          handleClose={handleContextMenuClose}
          onDelete={() => handleDelete(contextMenu.fileUrl)}
          onRename={() => {
            setRenameFileUrl(contextMenu.fileUrl);
            handleContextMenuClose();
          }}
          onDeleteAll={() => {
            setUploadedFiles([]);
            setDropzoneState({ visible: false, imageUrl: null });
          }}
        />
      )}
    </Suspense>
  );
};

export default FileList;
