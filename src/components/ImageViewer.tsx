import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Box, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
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
    setZoomRefs((prevRefs) =>
      Array.from({ length: urls.length }, (_, i) => prevRefs[i] || null),
    );
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles, setZoomRefs, setImageUrls, setActiveIndex]);

  useEffect(() => {
    zoomRefs.forEach((ref) => ref?.resetTransform());
  }, [imageFiles, zoomRefs]);

  const handleInit = (index: number, ref: ReactZoomPanPinchRef) => {
    setZoomRefs((prevRefs) => {
      const newRefs = [...prevRefs];
      newRefs[index] = ref;
      return newRefs;
    });
  };

  return (
    <Box
      className="flex flex-col items-center justify-center size-full  "
      data-testid="image-viewer"
    >
      <Swiper
        slidesPerView={1}
        loop={false}
        speed={0}
        data-testid="swiper"
        className="size-full"
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        noSwiping
        noSwipingClass="no-swipe"
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} data-testid={`slide-${index + 1}`}>
            <Box className="no-swipe size-full">
              <TransformWrapper
                key={index}
                onInit={(ref) => handleInit(index, ref)}
                zoomAnimation={{ disabled: true, animationTime: 0 }}
                panning={{ velocityDisabled: true }}
                velocityAnimation={{ disabled: true }}
              >
                <TransformComponent
                  key={index}
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
                    key={index}
                    className="object-contain size-full"
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

      <ControlBar
        swiper={swiperInstance}
        zoomRefs={zoomRefs}
        activeIndex={activeIndex}
      />
    </Box>
  );
};

interface ControlBarProps {
  swiper: SwiperClass | null;
  zoomRefs: ReactZoomPanPinchRef[];
  activeIndex: number;
}

const ControlBar: React.FC<ControlBarProps> = ({
  swiper,
  zoomRefs,
  activeIndex,
}) => {
  const currentZoomRef = zoomRefs[activeIndex] ?? null;

  return (
    <Box
      className="flex items-center justify-center gap-4 p-4 flex-wrap"
      data-testid="control-bar"
    >
      <Tooltip title="Previous" disableHoverListener={activeIndex <= 0}>
        <span>
          <Button
            variant="contained"
            onClick={() => swiper?.slidePrev()}
            data-testid="prev-button"
            disabled={activeIndex <= 0}
          >
            <ArrowBackIosIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip
        title="Next"
        disableHoverListener={activeIndex >= zoomRefs.length - 1}
      >
        <span>
          <Button
            variant="contained"
            onClick={() => swiper?.slideNext()}
            data-testid="next-button"
            disabled={activeIndex >= zoomRefs.length - 1}
          >
            <ArrowForwardIosIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Zoom In" disableHoverListener={!currentZoomRef}>
        <span>
          <Button
            variant="contained"
            onClick={() => currentZoomRef?.zoomIn()}
            data-testid="zoom-in-button"
            disabled={!currentZoomRef}
          >
            <ZoomInIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Zoom Out" disableHoverListener={!currentZoomRef}>
        <span>
          <Button
            variant="contained"
            onClick={() => currentZoomRef?.zoomOut()}
            data-testid="zoom-out-button"
            disabled={!currentZoomRef}
          >
            <ZoomOutIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Reset zoom" disableHoverListener={!currentZoomRef}>
        <span>
          <Button
            variant="contained"
            onClick={() => zoomRefs.forEach((ref) => ref?.resetTransform())}
            data-testid="reset-button"
            disabled={!currentZoomRef}
          >
            <YoutubeSearchedForIcon />
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ImageViewer;
