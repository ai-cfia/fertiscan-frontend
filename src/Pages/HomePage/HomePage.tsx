import "./HomePage.css";
import { useContext } from "react";
import { SessionContext } from "../../Utils/SessionContext";
import CapturPage from "../CapturPage/CapturPage";
import FormPage from "../FormPage/FormPage";
import ConfirmPage from "../ConfirmPage/ConfirmPage";

function HomePage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [toShow, setShow] = useState("");
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

  return (
    <StrictMode>
      <div className="App ${theme}">
        <div className="homePage-container">
          <DragDropFileInput sendChange={handlePhotoChange} file={toShow} />
          {files.length > 0 && (
            <button className="submit-btn" type="submit" onClick={Submit}>
              {t("submitButton")}
            </button>
          )}

          <FileList
            files={files}
            onSelectedChange={handleSelectedChange}
            propagateDelete={handleDeletion}
          />
        </div>
      </div>
    </StrictMode>
  );
  const { state } = useContext(SessionContext);
  if (state.state === "form") {
    return <FormPage />;
  } else if (state.state === "validation") {
    return <ConfirmPage />;
  }
  return <CapturPage />;
}

export default HomePage;
