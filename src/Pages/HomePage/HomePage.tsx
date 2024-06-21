import { StrictMode, useState, useRef } from "react";
import "./HomePage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [toShow, setShow] = useState("");
  const [cameraMode, toggleCamera] = useState(false);
  const cameraSwitch = useRef<HTMLDivElement | null>(null);
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

  const handleCameraToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    toggleCamera(!cameraMode);
    if (cameraMode) {
      cameraSwitch.current!.classList.add("active");
    } else {
      cameraSwitch.current!.classList.remove("active");
    }
  };

  return (
    <StrictMode>
      <div className="App">
        <div className="homePage-container">
          <DragDropFileInput
            sendChange={handlePhotoChange}
            file={toShow}
            mode={cameraMode}
          />
          <button className="submit-btn" type="submit" onClick={Submit}>
            {t("submitButton")}
          </button>
          <div
            className={`switch ${cameraMode ? "active" : ""}`}
            id="camera-switch"
            ref={cameraSwitch}
            onClick={handleCameraToggle}
          >
            <label>
              {t("fileSelectionLabel")}
              <input type="checkbox" />
              <span className="lever"></span>
              {t("cameraLabel")}
            </label>
          </div>
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
