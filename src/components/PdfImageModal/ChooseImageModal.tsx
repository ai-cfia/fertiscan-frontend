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
  width: '60%',
  height: '60%',
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

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images);
    }
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
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#05486C',
                  color: 'white',
                  marginLeft: '16px',
                  '&:hover': { backgroundColor: '#ffffffcc' }
                }}
                onClick={handleSelectAll}
              >
                {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
          <Grid container spacing={2} sx={{ p: 2, height: 'calc(100% - 64px)', overflowY: 'auto', backgroundColor: '#05486C' }}>
            {images.map((fileUploaded, index) => (
              <Grid item key={index} xs={12} sm={6}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={fileUploaded.getInfo().path}
                    alt={`Thumbnail ${index + 1}`}
                    sx={{
                      width: '75%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectImage(fileUploaded)}
                  />
                  <Checkbox
                    checked={selectedImages.includes(fileUploaded)}
                    onChange={() => handleSelectImage(fileUploaded)}
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#C5C5C5',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                    color="secondary"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ChooseImageModal;