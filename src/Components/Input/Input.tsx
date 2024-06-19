import "./Input.css";
import React, { useEffect, useState } from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";

import Modal from "../Modal/Modal";

import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";

import { FormClickActions } from "../../Utils/EventChannels";

interface InputProps {
  parent: Section;
  inputInfo: Input;
  textarea: React.MutableRefObject<HTMLTextAreaElement | null>;
  modal: React.MutableRefObject<HTMLDivElement | null>;
  imgs: {title:string, url:string}[];
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
  const [isActive, setIsActive] = useState(false);
  const [isDefaultFirstTime, setIsDefaultFirstTime] = useState(false);
  const [isJustChanged, setIsJustChanged] = useState(false);

  useEffect(() => {
    if(!isJustChanged){
    handleState(inputInfo)();
    }
    setIsJustChanged(false);
  },[inputInfo.property]);
  
  // Export the handleState function
  const handleState = (inputInfo: Input) => () => {
    if (inputInfo.property === "approved") {
      console.log("Approved");
      setIsActive(true);
      inputInfo.disabled = false;
      FormClickActions.emit("ModifyClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);
      setIsJustChanged(true);

    } else if (inputInfo.property === "modified") {
      console.log("Modified");
      setIsActive(false);
      setIsJustChanged(true);
      inputInfo.disabled = true;
      FormClickActions.emit("ApproveClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);

    }else if(inputInfo.property === "default" ){
      console.log("Default");
      if(isDefaultFirstTime){
        FormClickActions.emit("ApproveClick", inputInfo);
        inputInfo.disabled = true;
      }
      setIsDefaultFirstTime(true);
      setIsJustChanged(true);

    }else if(inputInfo.property === "rejected"){
      console.log("Disabled");
      inputInfo.disabled = false;
      FormClickActions.emit("Rejected", inputInfo);   
      setIsJustChanged(true);
    } 
  };

  if (inputInfo.value == "") return <></>;
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
            console.log(event);
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
            onClick={handleState(inputInfo)}>
            {
            inputInfo.property === 'default' ? (
              <img src={acceptIcon} alt="Défaut" width="20" height="20" />
            ) : inputInfo.property === 'approved' ? (
              <img src={editIcon} alt="Approuver" width="20" height="20" />
            ) : inputInfo.property === 'modified' ? (
              <img src={acceptIcon} alt="Modifié" width="20" height="20" />
            ) : (
              <img src={editIcon} alt="Rejeté" width="20" height="20" />
            )
          }
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
              Show more
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
