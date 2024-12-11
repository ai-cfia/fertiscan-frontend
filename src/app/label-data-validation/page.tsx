"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA } from "@/types/types";
import { processAxiosError } from "@/utils/common";
import { Inspection } from "@/utils/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";

function LabelDataValidationPage() {
  const { uploadedFiles } = useUploadedFilesStore();
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlertStore();

  useEffect(() => {
    const extractAndSave = () => {
      setLoading(true);
      const formData = new FormData();

      uploadedFiles.forEach((fileUploaded) => {
        const file = fileUploaded.getFile();
        formData.append("files", file);
      });

      const username = "";
      const password = "";
      const authHeader = "Basic " + btoa(`${username}:${password}`);

      axios
        .post("/api/extract-label-data", formData, {
          headers: { Authorization: authHeader },
        })
        .then((response) => {
          const extractedLabelData = response.data;
          setLabelData(extractedLabelData);

          formData.append("labelData", JSON.stringify(extractedLabelData));
          return axios.post("/api/inspections", formData, {
            headers: { Authorization: authHeader },
          });
        })
        .then((response) => {
          const inspection: Inspection = response.data;
          console.log("Inspection ID:", inspection.inspection_id);
        })
        .catch((error) => {
          showAlert(processAxiosError(error), "error");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    extractAndSave();
  }, [uploadedFiles, showAlert]);

  return (
    <LabelDataValidator
      files={uploadedFiles.map((file) => file.getFile())}
      initialLabelData={labelData}
      loading={loading}
    />
  );
}

export default LabelDataValidationPage;
