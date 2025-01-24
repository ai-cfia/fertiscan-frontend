"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validate } from "uuid";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // uses the uploaded files from store because fetching images is not yet implemented
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const showAlert = useAlertStore((state) => state.showAlert);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);

  useEffect(() => {
    if (!validate(id)) {
      showAlert("Invalid id.", "error");
      router.push("/");
      return;
    }

    const username = atob(Cookies.get("token") ?? "");
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(`/api/inspections/${id}`, {
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
          console.log("Fetch aborted");
        } else {
          console.error(error);
          setLoading(false);
          showAlert("Failed to fetch inspection.", "error");
          router.push("/");
        }
      });
    // not disabling loading in finally() in case of strict mode abort

    return () => {
      controller.abort(); // avoids react strict mode double fetch
    };
  }, [router, showAlert, id, uploadedFiles.length]);

  return (
    <LabelDataValidator
      fileUploads={uploadedFiles}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
      inspectionId={id}
    />
  );
}
