import React, { useEffect, useState } from "react";
import "./Modal.css";
import closeIcon from "../../assets/close_icon.png";
import Carousel from "../Carousel/Carousel";
import { useTranslation } from "react-i18next";

interface ModalProps {
  text: string;
  imgs: Image[]; // Array of Image objects
  handleTextChange: (event: {
    target: { value: React.SetStateAction<string> };
  }) => void;
  close: () => void;
  toRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface Image {
  url: string;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  text,
  handleTextChange,
  close,
  toRef,
  imgs,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const handleOverlayTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    text = event.target.value;
    handleTextChange(event);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLElement>) => {
    const element = event!.target as HTMLElement;
    if (
      element.className == "overlay active" ||
      element.className == "close-icon"
    ) {
      close();
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  useEffect(() => {
    const divElements = document.querySelectorAll(".card-content");

    divElements.forEach((div) => {
      if (isEditing) {
        div.classList.add("no-scrollBar");
      } else {
        div.classList.remove("no-scrollBar");
      }
    });
  }, [isEditing]);

  return (
    <div className="overlay" onClick={handleOverlayClick} ref={toRef}>
      <div className="pic-container">
        <Carousel imgs={imgs}></Carousel>
      </div>
      <div className="card">
        <img
          src={closeIcon}
          alt={t("closeCard")}
          className="close-icon"
          onClick={handleOverlayClick}
        />
        <div className="card-content">
          {isEditing ? (
            <textarea
              value={text} // Use the current text state value
              onChange={handleOverlayTextChange}
              style={{ width: "100%", height: "300px" }}
            />
          ) : (
            <div>
              {[...text.matchAll(/^(.*)$/gm)].map((value, idx) => (
                <p key={idx}>{value[0] || <br />}</p>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer">
          <button onClick={handleEditClick}>
            {isEditing ? t("saveButton") : t("modifyButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
