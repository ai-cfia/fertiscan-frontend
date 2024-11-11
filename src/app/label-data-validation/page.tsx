"use client";
import ImageViewer from "@/components/ImageViewer";
import { Box, Button, Container } from "@mui/material";
import { useState } from "react";

function LabelDataValidationPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <Container
      className="flex flex-col h-screen max-w-[1920px]"
      maxWidth={false}
      data-testid="container"
    >
      <Box className="p-4 mt-4" data-testid="stepper">
        stepper
      </Box>

      <Box className="flex flex-col md:flex-row" data-testid="main-content">
        <Box
          className="flex w-full p-4 justify-center min-w-0 h-[500px]"
          data-testid="swiper-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        <Box
          className="flex w-full p-4 justify-center min-w-0 min-h-[500px]"
          data-testid="form-container"
        >
          <Box
            className="w-full h-[400px] p-4 text-center font-bold bg-gray-400"
            data-testid="form-placeholder"
          >
            Form Placeholder
          </Box>
        </Box>
      </Box>

      <Box className="flex justify-center mt-4">
        <Button variant="contained" onClick={openFileDialog}>
          Upload Images
        </Button>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    </Container>
  );
}

export default LabelDataValidationPage;
