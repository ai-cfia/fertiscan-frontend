"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Box, Button, TextareaAutosize } from "@mui/material";
import { TextData, ImageSize } from "@/types/types";
import TextOverlay from "@/components/textOverlay";
import MyZoomPanComponent from "@/components/textOverlay";

const UploadImagePage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [initialSize, setInitialSize] = useState<ImageSize | null>(null);
  const [currentSize, setCurrentSize] = useState<ImageSize | null>(null);
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [isTextareaHovered, setIsTextareaHovered] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
        const result = readerEvent.target?.result as string;
        setImageSrc(result);
        const img = new Image();
        img.onload = () => {
          const newSize = { width: img.width, height: img.height };
          setImageSize(newSize);
          setInitialSize(newSize);
          setCurrentSize(newSize);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const recalculateSizes = useCallback(() => {
    if (imageSrc) {
      const imgElement = document.getElementById(
        "uploaded-image",
      ) as HTMLImageElement;
      if (imgElement && initialSize) {
        const currentWidth = imgElement.clientWidth;
        const currentHeight = imgElement.clientHeight;
        setCurrentSize({ width: currentWidth, height: currentHeight });
        setScaleX(currentWidth / initialSize.width);
        setScaleY(currentHeight / initialSize.height);
      }
    }
  }, [imageSrc, initialSize]);

  useEffect(() => {
    recalculateSizes();
  }, [imageSrc, recalculateSizes]);

  useEffect(() => {
    const handleResize = () => {
      recalculateSizes();
    };

    const resizeObserver = new ResizeObserver(() => {
      recalculateSizes();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [recalculateSizes]);

  return (
    <Container className="flex full flex-row">
      <Box
        className="justify-center flex"
        sx={{
          alignItems: "center",
          borderRight: "1px solid black",
          marginRight: "10px",
        }}
      >
        {currentSize && (
          <p>
            Dimensions actuelles de l'image: {currentSize.width} x{" "}
            {currentSize.height} pixels <br />
            <br />
            Dimensions initiales de l'image: {initialSize?.width} x{" "}
            {initialSize?.height} pixels
          </p>
        )}
      </Box>
      <Box sx={{ my: 4, position: "relative" }} ref={containerRef}>
        {imageSrc && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "auto",
              display: "inline-block",
            }}
          >
            <MyZoomPanComponent
              imageUrl={imageSrc}
              textData={null}
              scaleX={scaleX}
              scaleY={scaleY}
              offsetX={1}
              offsetY={1}
            />
          </div>
        )}
        <Button variant="contained" component="label">
          Télécharger une image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>
      <Box>
        <TextareaAutosize
          minRows={3}
          className="border-2 border-gray-900 rounded-md p-2"
          style={{ width: "100%" }}
          onMouseEnter={() => setIsTextareaHovered(true)}
          onMouseLeave={() => setIsTextareaHovered(false)}
        />
      </Box>
    </Container>
  );
};

export default UploadImagePage;
