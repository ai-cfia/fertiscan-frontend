import { StrictMode, useState } from "react";
import "./HomePage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RenameModal from "../../Components/RenameModal/RenameModal";

function HomePage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [toShow, setShow] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file
  const [renameModalOpen, setRenameModalOpen] = useState(false); // State for modal visibility
  const [newFileName, setNewFileName] = useState(""); // State for the new file name
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFile = e!.target!.result! as string;
    setShow(newFile);
  };

  const handlePhotoChange = (newFiles: File[]) => {
    if (newFiles!.length > 0) {
      setFiles([...files, ...newFiles]);
      reader.readAsDataURL(newFiles[0]!);
    } else {
      setShow("");
    }
  };

  const handleSelectedChange = (selection: File | null) => {
    if (selection) {
      reader.readAsDataURL(selection);
    } else {
      setShow("");
    }
  };

  const navigate = useNavigate();
  const Submit = () => {
    navigate("/Form", { state: { data: files } });
  };

  const handleDeletion = (toDelete: File, wasShown: boolean) => {
    setFiles(files.filter((file) => file !== toDelete));
    if (wasShown) {
      setShow("");
    }
  };

  const handleRename = (newFile: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f === selectedFile ? newFile : f)) // Replace the old file with renamed file
    );
    setRenameModalOpen(false); // Close the rename modal
  };

  const handleRenameClick = (file: File) => {
    setRenameModalOpen(true); // Open the rename modal
    setNewFileName(file.name); // Set the initial name in the modal
    setSelectedFile(file); // Set the file to be renamed
  };

  function updateNewFileName(newName: string): void {
    setNewFileName(newName);
  }

  return (
    <StrictMode>
      <div className="App ${theme}">
        <div className="homePage-container">
        {renameModalOpen && selectedFile && (
          <RenameModal
            text={newFileName}
            file={selectedFile}
            handleRename={handleRename}
            close={() => setRenameModalOpen(false)}
            updateNewFileName={updateNewFileName}
        />
        )}
          <DragDropFileInput sendChange={handlePhotoChange} file={toShow} />
          <button className="submit-btn" type="submit" onClick={Submit}>
            {t("submitButton")}
          </button>
          <FileList
            files={files}
            onRenameClick={handleRenameClick}
            onSelectedChange={handleSelectedChange}
            propagateDelete={handleDeletion}
          />
        </div>
      </div>
    </StrictMode>
  );
}

export default HomePage;
