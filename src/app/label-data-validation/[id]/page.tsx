"use client";
import LabelDataValidator from "@/components/LabelDataValidator";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import { getAuthHeader, getLabelDataFromCookies } from "@/utils/client/cookies";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [fetchingPictures, setFetchingPictures] = useState(true);

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

        if (!labelData.pictureSetId) return;
        setFetchingPictures(true);

        return axios
          .get(`/api-next/pictures/${labelData.pictureSetId}`, {
            headers: { Authorization: getAuthHeader() },
            signal,
          })
          .then((res) => {
            const pictureIds: string[] = res.data;
            return Promise.all(
              pictureIds.map((pictureId) =>
                axios
                  .get(
                    `/api-next/pictures/${labelData.pictureSetId}/${pictureId}`,
                    {
                      headers: { Authorization: getAuthHeader() },
                      signal,
                      responseType: "blob",
                    },
                  )
                  .then((res) => new File([res.data], pictureId))
                  .catch((error) => {
                    if (!axios.isCancel(error)) {
                      showAlert(
                        `${t("alert.getPictureFailed")}: ${error.message}`,
                        "error",
                      );
                    }
                    return null;
                  }),
              ),
            );
          })
          .then((files) => {
            setImageFiles(files.filter((file): file is File => file !== null));
            setFetchingPictures(false);
          })
          .catch((error) => {
            if (!axios.isCancel(error)) {
              showAlert(
                `${t("alert.getPictureSetFailed")}: ${error.message}`,
                "error",
              );
              setError(error.response);
            }
          });
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.debug("fetch aborted");
        } else if (error.response) {
          setError(error.response);
        } else {
          showAlert(t("alert.failedFetchInspection"), "error");
        }
      })
      .finally(() => {
        setLoading(false);
        setFetchingPictures(false);
      });

    return () => {
      controller.abort();
    };
  }, [inspectionId, router, showAlert, uploadedFiles.length, t]);

  return error ? (
    <Error statusCode={error.status} />
  ) : (
    <LabelDataValidator
      labelData={labelData}
      setLabelData={setLabelData}
      inspectionId={inspectionId}
      imageFiles={imageFiles}
      loadingImages={fetchingPictures}
    />
  );
}
