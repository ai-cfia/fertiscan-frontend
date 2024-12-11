"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA } from "@/types/types";
import { mapInspectionToLabelData } from "@/utils/common";
import { Inspection } from "@/utils/server/backend";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validate } from "uuid";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // uses the uploaded files from store because fetching images is not yet implemented
  const { uploadedFiles } = useUploadedFilesStore();
  const { showAlert } = useAlertStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [labelData, setLabelData] = useState(DEFAULT_LABEL_DATA);
  const [inspection, setInspection] = useState<Inspection | null>(null);

  useEffect(() => {
    // if (uploadedFiles.length === 0) {
    //   showAlert("No files uploaded.", "error");
    //   router.push("/");
    //   return;
    // }

    if (!validate(id)) {
      showAlert("Invalid id.", "error");
      router.push("/");
      return;
    }

    const username = "";
    const password = "";
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    axios
      .get(`/api/inspections/${id}`, {
        headers: { Authorization: authHeader },
        signal,
      })
      .then((response) => {
        const inspection: Inspection = response.data;
        setInspection(inspection);
        const labelData = mapInspectionToLabelData(inspection);
        setLabelData(labelData);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Fetch aborted");
        } else {
          console.error(error);
          setLoading(false);
        }
      });
    // not disabling loading in finally() in case of strict mode abort

    return () => {
      controller.abort(); // avoids react strict mode double fetch
    };
  }, [router, showAlert, id, uploadedFiles.length]);

  useEffect(() => {
    console.log("inspection", inspection);
  }, [inspection]);

  return (
    <LabelDataValidator
      files={uploadedFiles.map((file) => file.getFile())}
      labelData={labelData}
      setLabelData={setLabelData}
      loading={loading}
    />
  );
}
