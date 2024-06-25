import "./Input.css";
import React, { useState } from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";

import Modal from "../Modal/Modal";

import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";

import { FormClickActions } from "../../Utils/EventChannels";
import { useTranslation } from "react-i18next";

interface InputProps {
  parent: Section;
  inputInfo: Input;
  textarea: React.MutableRefObject<HTMLTextAreaElement | null>;
  modal: React.MutableRefObject<HTMLDivElement | null>;
  imgs: { title: string; url: string }[];
  propagateChange: (inputInfo: Input) => void;
}

const MAX_CHAR_IN_ROW = 37;

const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
};

const InputComponent: React.FC<InputProps> = ({
  parent,
  inputInfo,
  textarea,
  modal,
  imgs,
  propagateChange,
}) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [property, setProperty] = useState(inputInfo.property);

  const SyncChanges = (inputInfo: Input) => {
    if (inputInfo.property === "approved") {
      setIsActive(false);
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
    } else if (inputInfo.property === "modified") {
      setIsActive(true);
      inputInfo.disabled = false;
      inputInfo.property = "modified";
      setProperty("modified");
    } else if (inputInfo.property === "default") {
      setIsActive(true);
      inputInfo.disabled = false;
      inputInfo.property = "default";
      setProperty("default");
    } else if (inputInfo.property === "rejected") {
      setIsActive(true);
      inputInfo.disabled = false;
      inputInfo.property = "rejected";
      textarea.current?.classList.add("rejected");
      setProperty("rejected");
    }
  };

  FormClickActions.on("Rejected", (rej: Input) => {
    if (rej.id === inputInfo.id) {
      SyncChanges(inputInfo);
    }
  });
  const handleStateChange = (inputInfo: Input) => {
    if (inputInfo.property === "approved") {
      console.log("from approved");
      setIsActive(true);
      inputInfo.disabled = false;
      inputInfo.property = "modified";
      setProperty("modified");
      FormClickActions.emit("ModifyClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);
    } else if (inputInfo.property === "modified") {
      console.log("from modified");
      setIsActive(false);
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      FormClickActions.emit("ApproveClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);
      textarea.current?.classList.remove("rejected");
    } else if (inputInfo.property === "default") {
      console.log("from default");
      setIsActive(true);
      FormClickActions.emit("ApproveClick", inputInfo);
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      setTimeout(() => setIsActive(false), 400);
    } else if (inputInfo.property === "rejected") {
      console.log("from rejected");
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      FormClickActions.emit("ApproveClick", inputInfo);
      textarea.current?.classList.remove("rejected");
    }
    propagateChange(inputInfo);
  };

  return (
    <div className="input-container">
      <label htmlFor={inputInfo.id}>
        {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
        {inputInfo.label.replace(/_/gi, " ")} :
      </label>
      <div className="textbox-container">
        <textarea
          id={inputInfo.id}
          ref={textarea}
          value={inputInfo.value}
          disabled={inputInfo.disabled}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const current = event.target as HTMLTextAreaElement;
            resizeTextarea(current);
            inputInfo.value = event.target.value;
            propagateChange(inputInfo);
          }}
          onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
            const current = event.target as HTMLTextAreaElement;
            resizeTextarea(current); // Added here
          }}
          className="text-box"
          rows={1}
        />
        <div className="button-container">
          <button
            className={`button ${isActive ? "active" : ""}`}
            onClick={() => handleStateChange(inputInfo)}
          >
            {property === "default" ? (
              <img
                src={acceptIcon}
                alt={t("approveButton")}
                width="20"
                height="20"
              />
            ) : property === "approved" ? (
              <img
                src={editIcon}
                alt={t("approveButton")}
                width="20"
                height="20"
              />
            ) : property === "modified" ? (
              <img
                src={acceptIcon}
                alt={t("modifyButton")}
                width="20"
                height="20"
              />
            ) : (
              <img
                src={acceptIcon}
                alt={t("approveButton")}
                width="20"
                height="20"
              />
            )}
          </button>
        </div>
      </div>
      {/* Show more functionality moved here for better separation */}
      {inputInfo.value.split("\n").length +
        inputInfo.value
          .split("\n")
          .map((line) => Math.floor(line.length / MAX_CHAR_IN_ROW))
          .reduce((sum, current) => sum + current) >
        3 && (
        <div className="show-more-container">
          <label
            className="open-icon"
            onClick={() => {
              modal.current?.classList.add("active");
            }}
          >
            {t("showMoreButton")}
          </label>
          <Modal
            toRef={modal}
            text={inputInfo.value}
            handleTextChange={(event: {
              target: { value: React.SetStateAction<string> };
            }) => {
              inputInfo.value = event.target.value.toString();
              propagateChange(inputInfo);
            }}
            imgs={imgs}
            close={() => {
              modal.current?.classList.remove("active");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InputComponent;
