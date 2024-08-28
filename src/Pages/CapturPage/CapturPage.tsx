import { StrictMode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DragDropFileInput from "../../Components/DragDropFileInput/DragDropFileInput";
import FileList from "../../Components/FileList/FileList";
import RenameModal from "../../Components/RenameModal/RenameModal";
import BlobData from "../../interfaces/BlobData";
import { SessionContext, SetSessionContext } from "../../Utils/SessionContext";
import {
  calculateStateObjectSize,
  STATE_OBJECT_SIZE_LIMIT,
} from "../../Utils/stateObject";
import "./CapturPage.css";
import { useAlert } from "../../Utils/AlertContext.tsx";

function CapturPage() {
  const { t } = useTranslation();
  const [toShow, setShow] = useState("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [blobToRename, setBlobToRename] = useState<BlobData | null>(null);
  const [, setNewFileName] = useState("");
  const { state } = useContext(SessionContext);
  const { setState } = useContext(SetSessionContext);
  const { showAlert } = useAlert();

  const handlePhotoChange = (newFiles: File[]) => {
    const newPics: BlobData[] = [];

    const readAndAddPhoto = (file: File, callback: () => void) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const newBlob = e.target.result as string;
          newPics.push({ blob: newBlob, name: file.name });

          if (newPics.length === newFiles.length) {
            callback();
          }
        }
      };
      reader.readAsDataURL(file);
    };

    newFiles.forEach((file) =>
      readAndAddPhoto(file, () => {
        setState({
          ...state,
          data: {
            ...state.data,
            pics: [...state.data.pics, ...newPics],
          },
        });
      }),
    );
  };

  const handleSelectedChange = (selection: BlobData | null) => {
    if (selection) {
      setShow(selection.blob);
    } else {
      setShow("");
    }
  };

  const Submit = () => {
    if (document.cookie.split(";").filter((item) => item.includes("username=")).length === 0) {
      showAlert(t("mustLogin"), "error");
    } else {
      setState({ ...state, state: "form" });
    }
  };

  const handleDeletion = (toDelete: BlobData, wasShown: boolean) => {
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

  const openRenameModal = (blob: BlobData) => {
    setBlobToRename(blob);
    setNewFileName(blob.name);
    setRenameModalOpen(true);
  };

  const handleRename = (updatedFileData: BlobData) => {
    const updatedPics = state.data.pics.map((pic) => {
      if (pic.blob === updatedFileData.blob) {
        return updatedFileData;
      }
      return pic;
    });

    setState({
      ...state,
      data: {
        ...state.data,
        pics: updatedPics,
      },
    });

    setRenameModalOpen(false);
  };

  const calculateCaptureCounter = () => {
    const pics = state.data.pics;
    const captureNumbers = pics
      .map((pic) => {
        const match = pic.name.match(/^capture(\d+)\.png$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((number) => number !== null) as number[];

    const maxNumber =
      captureNumbers.length > 0 ? Math.max(...captureNumbers) : 0;

    return maxNumber + 1;
  };

  function updateNewFileName(): void {
    if (blobToRename) {
      setNewFileName(blobToRename.name);
    }
  }

  useEffect(() => {
    setShow(state.data.pics[0]?.blob || "");
  }, [state.data.pics]);

  // Prevent scrolling useEffect
  useEffect(() => {
    if (renameModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [renameModalOpen]);

  return (
    <StrictMode>
      <div className={"App ${theme}"}>
        <div className="homePage-container">
          {renameModalOpen && blobToRename && (
            <RenameModal
              fileData={blobToRename}
              handleRename={handleRename}
              close={() => setRenameModalOpen(false)}
              updateNewFileName={updateNewFileName}
            />
          )}
          <DragDropFileInput
            sendChange={handlePhotoChange}
            file={toShow}
            calculateCaptureCounter={calculateCaptureCounter}
          />
          <button
            className="submit-btn"
            type="button"
            onClick={Submit}
            disabled={state.data.pics.length === 0}
          >
            {t("submitButton")}
          </button>
          <FileList
            blobs={state.data.pics}
            onSelectedChange={handleSelectedChange}
            propagateDelete={handleDeletion}
            onRenameClick={openRenameModal}
          />
          <label>{`${t("currentStateSize")} : ${calculateStateObjectSize(state).megabytes.toFixed(2)} / ${(STATE_OBJECT_SIZE_LIMIT / (1024 * 1024)).toFixed(2)} MB`}</label>
        </div>
      </div>
    </StrictMode>
  );
}

export default CapturPage;
