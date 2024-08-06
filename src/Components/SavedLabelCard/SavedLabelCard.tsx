//import BlobData from "../../../interfaces/BlobData";
import "./SavedLabelCard.css";
import { useTranslation } from "react-i18next";
import LabelPreview from "../../interfaces/LabelPreview";
import { useNavigate } from "react-router-dom";
interface SavedLabelCardProps {
  key: number;
  label: LabelPreview;
}

const SavedLabelCard: React.FC<SavedLabelCardProps> = ({ label }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    return () => {
      console.log("Clicked" + label.label_id);
      navigate(`/label/${label.label_id}`);
    };
  };

  return (
    <div className="card" onClick={handleClick()}>
      <div className="company-grid">
        <p className="company-label">{t("company-name")}:</p>
        <p className="company-result">{label.company_name}</p>
      </div>
      <div className="fertilizer-grid">
        <p className="fertilizer-label">{t("fertilizer-name")}:</p>
        <p className="fertilizer-result">{label.fertiliser_name}</p>
      </div>
      <div className="registration-grid">
        <p className="registration-label">{t("registrationNumber")}:</p>
        <p className="registration-result">
          {label.registration_number
            ? label.registration_number
            : t("not-define")}
        </p>
      </div>
      <div className="lot-number-grid">
        <p className="lot-number-label">{t("lotNumber")}:</p>
        <p className="lot-number-result">{label.lot_number}</p>
      </div>
      <div className="footer-grid">
        <div className="user-grid">
          <p className="user-label">{t("user")}:</p>
          <p className="user-result">{label.user}</p>
        </div>
        <div className="upload-grid">
          <p className="date-label">{t("date")}:</p>
          <p className="date-result">{label.upload_date}</p>
        </div>
      </div>
    </div>
  );
};

export default SavedLabelCard;
