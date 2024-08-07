import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Json.css";
import { useTranslation } from "react-i18next";

function JsonPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [fetchError, setError] = useState<Error | null>(null);
  const location = useLocation();
  const files: File[] = location.state.data;
  const [uploadStarted, startUpload] = useState(false);
  const api_url = "https://shiny-goggles-75q6p5xj4wwfp6gg-5000.app.github.dev";
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const upload_all = async () => {
    const res = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      res.push(
        await fetch(api_url + "/upload", {
          method: "POST",

          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale",
            "Access-Control-Allow-Methods": "GET, POST",
          },
          body: formData,
        }),
      );
    }
    return res;
  };

  const poll_analyze = async () => {
    let data = await (
      await fetch(api_url + "/analyze", {
        method: "GET",
        headers: {},
      })
    ).json();
    while (data["Retry-after"]) {
      await sleep(data["Retry-after"] * 1000);
      data = await (
        await fetch(api_url + "/analyze", {
          method: "GET",
          headers: {},
        })
      ).json();
    }
    return data;
  };

  useEffect(() => {
    if (!uploadStarted) {
      startUpload(true);
      upload_all()
        .then(() => {
          poll_analyze()
            .then((data) => {
              setForm(data);
              setLoading(false);
            })
            .catch((e) => {
              setLoading(false);
              setError(e);
              console.log(e);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="${theme}">
      <div className={`loader-container ${loading ? "active" : ""}`}>
        <div className="spinner"></div>
        <p>{t("analyzingText")}</p>
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
