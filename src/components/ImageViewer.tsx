"use client";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import "swiper/css";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

interface ImageViewerProps {
  imageFiles: File[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageFiles }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );
  const [zoomRefs, setZoomRefs] = useState<ReactZoomPanPinchRef[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  return (
    <Box
      className="flex flex-col items-center justify-center max-w-full"
      data-testid="image-viewer"
    >
      <Swiper
        slidesPerView={1}
        loop={false}
        speed={0}
        data-testid="swiper"
        className="w-full bg-gray-50"
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        noSwiping
        noSwipingClass="no-swipe"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} data-testid={`slide-${index + 1}`}>
            <Box className="w-full h-full no-swipe">
              <TransformWrapper
                key={index}
                onInit={(ref) => {
                  setZoomRefs((prevRefs) => {
                    const newRefs = [...prevRefs];
                    newRefs[index] = ref;
                    return newRefs;
                  });
                }}
                zoomAnimation={{ disabled: true, animationTime: 0 }}
                panning={{ velocityDisabled: true }}
                velocityAnimation={{ disabled: true }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    className="w-full h-full object-contain"
                    src={url}
                    alt={`Slide ${index + 1}`}
                    width={500}
                    height={500}
                    data-testid="image-slide"
                  />
                </TransformComponent>
              </TransformWrapper>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <ControlBar swiper={swiperInstance} zoomRef={zoomRefs[activeIndex]} />
    </Box>
  );
};

interface ControlBarProps {
  swiper: SwiperClass | null;
  zoomRef: ReactZoomPanPinchRef | null;
}

const ControlBar: React.FC<ControlBarProps> = ({ swiper, zoomRef }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={2}
      mt={2}
      data-testid="control-bar"
    >
      <Button
        variant="contained"
        onClick={() => swiper?.slidePrev()}
        data-testid="prev-button"
      >
        Prev
      </Button>
      <Button
        variant="contained"
        onClick={() => swiper?.slideNext()}
        data-testid="next-button"
      >
        Next
      </Button>
      <Button
        variant="contained"
        onClick={() => zoomRef?.zoomIn()}
        data-testid="zoom-in-button"
        disabled={!zoomRef}
      >
        Zoom In
      </Button>
      <Button
        variant="contained"
        onClick={() => zoomRef?.zoomOut()}
        data-testid="zoom-out-button"
        disabled={!zoomRef}
      >
        Zoom Out
      </Button>
      <Button
        variant="contained"
        onClick={() => zoomRef?.resetTransform()}
        data-testid="reset-button"
        disabled={!zoomRef}
      >
        Reset
      </Button>
    </Box>
  );
};

export default ImageViewer;
