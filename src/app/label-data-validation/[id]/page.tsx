"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validate } from "uuid";
import { useTranslation } from "react-i18next";

export default function Page() {
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const showAlert = useAlertStore((state) => state.showAlert);
  const router = useRouter();
  const { id } = useParams();
  const inspectionId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const { t } = useTranslation("labelDataValidator");

  useEffect(() => {
    if (!inspectionId) return;

    if (!validate(inspectionId)) {
      showAlert(`${t("error.invalidId")}: ${inspectionId}.`, "error");
      router.push("/");
      return;
    }

    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(`/api-next/inspections/${inspectionId}`, {
        headers: { Authorization: authHeader },
        signal,
      })
      .then((response) => {
        const labelData: LabelData = response.data;
        setLabelData(labelData);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log(t("error.fetchAborted"));
        } else {
          console.error(error);
          setLoading(false);
          showAlert(t("error.failedFetchInspection"), "error");
          router.push("/");
        }
      });

    return () => {
      controller.abort();
    };
  }, [inspectionId, router, showAlert, uploadedFiles.length, t]);

  return (
    <LabelDataValidator
      fileUploads={uploadedFiles}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
      inspectionId={inspectionId}
    />
  );
}
