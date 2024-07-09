import "./Input.css";
import React, { useRef, useState } from "react";
import Input from "../../Model/Input-Model";
import Section from "../../Model/Section-Model";

import Modal from "../Modal/Modal";

import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";

import { FormClickActions } from "../../Utils/EventChannels";
import { useTranslation } from "react-i18next";

interface InputProps {
  parent: Section;
  inputInfo: Input;
  imgs: { title: string; url: string }[];
  propagateChange: (inputInfo: Input) => void;
}


const MAX_CHAR_IN_ROW = 37;

const resizeTextarea = (textarea: HTMLElement | null) => {
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
};

const InputComponent: React.FC<InputProps> = ({
  parent,
  inputInfo,
  imgs,
  propagateChange,
}) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [property, setProperty] = useState(inputInfo.property);

  const modal = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const textarea = {
      ref: ref,
      label:inputInfo.id
  }
  
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
      textarea.ref.current?.classList.add("rejected");
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
      textarea.ref.current?.classList.remove("rejected");
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
      textarea.ref.current?.classList.remove("rejected");
    }
    propagateChange(inputInfo);
  };

  const createModal = (idx:number) => {
    return (inputInfo.value[idx] as string).split("\n").length +
      (inputInfo.value[idx] as string)
        .split("\n")
        .map((line:string) => Math.floor(line.length / MAX_CHAR_IN_ROW))
        .reduce((sum:number, current:number) => sum + current) >
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
          text={inputInfo.value[idx] as string}
          handleTextChange={(event: {
            target: { value: React.SetStateAction<string> };
          }) => {
            inputInfo.value[idx] = event.target.value.toString();
            propagateChange(inputInfo);
          }}
          imgs={imgs}
          close={() => {
            modal.current?.classList.remove("active");
          }}
        />
      </div>
    )
  }

  const createSimpleInput = () => {
    return (
      <div className="single-textarea-container">
        <textarea
          id={inputInfo.id}
          ref={textarea.ref as React.MutableRefObject<HTMLTextAreaElement>}
          value={(inputInfo.value as string[])[0]}
          disabled={inputInfo.disabled}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const current = event.target as HTMLTextAreaElement;
            resizeTextarea(current);
            inputInfo.value = [event.target.value];
            propagateChange(inputInfo);
          }}
          onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
            const current = event.target as HTMLTextAreaElement;
            resizeTextarea(current); // Added here
          }}
          className="text-box"
          rows={1}
        />
        {createModal(0)}
      </ div>
    )
  }

  
  const createListInput = () => {
    return (
      <div id={inputInfo.id} className="list-input" ref={textarea.ref as React.MutableRefObject<HTMLDivElement>}>
        <div className="textareas-wrapper">
          {
            inputInfo.value.map((_,index)=>{
            return (
            <div className="single-textarea-container" key={index}>
              <textarea
                value={(inputInfo.value as string[])[index]}
                disabled={inputInfo.disabled}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const current = event.target as HTMLTextAreaElement;
                  resizeTextarea(current);
                  inputInfo.value[index] = event.target.value;
                  propagateChange(inputInfo);
                }}
                onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
                  const current = event.target as HTMLTextAreaElement;
                  resizeTextarea(current); // Added here
                }}
                className="text-box"
                rows={1}
              />
              <a className="delete-button">
                <img
                  src={deleteIcon}
                  alt={t("approveButton")}
                  width="20"
                  height="20"
                  onClick={() => {
                    inputInfo.value.splice(index, 1);
                    propagateChange(inputInfo);
                  }}
                />
              </a>
              {createModal(index)}
            </div>
            )})
          }
          <div onDoubleClick={()=>{
              (inputInfo.value as string[]).push(""); // Explicitly type inputInfo.value as string[]
              propagateChange(inputInfo);
            }} className="textarea unselectable">
              {t("DoubleClickNewButton")}
          </div>
        </div>
      </div>
    )
  }
  const createObjectInput = () => {
    const keys = Object.keys((inputInfo.value as {}[])[0]);
    return (
      <div id={inputInfo.id} className="object-input" ref={textarea.ref as React.MutableRefObject<HTMLDivElement|null>}>
        <table>
            <colgroup>
              <col span={1} style={{width:"40%"}}/>
              <col span={1} style={{width: "20%"}}/>
              <col span={1} style={{width: "15%"}}/>
            </colgroup>
          <thead>
              {keys.map((key, index) => {
                return <th key={index}>{key}</th>;
              })}
          </thead>
          <tbody>
            {inputInfo.value.map((obj, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input
                    id="input1"
                      type="text"
                      value={(inputInfo.value[index] as {[key:string]:string})[keys[0]]}
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        (obj as any)[keys[0]] = event.target.value;
                        propagateChange(inputInfo);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={(inputInfo.value[index] as {[key:string]:string})[keys[1]]}
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        (obj as any)[keys[1]] = event.target.value;
                        propagateChange(inputInfo);
                      }}
                    />
                  </td>
                  <td>
                  <input
                      type="text"
                      value={(inputInfo.value[index] as {[key:string]:string})[keys[2]]}
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        (obj as any)[keys[2]] = event.target.value;
                        propagateChange(inputInfo);
                      }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
            <div onDoubleClick={()=>{
              (inputInfo.value as string[]).push(""); // Explicitly type inputInfo.value as string[]
              propagateChange(inputInfo);
            }} className="textarea unselectable">
              {t("DoubleClickNewButton")}
          </div>
        </table>
      </div>
    )
  }

  const inputCreator = ()=>{
    if(inputInfo.isInputObjectList){
      return createObjectInput()
    }else if(inputInfo.isAlreadyTable){
      return createListInput()
    }else{
      return createSimpleInput()
    }
  }

  return (
    <div className="input-container">
      <label htmlFor={inputInfo.id}>
        {inputInfo.label.replace(/_/gi, " ")} :
      </label>
      <div className="textbox-container">
        {inputCreator()}
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
      
    </div>
  );
};

export default InputComponent;
