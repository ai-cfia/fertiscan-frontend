import React, { useState, useEffect, useRef } from "react";
import "./FileElement.css"
interface FileElementProps {
  key: number;
  file: File;
  position: number;
  onClick: (selected:boolean) => void; // Function to be called on click
  onDelete: ()=>void;
}

const FileElement: React.FC<FileElementProps> = ({ file, position, onClick, onDelete }) => {
  const [fileUrl, setFileUrl] = useState("");
  const fileCard = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setFileUrl(e?.target?.result as string || "");
    reader.readAsDataURL(file);
  }, [file]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default navigation
    const element = event.target as HTMLElement;
    if(element.className !== ("cross")){
      document.querySelectorAll(".file-element").forEach(div=>(div.id!=fileCard.current?.id && div.classList.remove("selected")))
      if(fileCard.current?.classList.contains("selected")){
        onClick?.(false);
        fileCard.current?.classList.remove("selected");
      }else{
        onClick?.(true);
        fileCard.current?.classList.add("selected");
      }
    }
  };

  const deleteImage = (event: React.MouseEvent<HTMLDivElement>)=>{
    event.preventDefault()
    onDelete();
  }

  return (
    <div ref={fileCard} className="file-element" id={"file_" + position} onClick={handleClick}>
      <img
        src={fileUrl}
        alt={file.name}
      />
      <p className="file-title black bold unselectable">{file.name}</p>
      <div className="cross" onClick={deleteImage}></div>
    </div>
  );
};

export default FileElement;
