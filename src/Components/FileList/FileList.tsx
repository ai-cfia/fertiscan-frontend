import React, { useState } from "react";
import "./FileList.css";
import FileElement from "./FileElement/FileElement";
interface FileListProps{
    files: File[]
}

const FileList: React.FC<FileListProps>  = ({files})=>{

    return (
        <div className={`file-list ${files.length==0 ? 'empty' : ''}`}>
            <div className={`no-element ${files.length==0 ? 'active' : ''}`}>
                No element to show
            </div>
            {[...files].map(
                (file: File, index: number, array: File[]) => (
                    <FileElement file={file} position={index} key={index}/>
                )
            )}
        </div>
    );
}

export default FileList;