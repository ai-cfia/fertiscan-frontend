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
import { useTranslation } from "react-i18next";

/**
 * A React component that handles the validation process for label data.
 * It manages the flow of uploading files, extracting label data from them,
 * and navigating to the validation detail page.
 *
 * @returns {JSX.Element} The rendered LabelDataValidationPage component.
 */
const LabelDataValidationPage = () => {
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const storedLabelData = useLabelDataStore((state) => state.labelData);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [loading, setLoading] = useState(true);
  const showAlert = useAlertStore((state) => state.showAlert);
  const router = useRouter();
  const { t } = useTranslation("labelDataValidator");

  // Check if no files were uploaded
  useEffect(() => {
    if (uploadedFiles.length === 0) {
      showAlert(t("errors.noFileUploaded"), "warning");
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

    // Basic authentication setup using token from cookies
    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    // API call to extract label data from uploaded files
    axios
      .post("/api-next/extract-label-data", formData, {
        headers: { Authorization: authHeader },
        signal,
      })
      .then(async (response) => {
        const labelData: LabelData = response.data;
        formData.append("labelData", JSON.stringify(labelData));

        // API call to post the extracted label data
        axios
          .post("/api-next/inspections", formData, {
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
              console.log("request canceled");
            } else {
              showAlert(
                `${t("alert.initialSaveFailed")}: ${processAxiosError(error)}`,
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
          console.log("request canceled");
        } else {
          showAlert(
            `${t("alert.labelExtractionFailed")}: ${processAxiosError(error)}`,
            "error",
          );
          setLoading(false);
        }
      });

    return () => {
      controller.abort(); // avoids react strict mode double fetch
    };
  }, [uploadedFiles, showAlert, router, storedLabelData, setLabelData, t]);

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
