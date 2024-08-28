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
      console.log("Clicked" + label.inspection.id);
      navigate(`/label/${label.inspection.id}`);
    };
  };

  return (
    <div className="card" onClick={handleClick()}>
      <div className="company-grid">
        <p className="company-label">{t("company-name")}:</p>
        <p className="company-result">{label.company_info.company_name}</p>
      </div>
      <div className="fertilizer-grid">
        <p className="fertilizer-label">{t("fertilizer-name")}:</p>
        <p className="fertilizer-result">{label.label_info.product_name}</p>
      </div>
      <div className="registration-grid">
        <p className="registration-label">{t("registrationNumber")}:</p>
        <p className="registration-result">
            {t("not-define")}
        </p>
      </div>
      <div className="footer-grid">
        <div className="user-grid">
          <p className="user-label">{t("user")}:</p>
          <p className="user-result">{label.inspection.id}</p>
        </div>
        <div className="upload-grid">
          <p className="date-label">{t("date")}:</p>
          <p className="date-result">{label.inspection.updated_at}</p>
        </div>
      </div>
    </div>
  );
};

export default SavedLabelCard;
