//import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import "./SavedListPage.css"; 
import SavedLabelCard from "../../Components/SavedLabelCard/SavedLabelCard";

const SavedListPage = () => {
    // For local development
    //const api_url = "http://localhost:5000";
    //const { t } = useTranslation();

    const [labels, setLabels] = useState([]);
            
    useEffect(()=>{
        if(process.env.REACT_APP_ACTIVATE_USING_JSON=="true"){
            fetch("/label_list.json")
            .then(response => response.json())
            .then(data => {
                setLabels(data);
            });
        }
    },[])
return (
    <div className="saved-label-list">
        {labels.map((label, index) => (
            <SavedLabelCard key={index} label={label} />
        ))}
    </div>
);
}
export default SavedListPage;