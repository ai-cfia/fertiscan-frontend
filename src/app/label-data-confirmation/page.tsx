"use client";
import LabelInformation from "@/components/inspection-details/LabelInformation";
import SplitContentLayout from "@/components/inspection-details/SplitContentLayout";
import LoadingButton from "@/components/LoadingButton";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import useLabelDataStore from "@/stores/labelDataStore";
import { LabelData } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import { isAllVerified } from "@/utils/client/fieldValidation";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LabelDataConfirmationPage = () => {
  const labelData = useLabelDataStore((state) => state.labelData);
  const setLabelData = useLabelDataStore((state) => state.setLabelData);
  const setComment = useLabelDataStore((state) => state.setComment);
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const imageFiles = uploadedFiles.map((file) => file.getFile());
  const router = useRouter();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);
  const [confirmed, setConfirmed] = useState(false);
  const { t } = useTranslation("confirmationPage");
  const [isRetractedView, setIsRetractedView] = useState(true);

  const getAuthHeader = () => {
    return "Basic " + btoa(`${atob(Cookies.get("token") ?? "")}:`);
  };

  const putLabelData = (labelData: LabelData, signal: AbortSignal) => {
    const confirmedLabelData = { ...labelData, confirmed: true };
    setConfirmLoading(true);
    axios
      .put(
        `/api-next/inspections/${confirmedLabelData.inspectionId}`,
        confirmedLabelData,
        {
          headers: { Authorization: getAuthHeader() },
          signal,
        },
      )
      .then(() => {
        showAlert(t("error.saveSuccess"), "success");
        router.push("/");
      })
      .catch((error) => {
        showAlert(
          `${t("error.saveFailed")}: ${processAxiosError(error)}`,
          "error",
        );
        setConfirmLoading(false);
      });
  };

  const postLabelData = (labelData: LabelData, signal: AbortSignal) => {
    const formData = new FormData();
    uploadedFiles.forEach((fileUploaded) => {
      const file = fileUploaded.getFile();
      formData.append("files", file);
    });
    formData.append("labelData", JSON.stringify(labelData));
    setConfirmLoading(true);
    axios
      .post("/api-next/inspections", formData, {
        headers: { Authorization: getAuthHeader() },
        signal,
      })
      .then((response) => {
        if (!response.data.inspectionId) {
          throw new Error(t("error.idMissing"));
        }
        const _labelData: LabelData = {
          ...labelData,
          inspectionId: response.data.inspectionId,
          pictureSetId: response.data.pictureSetId,
        };
        setLabelData(_labelData);
        putLabelData(_labelData, signal);
      })
      .catch((error) => {
        showAlert(
          `${t("error.initialSaveFailed")}: ${processAxiosError(error)}`,
          "error",
        );
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleEditClick = () => {
    setEditLoading(true);
    if (labelData?.inspectionId) {
      router.push(`/label-data-validation/${labelData.inspectionId}`);
    } else {
      router.push("/label-data-validation");
    }
  };

  const handleConfirmClick = () => {
    if (!labelData) {
      showAlert(t("error.internalErrorLabelNotFound"), "error");
      return;
    }
    if (!confirmed) {
      showAlert(t("internalErrorLabelNotConfirmed"), "error");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    if (labelData?.inspectionId) {
      return putLabelData(labelData, signal);
    }
    return postLabelData(labelData, signal);
  };

  useEffect(() => {
    // if (imageFiles.length === 0) {
    //   console.warn(t("error.noFileUploaded"));
    //   return router.push("/");
    // }

    if (!labelData) {
      console.warn(t("error.labelNotFound"));
      return router.push("/");
    }

    if (labelData.confirmed) {
      console.warn(t("error.labelAlreadyConfirmed"));
      return router.push("/");
    }

    if (!isAllVerified(labelData)) {
      console.warn(t("error.labelDataNotFullySaved"));
      return router.push("/");
    }
  }, [imageFiles, labelData, router, showAlert, t]);

  return (
    <Container
      className="h-min-[calc(100vh-65px)] flex max-w-[1920px] flex-col bg-gray-100 text-black"
      maxWidth={false}
      data-testid="label-data-validator-container"
    >
      <SplitContentLayout
        imageFiles={imageFiles}
        expandable
        header={
          <Typography
            variant="h5"
            className="text-center !font-bold"
            data-testid="page-title"
          >
            {t("pageTitle")}
          </Typography>
        }
        body={
          <LabelInformation
            labelData={labelData}
            setNotes={setComment}
            disableNotes={confirmed}
          />
        }
        footer={
          <Box className="flex flex-col gap-1 p-4 text-center">
            <Typography>{t("confirmationSection.prompt")}</Typography>
            <FormGroup className="flex w-[100%] items-center justify-center gap-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    disabled={confirmLoading}
                    data-testid="confirmation-checkbox"
                  />
                }
                label={
                  <Typography variant="body2" className="!font-bold">
                    {t("confirmationSection.acknowledgment")}
                  </Typography>
                }
              />
            </FormGroup>
            <Box className="flex justify-center gap-4 pt-2">
              <LoadingButton
                variant="contained"
                className="bg-gray-300 px-4 py-2 font-bold text-black hover:bg-gray-400"
                onClick={handleEditClick}
                data-testid="edit-button"
                loading={editLoading}
                text={t("confirmationSection.editButton")}
                aria-label={t("alt.editButton")}
              />
              <LoadingButton
                className="px-4 py-2 font-bold hover:bg-green-700"
                variant="contained"
                color="success"
                disabled={!confirmed}
                onClick={handleConfirmClick}
                data-testid="confirm-button"
                loading={confirmLoading}
                text={t("confirmationSection.confirmButton")}
                aria-label={t("alt.confirmButton")}
              />
            </Box>
          </Box>
        }
      />{" "}
    </Container>
  );
};

export default LabelDataConfirmationPage;
