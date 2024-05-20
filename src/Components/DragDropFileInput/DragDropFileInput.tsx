import React, { useState, useRef  } from 'react';
import "./DragDropFileInput.css"
interface FileInputProps {
  sendChange: (files: FileList) => void;
}

const DragDropFileInput: React.FC<FileInputProps> = ({ sendChange }) => {
  
  const [dragActive, setDragActive] = useState(false);
  const fileInput = useRef(null);
  const [file, setFile] = useState("");

  const handleDrag = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer?.files;
    if (files) {
      handleFileChange(files);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>)=>{
    event.preventDefault();
    const input = fileInput.current! as HTMLInputElement;
    input.click();
  }

  const handleFileChange = (files: FileList)=>{
    if(files!.length>0){
      let reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target.result);
      }
      reader.readAsDataURL(files[0]);
      sendChange(files);
    } 
  }
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    const files = event!.target!.files!;
    handleFileChange(files);
  }

  return (
    <div>
      <input id="file-input" ref={fileInput} type="file" multiple onChange={onFileChange}/>
      <label
        htmlFor="file-input"
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`drag-drop-file-input ${dragActive ? 'active' : ''} ${file ? 'hasFile' : ''}`}
      >
        <img id="preview" alt="preview of the file" src={file} className={file ? 'active' : ''}></img>
      </label>
      <div className="drag-drop-inner">
        <p>Drag & drop your files here or</p>
        <button type="button" onClick={handleClick} >Browse Files</button>
      </div>
    </div>
  );
};

export default DragDropFileInput;