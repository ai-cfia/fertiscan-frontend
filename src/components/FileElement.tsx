import {
  Divider,
  Grid2,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DropzoneState } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * FileElementProps interface to define the props for the FileElement component
 */
interface FileElementProps {
  setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
  fileName: string;
  fileUrl: string;
  handleDelete: (fileUrl: string) => void;
  onContextMenu: (event: React.MouseEvent, fileUrl: string) => void;
  isRenaming: boolean;
  handleRename: (newName: string) => void;
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
const FileElement: React.FC<
  FileElementProps & { handleDelete: (fileUrl: string) => void }
> = ({
  setDropzoneState,
  fileName,
  fileUrl,
  handleDelete,
  onContextMenu,
  isRenaming,
  handleRename,
}) => {
  const theme = useTheme();
  const { t } = useTranslation("homePage");
  const [hovered, setHovered] = useState(false);

  const extension = fileName.split(".").pop();
  const baseName = fileName.replace(`.${extension}`, "");
  const [newName, setNewName] = useState(baseName);

  const isValidObjectURL = (url: string) => {
    const pattern =
      /^(blob:+http:\/\/|https:\/\/)[a-zA-Z0-9\-_.]+(?:\.[a-zA-Z0-9\-_.]+)*(?::\d+)?\/[a-zA-Z0-9\-_.]+$/;
    return pattern.test(url);
  };

  const handleRenameSubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newName.trim() !== "") {
      handleRename(`${newName.trim()}.${extension}`);
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
        onContextMenu={(event) => onContextMenu(event, fileUrl)}
        className="relative h-full w-full min-h-[90px] flex items-center
                  justify-center overflow-hidden rounded border-2 border-neutral-600 bg-neutral-200"
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
          sx={{ borderRightWidth: 3 }} // className="border-r-2" dont work
        />
        <Grid2 size={80} className="relative flex items">
          {isRenaming ? (
            <div className="flex items-center">
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleRenameSubmit}
                autoFocus
                InputProps={{
                  endAdornment: `.${extension}`,
                  autoComplete: "off"
                }}
              />
            </div>
          ) : (
            <Typography
              variant="h6"
              color={theme.palette.text.primary}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-start pl-2"
            >
              {fileName}
            </Typography>
          )}
        </Grid2>
        { !isRenaming && hovered && (
          <IconButton
            edge="end"
            aria-label={t("fileElement.altText.deleteFileAlt")}
            style={{
              color: "black",
              position: "absolute",
              top: "-5px",
              right: 5,
            }}
            onClick={() => handleDelete(fileUrl)}
          >
            <DeleteIcon data-testid="delete" style={{ fontSize: "1.7rem" }} />
          </IconButton>
        )}
      </Grid2>
    </>
  );
};

export default FileElement;
