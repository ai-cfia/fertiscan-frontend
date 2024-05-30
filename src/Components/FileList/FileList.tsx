import React, { useState, useRef } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
interface FileListProps {
  files: File[];
  onSelectedChange: (file:File|null)=>void;
  propagateDelete: (file:File, wasShown:boolean)=>void;
}

const FileList: React.FC<FileListProps> = ({ files, onSelectedChange, propagateDelete}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectFile = (file: File|null, index: number) => {
    setSelectedFile(file);
    onSelectedChange(file)
  };

  const handleDelete = (file: File, index:number)=>{
    if(selectedFile===file){
      setSelectedFile(null)
      propagateDelete(file, false)
    }else{
      propagateDelete(file, files[files.length-1]===file);
    }

  }

  return (
    <div className={`file-list ${files.length === 0 ? "empty" : ""}`}>
      <div className={`no-element ${files.length === 0 ? "active" : ""}`}>
       {t("no_element")}
      </div>
      {[...files].map((file: File, index: number, array: File[]) => (
        <FileElement
          key={index}
          file={file}
          position={index}
          onClick={(selected) => selected ? handleSelectFile(file, index): handleSelectFile(null,-1)}
          onDelete={()=>handleDelete(file, index)}
        />
      ))}
    </div>
  );
};

export default FileList;
