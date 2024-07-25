import React, { useEffect, useRef, useState } from "react";
//import BlobData from "../../../interfaces/BlobData";
import "./SavedLabelCard.css";
import { t } from "i18next";

interface SavedLabelCardProps {
  key: number;
}

const SavedLabelCard: React.FC<SavedLabelCardProps> = ({
}) => {
  const fileCard = useRef<null | HTMLDivElement>(null);
  const titleRef = useRef<null | HTMLParagraphElement>(null);

  // This useEffect will adjust the font size of the title to fit the container
  useEffect(() => {
    const adjustFontSize = () => {
      if (titleRef.current) {
        const maxWidth = fileCard.current ? fileCard.current.offsetWidth : 0;
        let fontSize = parseInt(
          window.getComputedStyle(titleRef.current).fontSize,
          10,
        );

        // Reduce font size till text fits the container or the font size reaches minimum threshold
        while (titleRef.current.scrollWidth > maxWidth && fontSize > 10) {
          fontSize--;
          titleRef.current.style.fontSize = `${fontSize}px`;
        }
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, []);

  const handleClick = () => {
    return () => {
      console.log("Clicked");
    };
  }

  return (
    <div
      ref={fileCard}
      className="card-test"
      onClick={handleClick()}>
      <div className="company-grid">
        <p className="company-label">{t("Company Name")}</p>
        <p className="company-result">/Company Name/</p>
      </div>
      <div className="fertilizer-grid">
        <p className="fertilizer-label">{t("fertilizer Name")}</p>
        <p className="fertilizer-result">/Fertilizer Name/</p>
      </div>
      <div className="registration-grid">
        <p className="registration-label">{t("registration Number")}</p>
        <p className="registration-result">/Registration Number/</p>
      </div>
      <div className="lot-number-grid">
        <p className="lot-number-label">{t("lot Number")}</p>
        <p className="lot-number-result">/Lot Number/</p>
      </div>
      <div className="footer-grid">
        <div className="user-grid">
          <p className="user-label">{t("User")}</p>
          <p className="user-result">/User/</p>
        </div>
        <div className="upload-grid">
          <p className="date-label">{t("Date")}</p>
          <p className="date-result">/Date/</p>
        </div>
      </div>
    </div>
  );
};

export default SavedLabelCard;
