import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css"
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();


function JsonPage(){
    const [loading, setLoading] = useState(true)
    const [form, setForm]=useState({})
    const [fetchError, setError]=useState<Error|null>(null)
    const location = useLocation();
    const files:File[] = location.state.data[0];
    const [uploadStarted, startUpload] = useState(false);

    
    const api_url = "http://localhost:5000"
    const upload_all = async ()=>{
        for(let i=0; i<files.length; i++){
            const formData = new FormData()
            formData.append("file", files[i])
            await fetch(api_url+"/upload",{
                method:'POST',
                headers:{
                    // if needed, add headers here
                }, 
                body:formData
            })
        }
    }
    useEffect(()=>{
        if(!uploadStarted){
            startUpload(true);
            upload_all().then(()=>{
                fetch(api_url+"/analyze",{
                    method:'GET',
                    headers:{
        
                    }
                }).then((response:Response)=>{
                    response.json().then((data)=>{
                        setForm(data)
                        setLoading(false)
                    }).catch(e=>{
                        setLoading(false)
                        setError(e)
                        console.log(e)
                    })
                })
            })
        }
    },[])
    return (
        <div>
            <div className={`loader-container ${loading?'active':''}`}>
                <div className="spinner"></div>
                <p>
                    {t("file_analyse")}
                </p>
            </div>
            <pre>{(fetchError ? <p>{fetchError.message}</p> : JSON.stringify(form, null, 2))}</pre>
        </div>
    );
}

export default JsonPage