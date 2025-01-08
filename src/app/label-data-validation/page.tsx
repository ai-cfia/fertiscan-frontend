"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import { mapLabelDataOutputToLabelData } from "@/utils/client/modelTransformation";
import { Inspection, LabelDataOutput } from "@/utils/server/backend";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { processLoadingData, processUploadJsonFile,isTriggerLabelDataLoad } from "@/utils/client/devMenu";

const LabelDataValidationPage = () => {
  const { uploadedFiles } = useUploadedFilesStore();
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlertStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (uploadedFiles.length === 0 && !isTriggerLabelDataLoad()) {
        showAlert("No files uploaded.", "error");
        router.push("/");
        return;
      }

      const controller = new AbortController();
      const signal = controller.signal;
      const formData = new FormData();
      let labelDataOutput : LabelDataOutput;


      setLoading(true);
      /* DevMenu code start */
      if (isTriggerLabelDataLoad()) {
        setLabelData( await processLoadingData() );
        setLoading(false);
      /* DevMenu code finish */
      } else {
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
            labelDataOutput = response.data;
            const labelData = mapLabelDataOutputToLabelData(labelDataOutput);
            formData.append("labelData", JSON.stringify(labelDataOutput));
            axios
              .post("/api/inspections", formData, {
                headers: { Authorization: authHeader },
                signal,
              })
              .then((response) => {
                const inspection: Inspection = response.data;
                router.push(
                  `/label-data-validation/${inspection.inspection_id}`,
                );
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

            processUploadJsonFile(labelDataOutput); // Dev menu code
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
          controller.abort();
        };
      }
    };
    fetchData();
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
