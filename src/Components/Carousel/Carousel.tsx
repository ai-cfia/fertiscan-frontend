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
      newIdx = imgs.length - 1; // Si l'index est négatif, on passe à la dernière image
    } else if (idx >= imgs.length) {
      newIdx = 0; // Si l'index dépasse la longueur, on retourne à la première image
    }

    setCurrImg(newIdx); // Actualise l'index de l'image courante

    // S'assure que l'image sélectionnée est centrée
    scrollToImg(newIdx);
  };

  const scrollToImg = (idx: number) => {
    const imgRef = imgRefs.current[idx];
    if (imgRef && carouselRef.current) {
      // Calculer la largeur disponible pour le contenu visible dans le conteneur du carousel
      const visibleWidth = carouselRef.current.offsetWidth;

      // Calculer le décalage à appliquer pour centrer l'image
      const offset = imgRef.offsetLeft - carouselRef.current.offsetLeft;
      const centerOffset = offset - (visibleWidth / 2 - imgRef.offsetWidth / 2);

      // Défiler jusqu'à la nouvelle position calculée pour centrer l'image
      carouselRef.current.scrollTo({
        left: centerOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Effectue un défilement initial pour centrer l'image courante lors du chargement du composant
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
            key={index} // Les clés utilisent l'index pour s'assurer que chaque image est unique
            onClick={() => selectImg(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCarousel;
