import React, { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import ImageZoomInOut from "../ImageZoomInOut/ImageZoomInOut";
import { useTranslation } from "react-i18next";

interface CarouselProps {
  id:string;
  imgs: {
    url: string;
    title: string;
  }[];
}

const NewCarousel: React.FC<CarouselProps> = ({ id, imgs }) => {
  const { t } = useTranslation();
  const [currImg, setCurrImg] = useState<number>(0);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const selectImg = (idx: number) => {
    let newIdx = idx;
    if (idx < 0) {
      newIdx = imgs.length - 1;
    } else if (idx >= imgs.length) {
      newIdx = 0;
    }
    setCurrImg(newIdx);
    scrollToImg(newIdx);
  };

  const scrollToImg = (idx: number) => {
    let imgRef = imgRefs.current[idx];
    if (imgRef && carouselRef.current) {
      let visibleWidth = carouselRef.current.offsetWidth;
      let offset = imgRef.offsetLeft - carouselRef.current.offsetLeft;
      let centerOffset = offset - (visibleWidth / 2 - imgRef.offsetWidth / 2);
      carouselRef.current.scrollTo({
        left: centerOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToImg(currImg);
  }, [currImg]);

  return (
    <div id={id} className="carousel-wrapper">
      <div className="curr-img">
          <a className="prev" onClick={() => selectImg(currImg - 1)}>
            &#10094;
          </a>
        <ImageZoomInOut
          className="curr-img"
          imageUrl={imgs[currImg] ? imgs[currImg].url : ""}
          alt={t("noPicture")}
        />
          <a className="next" onClick={() => selectImg(currImg + 1)}>
            &#10095;
          </a>
      </div>
      <div className="carousel" ref={carouselRef}>
        {imgs.map((img, index) => (
          <img
            ref={(el) => (imgRefs.current[index] = el)}
            src={img.url}
            className={`carousel-img ${index === currImg ? " current" : ""}`}
            alt={img.title}
            key={index}
            onClick={() => selectImg(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCarousel;
