import "./Input.css";
import React, { useEffect, useRef, useState } from "react";
import Input from "../../Model/Input-Model";
import editIcon from "../../assets/edit1.svg";
import acceptIcon from "../../assets/acceptIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import { FormClickActions } from "../../Utils/EventChannels";
import { useTranslation } from "react-i18next";

interface InputProps {
  inputInfo: Input;
  imgs: { title: string; url: string }[];
  propagateChange: (inputInfo: Input) => void;
}

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
}) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [property, setProperty] = useState(inputInfo.property);
  const objectInputRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLElement | null>(null);
  const textareaRefs: React.MutableRefObject<HTMLTextAreaElement | null>[] = [];
  const [lastWidth, setLastWidth] = useState(window.innerWidth);
  // eslint-disable-next-line
  const [_windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isExpanded, setIsExpanded] = useState(false);

  const textarea = {
    ref: ref,
    label: inputInfo.id,
  };

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

  const handleStateChange = (inputInfo: Input) => {
    if (inputInfo.property === "approved") {
      setIsActive(true);
      inputInfo.disabled = false;
      inputInfo.property = "modified";
      setProperty("modified");
      FormClickActions.emit("ModifyClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);
    } else if (inputInfo.property === "modified") {
      setIsActive(false);
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      FormClickActions.emit("ApproveClick", inputInfo);
      setTimeout(() => setIsActive(false), 400);
      textarea.ref.current?.classList.remove("rejected");
    } else if (inputInfo.property === "default") {
      setIsActive(true);
      FormClickActions.emit("ApproveClick", inputInfo);
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      setTimeout(() => setIsActive(false), 400);
    } else if (inputInfo.property === "rejected") {
      inputInfo.disabled = true;
      inputInfo.property = "approved";
      setProperty("approved");
      FormClickActions.emit("ApproveClick", inputInfo);
      textarea.ref.current?.classList.remove("rejected");
    }
    propagateChange(inputInfo);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  const createSimpleInput = () => {
    const ref = textarea.ref as React.MutableRefObject<HTMLTextAreaElement>;
    return (
      <div className="single-textarea-container">
        <textarea
          id={inputInfo.id}
          ref={ref}
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
          onInput={() => {
            resizeTextarea(textarea.ref.current);
          }}
          className="textarea"
          rows={1}
        />
        {
          /* Show more button */
          ref.current && ref.current.scrollHeight > 97 && (
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
  // eslint-disable-next-line
  inputInfo.value.forEach((_) => {
    // eslint-disable-next-line
    textareaRefs.push(useRef<HTMLTextAreaElement | null>(null));
  });
    return (
      <div id={inputInfo.id} className="list-input">
        <div className="textareas-wrapper">
          {inputInfo.value.map((_, index) => {
            return (
              <div className="table-textarea-container" key={index}>
                <textarea
                  value={(inputInfo.value as string[])[index]}
                  disabled={inputInfo.disabled}
                  ref={textareaRefs[index]}
                  style={{
                    maxHeight: isExpanded ? "fit-content" : "97px",
                    overflow: isExpanded ? "hidden" : "auto",
                  }}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const current = event.target as HTMLTextAreaElement;
                    resizeTextarea(current);
                    inputInfo.value[index] = event.target.value;
                    propagateChange(inputInfo);
                  }}
                  onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
                    const current = event.target as HTMLTextAreaElement;
                    resizeTextarea(current);
                  }}
                  className="textarea"
                  rows={1}
                />
                {
                  /* Show more button */

                  textareaRefs[index].current &&
                    textareaRefs[index].current.scrollHeight > 97 && (
                      <div className="show-more-container">
                        <label
                          className="open-icon"
                          onClick={handleToggleExpand}
                        >
                          {isExpanded ? t("showLess") : t("showMoreButton")}
                        </label>
                      </div>
                    )
                }
                <button
                  className={`delete-button ${inputInfo.disabled ? "disabled" : ""}`}
                  disabled={inputInfo.disabled}
                  onClick={() => {
                    if (inputInfo.value.length > 1) {
                      inputInfo.value.splice(index, 1);
                      propagateChange(inputInfo);
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
              </div>
            );
          })}
          <div
            onClick={() => {
              (inputInfo.value as string[]).push("");
              propagateChange(inputInfo);
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
      <div id={inputInfo.id} className="object-input" ref={objectInputRef}>
        <table>
          <colgroup>
            <col span={1} style={{ width: "45%" }} />
            <col span={1} style={{ width: "35%" }} />
            <col span={1} style={{ width: "10%" }} />
            <col span={1} style={{ width: "10%" }} />
          </colgroup>
          <thead>
            {keys.map((key, index) => {
              return <th key={index}>{key}</th>;
            })}
          </thead>
          <tbody>
            {inputInfo.value.map((_, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input
                      id="input1"
                      type="text"
                      value={
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[0]
                        ]
                      }
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        const newValue = {
                          ...(inputInfo.value[index] as {
                            [key: string]: string;
                          }),
                          [keys[0]]: event.target.value,
                        };
                        inputInfo.value[index] = newValue;
                        propagateChange(inputInfo);
                      }}
                      onInput={(event) => {
                        const input = event.currentTarget;
                        adjustFontSize(input, null);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[1]
                        ]
                      }
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        const newValue = {
                          ...(inputInfo.value[index] as {
                            [key: string]: string;
                          }),
                          [keys[1]]: event.target.value,
                        };
                        inputInfo.value[index] = newValue;
                        propagateChange(inputInfo);
                      }}
                      onInput={(event) => {
                        const input = event.currentTarget;
                        adjustFontSize(input, null);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        (inputInfo.value[index] as { [key: string]: string })[
                          keys[2]
                        ]
                      }
                      disabled={inputInfo.disabled}
                      onChange={(event) => {
                        const newValue = {
                          ...(inputInfo.value[index] as {
                            [key: string]: string;
                          }),
                          [keys[2]]: event.target.value,
                        };
                        inputInfo.value[index] = newValue;
                        propagateChange(inputInfo);
                      }}
                      onInput={(event) => {
                        const input = event.currentTarget;
                        adjustFontSize(input, null);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className={`delete-button ${inputInfo.disabled ? "disabled" : ""}`}
                      disabled={inputInfo.disabled}
                      onClick={() => {
                        if (inputInfo.value.length > 1) {
                          inputInfo.value.splice(index, 1);
                          propagateChange(inputInfo);
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
    resizeTextarea(textarea.ref.current);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth !== lastWidth) {
        setWindowWidth(newWidth);

        const inputElements = objectInputRef.current?.querySelectorAll("input");
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
  }, [lastWidth]);

  return (
    <div className="test-button">
      <div className="input-container">
        <label htmlFor={inputInfo.id}>
          {inputInfo.label.replace(/_/gi, " ")} :
        </label>
        <div className="textbox-container">{inputCreator()}</div>
      </div>
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
  );
};

export default InputComponent;
