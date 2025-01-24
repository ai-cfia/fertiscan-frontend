"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import useLabelDataStore from "@/stores/labelDataStore";
import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LabelDataValidationPage() {
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const storedLabelData = useLabelDataStore((state) => state.labelData);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [loading, setLoading] = useState(true);
  const showAlert = useAlertStore((state) => state.showAlert);
  const router = useRouter();

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      showAlert("No files uploaded.", "error");
      router.push("/");
      return;
    }

    if (storedLabelData) {
      setLabelData(storedLabelData);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    const formData = new FormData();

    uploadedFiles.forEach((fileUploaded) => {
      const file = fileUploaded.getFile();
      formData.append("files", file);
    });

    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    axios
      .post("/api/extract-label-data", formData, {
        headers: { Authorization: authHeader },
        signal,
      })
      .then(async (response) => {
        const labelData: LabelData = response.data;
        formData.append("labelData", JSON.stringify(labelData));
        axios
          .post("/api/inspections", formData, {
            headers: { Authorization: authHeader },
            signal,
          })
          .then((response) => {
            const labelData: LabelData = response.data;
            router.push(`/label-data-validation/${labelData.inspectionId}`);
            return null;
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              console.log("Request canceled");
            } else {
              showAlert(
                `Label data initial save failed: ${processAxiosError(error)}`,
                "error",
              );
              setLoading(false);
            }
          })
          .finally(() => {
            setLabelData(labelData);
            // not disabling loading here in case of strict mode abort
          });
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          showAlert(
            `Label data extraction failed: ${processAxiosError(error)}`,
            "error",
          );
          setLoading(false);
        }
      });

    return () => {
      controller.abort(); // avoids react strict mode double fetch
    };
  }, [uploadedFiles, showAlert, router, storedLabelData, setLabelData]);

  return (
    <LabelDataValidator
      fileUploads={uploadedFiles}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
    />
  );
}

export default LabelDataValidationPage;
