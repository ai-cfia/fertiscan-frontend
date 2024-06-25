import { StrictMode, useState } from "react";
import "./HomePage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [toShow, setShow] = useState("");
  const reader = new FileReader();
  reader.onload = (e) => {
    const newFile = e!.target!.result! as string;
    setShow(newFile);
  };

  /**
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target! as HTMLInputElement;
    setForm({ ...form, [field.name]: field.value });
  };
  */
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

  return (
    <StrictMode>
      <div className="App ${theme}">
        <div className="homePage-container">
          <DragDropFileInput sendChange={handlePhotoChange} file={toShow} />
          <button className="submit-btn" type="submit" onClick={Submit}>
            {t("submitButton")}
          </button>

          <FileList
            files={files}
            onSelectedChange={handleSelectedChange}
            propagateDelete={handleDeletion}
          />
        </div>
      </div>
    </StrictMode>
  );
}

export default HomePage;
