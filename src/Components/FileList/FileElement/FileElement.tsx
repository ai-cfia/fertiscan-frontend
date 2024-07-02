import React, { useState, useEffect, useRef } from "react";
import "./FileElement.css";

interface FileElementProps {
  key: number;
  blob: { blob: string; name: string };
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
  useEffect(() => {
    setFileUrl(blob.blob);
  }, [blob]);

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
      <p className="file-title black bold unselectable">{blob.name}</p>
      <div className="cross" onClick={deleteImage}></div>
    </div>
  );
};

export default FileElement;
