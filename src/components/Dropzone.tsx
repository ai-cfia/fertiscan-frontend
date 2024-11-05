"use client";
import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import type { ImageLoadEvent, DropzoneState } from '@/types';

/**
 * Props for the Dropzone component.
 *
 * @interface DropzoneProps
 *
 * @property {function} handleFileUpload - Function to handle file upload events.
 * @property {function} handleDragOver - Function to handle drag over events.
 * @property {function} handleDrop - Function to handle drop events.
 * @property {function} handleImageLoad - Function to handle image load events.
 * @property {DropzoneState} dropzoneState - State of the dropzone.
 * @property {React.Dispatch<React.SetStateAction<DropzoneState>>} setDropzoneState - Function to update the dropzone state.
 */
interface DropzoneProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleImageLoad: (event: ImageLoadEvent) => void;
  dropzoneState: DropzoneState;
  setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
}

/**
 * Dropzone component for handling file uploads via drag-and-drop or file selection.
 */
const Dropzone: React.FC<DropzoneProps> = ({
  handleFileUpload,
  handleDragOver,
  handleDrop,
  handleImageLoad,
  dropzoneState,
  setDropzoneState
}) => {
  const theme = useTheme();

  return (
    <Box
      data-testid="dropzone"
      id="dropzone"
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '3px dashed ',
        borderColor: theme.palette.secondary.main,
        borderRadius: 1,
        textAlign: 'center',
        p: 1,
        backgroundSize: 'contain',
        backgroundColor: 'transparent',
        width: '90%',
        height: '90%',
        minHeight: { xs: '350px', md: '400px' },
        minWidth: '133.44px',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dropzoneState.visible && dropzoneState.image_url ? (
        <Box
          data-testid="hovered-image"
          component="img"
          src={dropzoneState.image_url}
          alt="Uploaded file"
          onLoad={handleImageLoad}
          sx={{
            position: 'absolute',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderColor: theme.palette.secondary.main,
            width:
              dropzoneState.fillPercentage &&
              dropzoneState.fillPercentage >= 90
                ? '80%'
                : 'auto',
            height:
              dropzoneState.fillPercentage &&
              dropzoneState.fillPercentage >= 90
                ? '80%'
                : 'auto',
          }}
        />
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <CloudUpload
            sx={{
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
