import React, { useEffect, useRef, useState } from "react";
import BlobData from "../../../interfaces/BlobData";
import "./FileElement.css";

interface FileElementProps {
  key: number;
  blob: BlobData;
  position: number;
  onClick: (selected: boolean) => void;
  onDelete: () => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FileElement: React.FC<FileElementProps> = ({
  blob,
  position,
  onClick,
  onDelete,
  onContextMenu,
}) => {
  const [fileUrl, setFileUrl] = useState("");
  const fileCard = useRef<null | HTMLDivElement>(null);
  const titleRef = useRef<null | HTMLParagraphElement>(null);

  useEffect(() => {
    setFileUrl(blob.blob);
  }, [blob]);

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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default navigation
    const element = event.target as HTMLElement;
    if (element.className !== "cross") {
      document
        .querySelectorAll(".file-element")
        .forEach(
          (div) =>
            div.id != fileCard.current?.id && div.classList.remove("selected"),
        );
      if (fileCard.current?.classList.contains("selected")) {
        onClick?.(false);
        fileCard.current?.classList.remove("selected");
      } else {
        onClick?.(true);
        fileCard.current?.classList.add("selected");
      }
    }
  };

  const deleteImage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <div
      ref={fileCard}
      className="file-element"
      id={"file_" + position}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      <img src={fileUrl} alt={blob.name} />
      <p
        ref={titleRef}
        className="file-title black bold unselectable"
        style={{ fontSize: "inherit" }}
      >
        {blob.name}
      </p>
      <div className="cross" onClick={deleteImage}></div>
    </div>
  );
};

export default FileElement;
