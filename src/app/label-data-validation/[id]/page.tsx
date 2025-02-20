"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import { getAuthHeader, getLabelDataFromCookies } from "@/utils/client/cookies";
import { Box, CircularProgress } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import Error from "next/error";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LabelDataValidationPageWithId() {
  const { id } = useParams();
  const inspectionId = Array.isArray(id) ? id[0] : id;
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const showAlert = useAlertStore((state) => state.showAlert);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const { t } = useTranslation("labelDataValidator");
  const [error, setError] = useState<AxiosResponse | null>(null);

  useEffect(() => {
    if (!inspectionId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(`/api-next/inspections/${inspectionId}`, {
        headers: { Authorization: getAuthHeader() },
        signal,
      })
      .then((response) => {
        const labelData: LabelData = response.data;
        if (labelData.confirmed) {
          showAlert(t("alert.alreadyCompleted"), "warning");
          return router.push("/");
        }
        const c_labelData = getLabelDataFromCookies(inspectionId);
        setLabelData(c_labelData ? c_labelData : labelData);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("fetch aborted");
        } else if (error.response) {
          setError(error.response);
          console.error("fetch inspection failed:", error.response.data);
        } else {
          showAlert(t("alert.failedFetchInspection"), "error");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [inspectionId, router, showAlert, uploadedFiles.length, t]);

  if (loading) {
    return (
      <Box className="flex h-[90vh] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return error ? (
    <Error statusCode={error.status} />
  ) : (
    <LabelDataValidator
      fileUploads={uploadedFiles}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
      inspectionId={inspectionId}
    />
  );
}
