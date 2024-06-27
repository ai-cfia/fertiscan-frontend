import { StrictMode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import "./CapturPage.css";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";

function CapturPage() {
  const { t } = useTranslation();
  const [toShow, setShow] = useState("");
  const [Blobs, setBlobs] = useState<{blob:string, name:string}[]>([]); 
  const {state} = useContext(SessionContext);
  const {setState} = useContext(SetSessionContext);
  

  useEffect(()=>{
    setShow(state.data.pics[0]?.blob||"")
  })
  /**
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target! as HTMLInputElement;
    setForm({ ...form, [field.name]: field.value });
  };
  */
  const handlePhotoChange = (newFiles: File[]) => {
    if (newFiles!.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = e!.target!.result! as string;
        setShow(newFile);
        setState({...state, data:{pics:[...Blobs, {blob:newFile,name:newFiles[0]!.name}],form:{}}});
      };
      reader.readAsDataURL(newFiles[0]!);
    } else {
      setShow("");
    }
  };

  const handleSelectedChange = (selection: {blob:string, name:string} | null) => {
    if (selection) {
      setShow(selection.blob);
    } else {
      setShow("");
    }
  };

  const Submit = () => {
    setState({...state,state:"form"});
  };

  const handleDeletion = (toDelete: {blob:string, name:string}, wasShown: boolean) => {
    setBlobs(Blobs.filter((blob) => blob.name !== toDelete.name));
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
