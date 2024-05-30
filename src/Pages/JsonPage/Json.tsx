import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css";

function JsonPage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [fetchError, setError] = useState<Error | null>(null);
  const location = useLocation();
  const files: File[] = location.state.data;
  const [uploadStarted, startUpload] = useState(false);

  const api_url = "https://shiny-goggles-75q6p5xj4wwfp6gg-5000.app.github.dev/";
  const upload_all = async () => {
    const res = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      res.push(
        await fetch(api_url + "/upload", {
          method: "POST",
          headers: {
            // if needed, add headers here
          },
          body: formData,
        }),
      );
    }
    return res;
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
            .catch((e) => {
              setLoading(false);
              setError(e);
              console.log(e);
            });
        });
      });
    }
  }, []);
  return (
    <div>
      <div className={`loader-container ${loading ? "active" : ""}`}>
        <div className="spinner"></div>
        <p>Votre fichier est en cours d'analyse Your file is being analyzed</p>
      </div>
      <pre>
        {fetchError ? (
          <p>{fetchError.message}</p>
        ) : (
          JSON.stringify(form, null, 2)
        )}
      </pre>
    </div>
  );
}

export default JsonPage;
