import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css"
import { Trans } from 'react-i18next';

function JsonPage(){
    const [loading, setLoading] = useState(true)
    const [form, setForm]=useState({})
    const [fetchError, setError]=useState<Error|null>(null)
    const location = useLocation();
    const files:File[] = location.state.data;
    const [uploadStarted, startUpload] = useState(false);

    

    const api_url = "https://silver-space-parakeet-p9xgrj9j6v7fr6p5-5000.app.github.dev/"

    const upload_all = async ()=>{
        const res = []
        for(let i=0; i<files.length; i++){
            const formData = new FormData()
            formData.append("file", files[i])
            res.push(await fetch(api_url+"/upload",{
                method:'POST',
                headers:{
                    // if needed, add headers here
                }, 
                body:formData
            }))
        }
        return res
  };
  
    useEffect(() => {
        if (!uploadStarted) {
            startUpload(true);
            upload_all().then(() => {
                fetch(api_url + "/analyze", {
                    method: "GET",
                    headers: {},
                }).then((response: Response) => {
                    response
                    .json()
                    .then((data) => {
                        setForm(data);
                        setLoading(false);
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
                    <Trans>file_analyse</Trans>
                </p>
            </div>
            <pre>{(fetchError ? <p>{fetchError.message}</p> : JSON.stringify(form, null, 2))}</pre>
        </div>
    );
}

export default JsonPage;
