import React, { useState, useRef  } from 'react';
import "./DragDropFileInput.css"
interface FileInputProps {
  onFileChange: (files: FileList) => void;
}

const DragDropFileInput: React.FC<FileInputProps> = ({ onFileChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInput = useRef(null);
  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer?.files;
    if (files) {
      onFileChange(files);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>)=>{
    event.preventDefault();
    const input = fileInput.current! as HTMLInputElement;
    console.log(input)
    input.click();
  }

  return (
    <div
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`drag-drop-file-input ${dragActive ? 'active' : ''}`}
    >
      <input ref={fileInput} type="file" multiple />
      <div className="drag-drop-inner">
        <p>Drag & drop your files here or</p>
        <button type="button">Browse Files</button>
      </div>
    </div>
  );
};

export default DragDropFileInput;