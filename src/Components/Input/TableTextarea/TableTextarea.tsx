import React, { useRef, useState } from "react";
import Input from "../../../Model/Input-Model";
import { useTranslation } from "react-i18next";
import deleteIcon from "../../../assets/deleteIcon.svg";

interface TableTextareaProps {
  index: number;
  inputInfo: Input;
  propagateChange: (inputInfo: Input) => void;
  setFocus: () => void;
  unsetFocus: () => void;
  resizeTextarea: (current: HTMLTextAreaElement) => void;
  resizeParent: () => void;
}

const TableTextarea = ({
  index,
  inputInfo,
  propagateChange,
  setFocus,
  unsetFocus,
  resizeTextarea,
  resizeParent,
}: TableTextareaProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ref = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const handleToggleExpand = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
    resizeParent();
  };

  return (
    <div className="table-textarea-container" key={index}>
      <textarea
        value={(inputInfo.value as string[])[index]}
        disabled={inputInfo.disabled}
        ref={ref}
        style={{
          maxHeight: isExpanded ? "fit-content" : "97px",
          overflow: isExpanded ? "hidden" : "auto",
        }}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          const current = event.target as HTMLTextAreaElement;
          resizeTextarea(current);
          resizeParent();
          inputInfo.value[index] = event.target.value;
          propagateChange(inputInfo);
        }}
        onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
          const current = event.target as HTMLTextAreaElement;
          resizeTextarea(current);
          resizeParent();
        }}
        onFocus={setFocus}
        onBlur={unsetFocus}
        className="textarea"
        rows={1}
      />
      {
        /* Show more button */

        ref.current && ref.current!.scrollHeight > 97 && (
          <div className="show-more-container">
            <label className="open-icon" onClick={handleToggleExpand}>
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
            resizeParent();
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
};

export default TableTextarea;
