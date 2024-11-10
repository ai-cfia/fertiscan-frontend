"use client";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
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
        loop
        speed={0}
        data-testid="swiper"
        className="w-full bg-gray-50"
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        noSwiping
        noSwipingClass="no-swipe"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} data-testid={`slide-${index + 1}`}>
            <Image
              src={url}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-contain no-swipe"
              width={500}
              height={500}
              data-testid="image-slide"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <ControlBar swiper={swiperInstance} />
    </Box>
  );
};

interface ControlBarProps {
  swiper: SwiperClass | null;
}

const ControlBar: React.FC<ControlBarProps> = ({ swiper }) => {
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
    </Box>
  );
};

export default ImageViewer;
