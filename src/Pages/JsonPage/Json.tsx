import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css"


function JsonPage(){
    const [loading, setLoading] = useState(true)
    const [form, setForm]=useState({})
    const [fetchError, setError]=useState<Error|null>(null)
    const location = useLocation();
    const file:File = location.state.data[0];
    console.log(file)
    
    const api_url = ""
    useEffect(()=>{
        const formData = new FormData()
        formData.append("file",file)
        fetch(api_url+"/upload",{
            method:'POST',
            headers:{

            }, 
            body:formData
        }).then((res:Response)=>{
            fetch(api_url+"/analyze",{
                method:'GET',
                headers:{

                }
            }).then((response:Response)=>{
                response.json().then((data)=>{
                    console.log(data)
                    setForm(data)
                    setLoading(false)
                }).catch(e=>{
                    setLoading(false)
                    setError(e)
                    console.log(e)
                })
            })
        })
    },[])
    return (
        <div>
            <div className={`loader-container ${loading?'active':''}`}>
                <div className="spinner"></div>
                <p>
                    Votre fichier est en cours d'analyse
                    Your file is being analyzed
                </p>
            </div>
            <pre>{(fetchError ? <p>{fetchError.message}</p> : JSON.stringify(form, null, 2) )}</pre>
        </div>
    );
}

export default JsonPage