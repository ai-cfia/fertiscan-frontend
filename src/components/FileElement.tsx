import {
  Divider,
  Grid2,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { DropzoneState } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import useUploadedFilesStore from "@/stores/fileStore";

/**
 * FileElementProps interface to define the props for the FileElement component
 */
interface FileElementProps {
  setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
  fileName: string;
  fileUrl: string;
}

/**
 *
 * FileElement component to display the uploaded file
 * @param setDropZoneState: function to set the dropzone state
 * @param fileName: name of the file
 * @param fileUrl: url of the file
 * @param handleDelete: function to handle the deletion of the file
 *
 * @returns
 */
const FileElement: React.FC<FileElementProps> = ({
  setDropzoneState,
  fileName,
  fileUrl,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("homePage");
  const [hovered, setHovered] = useState(false);
  const { removeUploadedFile, renameUploadedFile } = useUploadedFilesStore();
  const [isRenaming, setIsRenaming] = useState(false);

  const extension = fileName.split(".").pop() || "";
  const baseName = fileName.replace(`.${extension}`, "");
  const [newName, setNewName] = useState(baseName);

  const isValidObjectURL = (url: string) => {
    const pattern =
      /^(blob:+http:\/\/|https:\/\/)[a-zA-Z0-9\-_.]+(?:\.[a-zA-Z0-9\-_.]+)*(?::\d+)?\/[a-zA-Z0-9\-_.]+$/;
    return pattern.test(url);
  };

  const handleRenameSubmit = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && newName.trim() !== "") {
      renameUploadedFile(fileUrl, `${newName.trim()}.${extension}`);
    }
  };

  return (
    <>
      <Grid2
        onMouseEnter={() => {
          setHovered(true);
          setDropzoneState({ visible: true, imageUrl: fileUrl });
        }}
        onMouseLeave={() => {
          setHovered(false);
          setDropzoneState({ visible: false, imageUrl: "" });
        }}
        className="relative h-full w-full min-h-[90px] flex items-center
          justify-center overflow-hidden rounded border-2 border-neutral-600 bg-neutral-200"
        data-testid={`file-element-${fileName}`}
      >
        <Grid2 size={20} className="relative flex justify-center items-center">
          {isValidObjectURL(fileUrl) && (
            <div>
              <Image
                className="!relative max-h-[90px] max-w-full p-1"
                src={fileUrl}
                alt={t("fileElement.altText.uploadedFileAlt")}
                fill={true}
                priority
                data-testid="logo-image"
              />
            </div>
          )}
        </Grid2>
        <Divider
          orientation="vertical"
          flexItem
          color={theme.palette.primary.dark}
          sx={{ borderRightWidth: 3 }}
        />
        <Grid2 size={80} className="relative flex items-center justify-between">
          {isRenaming ? (
            <div className="flex items-center w-full">
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleRenameSubmit}
                autoFocus
                placeholder="Enter file name"
                inputProps={{ autoComplete: "off" }}
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  width: "calc(100% - 45px)",
                }}
              />
              <Typography
                variant="body1"
                color={theme.palette.text.primary}
                style={{
                  whiteSpace: "nowrap",
                  marginRight: "5px",
                  flexShrink: 0,
                  width: "auto",
                }}
              >
                .{extension}
              </Typography>
              <IconButton
                edge="end"
                size="small"
                aria-label={t("fileElement.altText.renameFileAlt")}
                sx={{
                  color: "black",
                  backgroundColor: "#D3D3D3",
                  borderRadius: "5px",
                  marginRight: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#A9A9A9",
                  },
                }}
                onClick={() =>
                  renameUploadedFile(fileUrl, `${newName.trim()}.${extension}`)
                }
              >
                <CheckIcon style={{ fontSize: "1.7rem" }} />
              </IconButton>
            </div>
          ) : (
            <Typography
              variant="h6"
              color={theme.palette.text.primary}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-start pl-2"
              sx={{ maxWidth: { xs: "80%", md: "calc(100% - 75px)" } }}
              data-testid="file-name"
            >
              {fileName}
            </Typography>
          )}
        </Grid2>
        {!isRenaming && hovered && (
          <>
            <IconButton
              edge="end"
              aria-label={t("fileElement.altText.deleteFileAlt")}
              size="small"
              sx={{
                alignSelf: "center",
                display: "flex",
                maxHeight: "50%",
                color: "black",
                position: "absolute",
                borderRadius: "5px",
                right: { xs: 5, sm: 5 },
                top: { xs: 0, sm: "0" },
                bottom: { xs: "auto", sm: 10 },
                "&:hover": {
                  backgroundColor: "#A9A9A9",
                },
              }}
              onClick={() => removeUploadedFile(fileUrl)}
              data-testid="delete"
            >
              <DeleteIcon data-testid="delete" style={{ fontSize: "1.7rem" }} />
            </IconButton>
            <IconButton
              edge="end"
              size="small"
              aria-label={t("fileElement.altText.renameFileAlt")}
              sx={{
                alignSelf: "center",
                display: "flex",
                maxHeight: "50%",
                color: "black",
                position: "absolute",
                borderRadius: "5px",
                right: { xs: 6, sm: 45 },
                top: { xs: 50, sm: "0" },
                bottom: { xs: "auto", sm: 10 },
                "&:hover": {
                  backgroundColor: "#A9A9A9",
                },
              }}
              onClick={() => setIsRenaming(true)}
              data-testid="rename"
            >
              <CreateIcon style={{ fontSize: "1.7rem" }} />
            </IconButton>
          </>
        )}
      </Grid2>
    </>
  );
};

export default FileElement;
