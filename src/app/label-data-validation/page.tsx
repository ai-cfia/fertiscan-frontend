"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA } from "@/types/types";
import {
  mapLabelDataOutputToLabelData,
  processAxiosError,
} from "@/utils/common";
import { Inspection, LabelDataOutput } from "@/utils/server/backend";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LabelDataValidationPage() {
  const { uploadedFiles } = useUploadedFilesStore();
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlertStore();
  const router = useRouter();

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      showAlert("No files uploaded.", "error");
      router.push("/");
      return;
    }

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
        .then(async (response) => {
          const labelDataOutput: LabelDataOutput = response.data;
          const labelData = mapLabelDataOutputToLabelData(labelDataOutput);
          console.log("Label data:", labelData);
          setLabelData(labelData);
          
          formData.append("labelData", JSON.stringify(labelDataOutput));
          return axios
            .post("/api/inspections", formData, {
              headers: { Authorization: authHeader },
            })
            .catch((error) => {
              showAlert(
                `Label data initial save failed: ${processAxiosError(error)}`,
                "error",
              );
              return null;
            });
        })
        .then((response) => {
          if (!response) {
            return;
          }
          const inspection: Inspection = response.data;
          console.log("Inspection ID:", inspection.inspection_id);
        })
        .catch((error) => {
          showAlert(
            `Label data extraction failed: ${processAxiosError(error)}`,
            "error",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };

    extractAndSave();
  }, [uploadedFiles, showAlert, router]);

  return (
    <LabelDataValidator
      files={uploadedFiles.map((file) => file.getFile())}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
    />
  );
}

export default LabelDataValidationPage;
