import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { ImageSize } from '@/types/types';
import json from '@/app/TestImagePage/test.json';
import 'swiper/css';
import 'swiper/css/pagination';
import useHoverStore from "@/stores/hoverStore";

interface ImageViewerProps {
  imageFiles: File[];
  textData: TextData[] | null;
}

interface TextData {
  content: string;
  polygon: number[];
  spans: { offset: number; length: number }[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageFiles, textData }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [zoomRefs, setZoomRefs] = useState<ReactZoomPanPinchRef[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialSize, setInitialSize] = useState<ImageSize | null>(null);
  const [currentSize, setCurrentSize] = useState<ImageSize | null>(null);
  const [hoveredParagraphIndex, setHoveredParagraphIndex] = useState<number | null>(null);
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const { hoveredText } = useHoverStore(); // Use the store


  if (!textData || textData.length === 0) {
    // Workaround for testing purposes
    textData = json.analyzeResult.paragraphs.map((paragraph) => ({
      content: paragraph.content,
      polygon: paragraph.boundingRegions[0].polygon,
      spans: paragraph.spans,
    }));
  }

  useEffect(() => {
    const urls: string[] = [];
    imageFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      urls.push(url);

      console.log(`Image ${index + 1} URL: `, url);

      const img = new window.Image();
      img.onload = () => {
        const newSize = { width: img.width, height: img.height };
        if (index === 0) {
          setInitialSize(newSize);
          setCurrentSize(newSize);
        }
      };
      img.src = url;
    });

    setImageUrls(urls);
    setZoomRefs((prevRefs) =>
      Array.from({ length: urls.length }, (_, i) => prevRefs[i] || null)
    );

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  useEffect(() => {
    zoomRefs.forEach((ref) => ref?.resetTransform());
  }, [imageFiles, zoomRefs]);

  const recalculateSizes = useCallback(() => {
    requestAnimationFrame(() => {
      const imgElement = imageRef.current;
      if (imgElement && initialSize) {
        const currentWidth = imgElement.clientWidth;
        const currentHeight = imgElement.clientHeight;

        setCurrentSize({ width: currentWidth, height: currentHeight });
        setScaleX(currentWidth / initialSize.width);
        setScaleY(currentHeight / initialSize.height);
      }
    });
  }, [initialSize]);

  useEffect(() => {
    const imgElement = imageRef.current;
    const observer = new MutationObserver(recalculateSizes);

    if (imgElement) {
      observer.observe(imgElement, {
        attributes: true,
        attributeFilter: ['style', 'width', 'height']
      });
    }

    const intervalId = setInterval(() => {
      recalculateSizes();
    }, 300);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [recalculateSizes]);


  const handleInit = (index: number, ref: ReactZoomPanPinchRef) => {
    setZoomRefs((prevRefs) => {
      const newRefs = [...prevRefs];
      newRefs[index] = ref;
      return newRefs;
    });
  };

  useEffect(() => {
    recalculateSizes();
  }, [imageUrls, recalculateSizes]);

  return (
    <Box className="flex flex-col items-center justify-center size-full" data-testid="image-viewer">
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
                  wrapperStyle={{ width: '100%', height: '100%' }}
                  contentStyle={{ width: '100%', height: '100%' }}
                >
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      ref={imageRef}
                      key={index}
                      width={500}
                      height={500}
                      className="object-contain size-full"
                      id="uploaded-image"
                      src={url}
                      alt={`Slide ${index + 1}`}
                      onError={() => alert('Failed to load image')}
                      style={{ width: '100%', height: 'auto' }}
                      data-testid="image-slide"
                    />
                    {textData.map((paragraph, i) => {
                      const points = paragraph.polygon.map((coord, idx) =>
                        idx % 2 === 0
                          ? { x: coord * scaleX + 1, y: paragraph.polygon[idx + 1] * scaleY + 1 }
                          : null
                      ).filter((point) => point !== null) as { x: number; y: number }[];

                      const minX = Math.min(...points.map((point) => point.x));
                      const minY = Math.min(...points.map((point) => point.y));
                      const maxX = Math.max(...points.map((point) => point.x));
                      const maxY = Math.max(...points.map((point) => point.y));
                      const width = maxX - minX;
                      const height = maxY - minY;

                      const isHovered = hoveredText && paragraph.content.includes(hoveredText);
                      if (isHovered) {
                        console.log(`Highlighting paragraph: ${paragraph.content}`);
                      }
                      return (
                        <div key={i}>
                          <div
                            style={{
                              position: 'absolute',
                              border: isHovered ? '3px solid blue' : '2px solid transparent',
                              left: minX,
                              top: minY,
                              width: width,
                              height: height,
                              opacity: isHovered ? 0.8 : 0.6,
                              display: 'block',
                            }}
                            onMouseEnter={() => setHoveredParagraphIndex(i)}
                            onMouseLeave={() => setHoveredParagraphIndex(null)}
                          />
                          {isHovered === true && (
                            <div
                              style={{
                                position: 'absolute',
                                left: minX,
                                top: maxY + 5,
                                backgroundColor: 'white',
                                border: '1px solid grey',
                                padding: '4px 8px',
                                zIndex: 1,
                                whiteSpace: 'pre-wrap',
                                maxWidth: '300px',
                              }}
                            >
                              {paragraph.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <ControlBar swiper={swiperInstance} zoomRefs={zoomRefs} activeIndex={activeIndex} />
    </Box>
  );
};

interface ControlBarProps {
  swiper: SwiperClass | null;
  zoomRefs: ReactZoomPanPinchRef[];
  activeIndex: number;
}

const ControlBar: React.FC<ControlBarProps> = ({ swiper, zoomRefs, activeIndex }) => {
  const currentZoomRef = zoomRefs[activeIndex] ?? null;

  return (
    <Box className="flex items-center justify-center gap-4 p-4 flex-wrap" data-testid="control-bar">
      <Tooltip title="Previous" disableHoverListener={activeIndex <= 0}>
        <span>
          <Button variant="contained" onClick={() => swiper?.slidePrev()} data-testid="prev-button" disabled={activeIndex <= 0}>
            <ArrowBackIosIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Next" disableHoverListener={activeIndex >= zoomRefs.length - 1}>
        <span>
          <Button variant="contained" onClick={() => swiper?.slideNext()} data-testid="next-button" disabled={activeIndex >= zoomRefs.length - 1}>
            <ArrowForwardIosIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Zoom In" disableHoverListener={!currentZoomRef}>
        <span>
          <Button variant="contained" onClick={() => currentZoomRef?.zoomIn()} data-testid="zoom-in-button" disabled={!currentZoomRef}>
            <ZoomInIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Zoom Out" disableHoverListener={!currentZoomRef}>
        <span>
          <Button variant="contained" onClick={() => currentZoomRef?.zoomOut()} data-testid="zoom-out-button" disabled={!currentZoomRef}>
            <ZoomOutIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Reset zoom" disableHoverListener={!currentZoomRef}>
        <span>
          <Button variant="contained" onClick={() => zoomRefs.forEach((ref) => ref?.resetTransform())} data-testid="reset-button" disabled={!currentZoomRef}>
            <YoutubeSearchedForIcon />
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default ImageViewer;
