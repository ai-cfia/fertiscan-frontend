import React, { useEffect, useRef, useState } from "react";
//import BlobData from "../../../interfaces/BlobData";
import "./SavedLabelCard.css";

interface FileElementProps {
  key: number;
  onClick: () => void;
}

const FileElement: React.FC<FileElementProps> = ({
  onClick,
}) => {
  const fileCard = useRef<null | HTMLDivElement>(null);
  const titleRef = useRef<null | HTMLParagraphElement>(null);

  // This useEffect will adjust the font size of the title to fit the container
  useEffect(() => {
    const adjustFontSize = () => {
      if (titleRef.current) {
        const maxWidth = fileCard.current ? fileCard.current.offsetWidth : 0;
        let fontSize = parseInt(
          window.getComputedStyle(titleRef.current).fontSize,
          10,
        );

        // Reduce font size till text fits the container or the font size reaches minimum threshold
        while (titleRef.current.scrollWidth > maxWidth && fontSize > 10) {
          fontSize--;
          titleRef.current.style.fontSize = `${fontSize}px`;
        }
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, []);

  const handleClick()
  return (
    <div
      ref={fileCard}
      className="test-card"
      onClick={handleClick()}>
    </div>
  );
};

export default FileElement;
