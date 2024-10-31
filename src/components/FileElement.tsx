import React, { useState } from "react";
import { Grid2, IconButton, Typography, useTheme, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
interface FileElementProps {
  setDropZoneState: (show: boolean, url: string) => void;
  fileName: string;
  fileUrl: string;
}

const FileElement: React.FC<
  FileElementProps & { handleDelete: (fileUrl: string) => void }
> = ({ setDropZoneState, fileName, fileUrl, handleDelete }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Grid2
        onMouseEnter={() => {setHovered(true); setDropZoneState(true, fileUrl)}}
        onMouseLeave={() => {setHovered(false); setDropZoneState(false, "")}}
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
        <Grid2 size={20} sx={{position: "relative", display:"flex", justifyContent:"center", alignItems:"center"}}>
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
          <Divider orientation="vertical" flexItem sx={{color:theme.palette.primary.dark, borderRightWidth: 3 }} />
          <Grid2 size={80} sx={{position: "relative", justifyContent:"center", alignItems:"center"}}>
                <Typography variant="h6"
                sx={{color:theme.palette.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                    }}>
                    {fileName}
                </Typography>
            </Grid2>
            {hovered &&
            <IconButton
                edge="end"
                aria-label="delete"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: 3,
                  color: "black",
                  ':hover': {
                    backgroundColor: "transparent",
                  },
                }}
                onClick={() => handleDelete(fileUrl)}
              >
                <DeleteIcon sx={{ fontSize: '1.7rem' }} />
        </IconButton>
    }
          </Grid2>
    </>
  );
};

export default FileElement;
