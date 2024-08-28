import "./Input.css";
import React, { useEffect, useRef, useState } from "react";
import Input from "../../Model/Input-Model";
import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import { FormClickActions } from "../../Utils/EventChannels.tsx";
import { useTranslation } from "react-i18next";
import TableTextarea from "./TableTextarea/TableTextarea";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface InputProps {
  inputInfo: Input;
  imgs: { title: string; url: string }[];
  propagateChange: (inputInfo: Input) => void;
  isLoading: boolean;
}

// updating data with useState is asynchronous yet takes a little time
// to avoid issues with unsynced data we use the setTimeout function
// after some tries, we found that 50ms is neither too short the changes have the time to be updated
// nore too long so the user is disturbed by the lack of changes after their action
const SYNC_TIMEOUT = 50;

const resizeTextarea = (textarea: HTMLElement | null) => {
  if (textarea) {
    if (textarea.classList.contains("list-input")) {
      const tas = textarea.getElementsByClassName("textarea");
      Array.from(tas).forEach((ta: Element) => {
        const toModify = ta as HTMLTextAreaElement;
        toModify.style.height = "auto";
        toModify.style.height = ta.scrollHeight + "px";
      });
    } else {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }
};

const InputComponent: React.FC<InputProps> = ({
  inputInfo,
  propagateChange,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [property, setProperty] = useState(inputInfo.property);
  const ref = useRef<HTMLElement | null>(null);
  const [lastWidth, setLastWidth] = useState(window.innerWidth);
  // eslint-disable-next-line
  const [_windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isExpanded, setIsExpanded] = useState(false);

  const textarea = {
    ref: ref,
    label: inputInfo.id,
  };

  const SyncChanges = (inputInfo: Input) => {
    // if property is approved then
    //        input isnt active and is disabled
    //        else input is active and not disabled
    setIsActive(inputInfo.property !== "approved");
    inputInfo.disabled = inputInfo.property === "approved";
    setProperty(inputInfo.property);
  };

  const setFocus = () => {
    console.log("focus");
    FormClickActions.emit("Focus", inputInfo);
  };
  const unsetFocus = () => {
    console.log("unfocus");
    FormClickActions.emit("UnFocus", inputInfo);
  };

  const handleStateChange = (inputInfo: Input) => {
    switch (inputInfo.property) {
      case "approved":
        inputInfo.property = "default";
        FormClickActions.emit("ModifyClick", inputInfo);
        setTimeout(() => {
          textarea.ref.current!.focus();
        }, SYNC_TIMEOUT);
        break;
      case "rejected":
        textarea.ref.current?.classList.remove("rejected");
        inputInfo.property = "approved";
        FormClickActions.emit("ApproveClick", inputInfo);
        break;
      case "default":
        inputInfo.property = "approved";
        FormClickActions.emit("ApproveClick", inputInfo);
        break;
    }
    SyncChanges(inputInfo);
    setTimeout(() => setIsActive(false), SYNC_TIMEOUT);
    propagateChange(inputInfo);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  const createSimpleInput = () => {
    return (
      <div className="single-textarea-container">
        <textarea
          id={inputInfo.id}
          ref={textarea.ref as React.RefObject<HTMLTextAreaElement>}
          value={(inputInfo.value as string[])[0]}
          disabled={inputInfo.disabled}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const current = event.target as HTMLTextAreaElement;
            resizeTextarea(current);
            inputInfo.value = [event.target.value];
            propagateChange(inputInfo);
            resizeTextarea(textarea.ref.current);
          }}
          style={{
            maxHeight: isExpanded ? "fit-content" : "97px",
            overflow: isExpanded ? "hidden" : "auto",
          }}
          // eslint-disable-next-line
          onClick={(_event) => {
            inputInfo.property = "modified";
            console.log("test");
            propagateChange({ ...inputInfo, property: "modified" });
          }}
          // eslint-disable-next-line
          onFocus={(_event: React.FocusEvent<HTMLTextAreaElement>) => {
            setProperty("modified");
            const updatedInputInfo = { ...inputInfo, property: "modified" };
            propagateChange(updatedInputInfo);
            setFocus();
          }}
          onInput={() => {
            resizeTextarea(textarea.ref.current);
          }}
          onBlur={unsetFocus}
          className={`textarea form-input ${inputInfo.property}`}
          rows={1}
        />
        {
          /* Show more button */
          textarea.ref.current && textarea.ref.current.scrollHeight > 97 && (
            <div className="show-more-container">
              <label className="open-icon" onClick={handleToggleExpand}>
                {isExpanded ? t("showLess") : t("showMoreButton")}
              </label>
            </div>
          )
        }
      </div>
    );
  };

  const createListInput = () => {
    return (
      <div id={inputInfo.id} className="list-input">
        <div
          ref={textarea.ref as React.RefObject<HTMLDivElement>}
          className={`textareas-wrapper form-input ${inputInfo.property}`}
        >
          {inputInfo.value.map((_, index) => (
            <TableTextarea
              index={index}
              inputInfo={inputInfo}
              propagateChange={propagateChange}
              setFocus={setFocus}
              unsetFocus={unsetFocus}
              resizeTextarea={resizeTextarea}
              resizeParent={() => {
                setTimeout(() => {
                  resizeTextarea(textarea.ref.current);
                }, SYNC_TIMEOUT);
              }}
            />
          ))}
          <div
            onClick={() => {
              (inputInfo.value as string[]).push("");
              propagateChange(inputInfo);
              setTimeout(() => {
                resizeTextarea(textarea.ref.current);
              }, SYNC_TIMEOUT);
            }}
            className={`textarea unselectable add-div ${inputInfo.disabled ? "disabled" : ""}`}
          >
            <strong>{t("clickNewButton")}</strong>
          </div>
        </div>
      </div>
    );
  };

  const adjustFontSize = (
    inputElement: HTMLInputElement,
    isWindowEnlarged: boolean | null,
  ) => {
    const maxWidth = (inputElement.parentElement as HTMLElement).offsetWidth;
    const actualWidth = inputElement.scrollWidth;
    const currentFontSize = parseFloat(
      window.getComputedStyle(inputElement).getPropertyValue("font-size"),
    );

    if (
      (!isWindowEnlarged && actualWidth >= maxWidth && currentFontSize > 7) ||
      (!isWindowEnlarged == null &&
        actualWidth >= maxWidth &&
        currentFontSize > 7)
    ) {
      // Réduction de la police si la fenêtre est réduite et que la largeur du contenu est supérieure à la largeur maximale autorisée.
      inputElement.style.fontSize = `${currentFontSize - 0.9}px`;
    } else if (
      (isWindowEnlarged && actualWidth < maxWidth && currentFontSize < 20) ||
      (isWindowEnlarged == null &&
        actualWidth < maxWidth &&
        currentFontSize < 20)
    ) {
      // Augmentation de la police si la fenêtre est agrandie et que la largeur du contenu est inférieure à la largeur maximale autorisée.
      inputElement.style.fontSize = `${Math.min(currentFontSize + 0.9, 20)}px`;
    }
  };

  const createObjectInput = () => {
    const keys = Object.keys(
      (inputInfo.value as { [key: string]: string }[])[0],
    );
    return (
      <div
        id={inputInfo.id}
        className={`object-input form-input ${inputInfo.property}`}
        ref={textarea.ref as React.RefObject<HTMLDivElement>}
      >
        <table>
          {keys.length==3 &&
            <colgroup>
              <col span={1} style={{ width: "45%" }} />
              <col span={1} style={{ width: "35%" }} />
              <col span={1} style={{ width: "10%" }} />
              <col span={1} style={{ width: "10%" }} />
            </colgroup>
          }
          {keys.length==2 &&
            <colgroup>
              <col span={1} style={{ width: "55%" }} />
              <col span={1} style={{ width: "35%" }} />
              <col span={1} style={{ width: "10%" }} />
            </colgroup>
          }
          <thead>
            {keys.map((key, index) => {
              return <th key={index}>{key}</th>;
                })}
          </thead>
          <tbody>
            {inputInfo.value.map((_, index) => {
              return (
                <tr key={index}>
                  {keys.map((key, keyIndex) => {
                    return (
                      <td>
                        <input
                          id={`${inputInfo.id}-${key}-${index}`}
                          type="text"
                          value={
                            (inputInfo.value[index] as { [key: string]: string })[
                              keys[keyIndex]
                              ]
                          }
                          disabled={inputInfo.disabled}
                          onChange={(event) => {
                            const newValue = {
                              ...(inputInfo.value[index] as {
                                [key: string]: string;
                              }),
                              [keys[keyIndex]]: event.target.value
                            };
                            inputInfo.value[index] = newValue;
                            propagateChange(inputInfo);
                          }}
                          onInput={(event) => {
                            const input = event.currentTarget;
                            adjustFontSize(input, null);
                          }}
                          onFocus={setFocus}
                          onBlur={unsetFocus}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <button
                      className={`delete-button ${inputInfo.disabled ? "disabled" : ""}`}
                      disabled={inputInfo.disabled}
                      onClick={() => {
                        if (inputInfo.value.length > 1) {
                          inputInfo.value.splice(index, 1);
                          propagateChange(inputInfo);
                          setTimeout(() => {
                            resizeTextarea(textarea.ref.current);
                          }, SYNC_TIMEOUT);
                        }
                      }}
                    >
                      <img
                        src={deleteIcon}
                        className={`delete-img ${inputInfo.disabled ? "disabled" : ""}`}
                        alt={t("approveButton")}
                        width="20"
                        height="20"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          onClick={() => {
            (inputInfo.value as { [key: string]: string }[]).push({
              [keys[0]]: "",
              [keys[1]]: "",
              [keys[2]]: "",
            });
            propagateChange(inputInfo);
            setTimeout(() => {
              resizeTextarea(textarea.ref.current);
            }, SYNC_TIMEOUT);
          }}
          className={`textarea unselectable add-div ${inputInfo.disabled ? "disabled" : ""}`}
        >
          <strong>{t("clickNewButton")}</strong>
        </div>
      </div>
    );
  };

  const inputCreator = () => {
    if (inputInfo.isInputObjectList) {
      return createObjectInput();
    } else if (inputInfo.isAlreadyTable) {
      return createListInput();
    } else {
      return createSimpleInput();
    }
  };

  FormClickActions.on("Rejected", (rej: Input) => {
    if (rej.id === inputInfo.id) {
      SyncChanges(inputInfo);
    }
  });

  useEffect(() => {
    FormClickActions.emit("SyncProgress", inputInfo);
    if (inputInfo.isAlreadyTable) {
      document
        .querySelectorAll(`#${inputInfo.id} textarea`)
        .forEach((textarea) => {
          resizeTextarea(textarea as HTMLElement);
        });
    } else {
      resizeTextarea(textarea.ref.current);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth !== lastWidth) {
        setWindowWidth(newWidth);

        const inputElements = textarea.ref.current?.querySelectorAll("input");
        inputElements?.forEach((inputElement) => {
          if (inputElement instanceof HTMLInputElement) {
            adjustFontSize(inputElement, newWidth > lastWidth);
          }
        });

        setLastWidth(newWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lastWidth, textarea.ref]);

  return (
    <div className="test-button">
      {isLoading ? (
        <>
          <div className="input-container">
            <Skeleton width={100} className="label-skeleton" />
            <div className={`textbox-container`}>
              <Skeleton height={40} className="textbox-skeleton" />
            </div>
          </div>
          <div className="button-container">
            <Skeleton width={40} className="skeleton-button" />
          </div>
        </>
      ) : (
        // When isLoading is false, render actual content
        <>
          <div className="input-container">
            <label htmlFor={inputInfo.id}>
              {inputInfo.label.replace(/_/gi, " ")} :
            </label>
            <div className={`textbox-container`}>{inputCreator()}</div>
          </div>
          <div className="button-container">
            <button
              className={`button ${isActive ? "active" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                handleStateChange(inputInfo);
              }}
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
        </>
      )}
    </div>
  );
};

export default InputComponent;
