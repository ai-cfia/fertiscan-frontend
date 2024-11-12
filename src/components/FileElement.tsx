import { DropzoneState } from "@/types";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Divider,
  Grid2,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

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
const FileElement: React.FC<
  FileElementProps & { handleDelete: (fileUrl: string) => void }
> = ({ setDropzoneState, fileName, fileUrl, handleDelete }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const isValidObjectURL = (url: string) => {
    const pattern =
      /^(blob:http:\/\/|https:\/\/[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)$/;
    return pattern.test(url);
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
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          minHeight: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "primary.main",
          backgroundColor: "background.default",
        }}
      >
        <Grid2
          size={20}
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isValidObjectURL(fileUrl) && (
            <img
              src={fileUrl}
              alt="uploaded file"
              style={{
                maxWidth: "100%",
                maxHeight: "90px",
                objectFit: "fill",
                padding: "5px",
              }}
            />
          )}
        </Grid2>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ color: theme.palette.primary.dark, borderRightWidth: 3 }}
        />
        <Grid2
          size={80}
          sx={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "start",
              marginLeft: "10px",
            }}
          >
            {fileName}
          </Typography>
        </Grid2>
        {hovered && (
          <IconButton
            edge="end"
            aria-label="delete"
            sx={{
              position: "absolute",
              top: -8,
              right: 3,
              color: "black",
              ":hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={() => handleDelete(fileUrl)}
          >
            <DeleteIcon data-testid="delete" sx={{ fontSize: "1.7rem" }} />
          </IconButton>
        )}
      </Grid2>
    </>
  );
};

export default FileElement;
