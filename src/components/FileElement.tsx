import React, { useState } from "react";
import {
  Grid2,
  IconButton,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DropzoneState } from "@/types";

/**
 * FileElementProps interface to define the props for the FileElement component
 * @param setDropZoneState: function to set the dropzone state
 * @param fileName: name of the file
 * @param fileUrl: url of the file
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

  return (
    <>
      <Grid2
        onMouseEnter={() => {
          setHovered(true);
          setDropzoneState({ visible: true, image_url: fileUrl});
        }}
        onMouseLeave={() => {
          setHovered(false);
          setDropzoneState({ visible: false, image_url: ""});
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
