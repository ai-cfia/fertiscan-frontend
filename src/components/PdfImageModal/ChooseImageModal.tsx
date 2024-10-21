import React, { useState } from 'react';
import {
  Modal, Box, AppBar, Toolbar, Typography, IconButton, Grid, Checkbox, Backdrop, Fade, Button
} from '@mui/material';
import { FileUploaded } from '@/Classes/File/File';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '50%',
  bgcolor: '#05486C',
  boxShadow: 24,
  overflow: 'hidden',
};

interface ChooseImageModalProps {
  open: boolean;
  handleClose: () => void;
  images: FileUploaded[];
  onConfirm: (selectedImages: FileUploaded[]) => void;
}

const ChooseImageModal: React.FC<ChooseImageModalProps> = ({ open, handleClose, images, onConfirm }) => {
  const [selectedImages, setSelectedImages] = useState<FileUploaded[]>([]);

  const handleSelectImage = (selectedImage: FileUploaded) => {
    setSelectedImages(prevState =>
      prevState.includes(selectedImage) ? prevState.filter(img => img !== selectedImage) : [...prevState, selectedImage]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedImages);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <AppBar position="static" style={{ backgroundColor: '#05486C' }}>
            <Toolbar>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#05486C',
                  color: 'white',
                  '&:hover': { backgroundColor: '#ffffffcc' }
                }}
                onClick={handleConfirm}
                disabled={selectedImages.length === 0}
              >
                Confirm
              </Button>
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
          <Grid container direction="row" sx={{ overflowX: 'scroll', height: '100%', backgroundColor: '#05486C' }}>
            {images.map((fileUploaded, index) => (
              <Box key={index} sx={{ position: 'relative', margin: '4px' }}>
                <Box
                  component="img"
                  src={fileUploaded.getInfo().path} 
                  alt={`Thumbnail ${index + 1}`}
                  style={{ height: '200px', objectFit: 'cover', }}
                  onClick={() => handleSelectImage(fileUploaded)}
                />
                <Checkbox
                  checked={selectedImages.includes(fileUploaded)}
                  onChange={() => handleSelectImage(fileUploaded)}
                  sx={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    backgroundColor: '#C5C5C5',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  color="secondary"
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ChooseImageModal;