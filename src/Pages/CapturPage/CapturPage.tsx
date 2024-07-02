import { StrictMode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import "./CapturPage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";

function CapturPage() {
  const { t } = useTranslation();
  const [toShow, setShow] = useState("");
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);

  useEffect(() => {
    setShow(state.data.pics[0]?.blob || "");
  }, [state.data.pics]);

  const handlePhotoChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const newBlob = e.target.result as string;
          setShow(newBlob);
          setState({
            ...state,
            data: {
              ...state.data,
              pics: [...state.data.pics, { blob: newBlob, name: newFiles[0].name }],
            },
          });
        }
      };
      reader.readAsDataURL(newFiles[0]);
    } else {
      setShow("");
    }
  };

  const handleSelectedChange = (selection: { blob: string; name: string } | null) => {
    if (selection) {
      setShow(selection.blob);
    } else {
      setShow("");
    }
  };

  const Submit = () => {
    setState({ ...state, state: "form" });
  };

  const handleDeletion = (toDelete: { blob: string; name: string }, wasShown: boolean) => {
    setState({
      ...state,
      data: {
        ...state.data,
        pics: state.data.pics.filter((pic) => pic.name !== toDelete.name),
      },
    });
    if (wasShown) {
      setShow("");
    }
  };

  return (
    <StrictMode>
      <div className={"App ${theme}"}>
        <div className="homePage-container">
          <DragDropFileInput sendChange={handlePhotoChange} file={toShow} />
          {state.data.pics.length > 0 && ( 
            <button className="submit-btn" type="button" onClick={Submit}>
              {t("submitButton")}
            </button>
          )}
          <FileList
            blobs={state.data.pics}
            onSelectedChange={handleSelectedChange}
            propagateDelete={handleDeletion}
          />
        </div>
      </div>
    </StrictMode>
  );
}

export default CapturPage;
