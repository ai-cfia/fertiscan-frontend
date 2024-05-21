import React from "react";

interface FileElementProps{
    file: File;
    position: number;
}

const FileElement: React.FC<FileElementProps> = ({file, position})=>{
    console.log(file)
    let fileUrl = "";
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile = e!.target!.result!;
      fileUrl = newFile as string
    };
    reader.readAsDataURL(file);
    return(
        <div className="file-element" id={"file_"+position}>
            <img src={fileUrl}></img>
        </div>
    )

}

export default FileElement