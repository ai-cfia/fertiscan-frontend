import React, { useState } from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";

import Modal from "../Modal/Modal";

import openIcon from "../../assets/dot-menu.svg";
import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";

interface InputProps {
  parent: Section;
  inputInfo: Input;
  textarea: React.MutableRefObject<HTMLTextAreaElement | null>;
  modal: React.MutableRefObject<HTMLDivElement | null>;
  propagateChange: Function;
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
  propagateChange,
}) => {
  const [isActive, setIsActive] = useState(false);

  //Need to be modified to "approve" but color dont work
  const handleClick_Modify = (inputInfo: any) => () => {
    console.log("Approved: ", inputInfo.label);
    setIsActive(true);
    inputInfo.state = "approved";
    inputInfo.disabled = false;
    inputInfo.approved = true;
    propagateChange(inputInfo);
    setTimeout(() => setIsActive(false), 400);
  };

  //Need to be modified to "modified" but color dont work
  const handleClick_Approve = (inputInfo: any) => () => {
    console.log("modified: ", inputInfo.label);
    setIsActive(true);
    inputInfo.state = "modified";
    inputInfo.disabled = true;
    inputInfo.approved = false;
    propagateChange(inputInfo);
    setTimeout(() => setIsActive(false), 400);
  };

  if (inputInfo.value == "") return <></>;
  return (
    <div className="input-container">
      <label htmlFor={parent.label + "-" + inputInfo.label}>
        {parent.label.charAt(0).toUpperCase() + parent.label.slice(1)}{" "}
        {inputInfo.label.replace(/_/gi, " ")} :
      </label>
      <div className="textbox-container">
        <textarea
          id={parent.label + "-" + inputInfo.label}
          ref={textarea}
          value={inputInfo.value}
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
            onClick={handleClick_Modify(inputInfo)}
          >
            <img src={acceptIcon} alt="Modifier" width="20" height="20" />
          </button>
          <button
            className={`button ${isActive ? "active" : ""}`}
            onClick={handleClick_Approve(inputInfo)}
          >
            <img src={editIcon} alt="Modifier" width="20" height="20" />
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
            imgs={[]}
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
