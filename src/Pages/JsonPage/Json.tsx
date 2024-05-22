import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css"


function JsonPage(){
    const [loading, setLoading] = useState(true)

    const location = useLocation();
    const file = location.state.data;

    return (
        <div>
            <div className={`loader-container ${loading?'active':''}`}>
                <div className="spinner"></div>
                <p>
                    Votre fichier est en cours d'analyse
                    Your file is being analyzed
                </p>
            </div>
            <pre>{JSON.stringify(location.state.data, null, 2) }</pre>
        </div>
    );
}

export default JsonPage