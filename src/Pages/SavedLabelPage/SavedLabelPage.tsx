//import { useTranslation } from "react-i18next";
import "./SavedLabelPage.css"; 
import SavedLabelCard from "../../Components/SavedLabelCard/SavedLabelCard";

const SavedLabelPage = () => {
    // For local development
    //const api_url = "http://localhost:5000";
    //const { t } = useTranslation();

return (
    <div className="saved-label-list">
        <SavedLabelCard key={1} />
        <SavedLabelCard key={2} />
        <SavedLabelCard key={3} />
        <SavedLabelCard key={4}/>
    </div>
);
}
export default SavedLabelPage;