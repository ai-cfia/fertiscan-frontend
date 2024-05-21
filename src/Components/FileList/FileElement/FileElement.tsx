import React, { useState, useEffect } from "react";

interface FileElementProps {
  key: number;
  file: File;
  position: number;
  onClick: () => void; // Function to be called on click
}

const FileElement: React.FC<FileElementProps> = ({ file, position, onClick }) => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setFileUrl(e?.target?.result as string || "");
    reader.readAsDataURL(file);
  }, [file]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault(); // Prevent default navigation
    console.log("Image clicked! File name:", file.name);
  
    // Call the onClick prop passed from FileList if needed
    onClick?.();
  };

  return (
    <div className="file-element" id={"file_" + position}>
      <img
        src={fileUrl}
        alt={file.name}
        style={{ maxWidth: "300px", height: "auto" }}
        onClick={handleClick} // Call the handleClick function on click
      />
    </div>
  );
};

export default FileElement;
