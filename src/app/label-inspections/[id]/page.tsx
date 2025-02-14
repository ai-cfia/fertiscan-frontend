"use client";
import LabelInformation from "@/components/inspection-details/LabelInformation";
import SplitContentLayout from "@/components/inspection-details/SplitContentLayout";
import LoadingButton from "@/components/LoadingButton";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import { LabelData } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import { getAuthHeader } from "@/utils/client/auth";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import Error from "next/error";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function InspectionPage() {
  const { id } = useParams();
  const inspectionId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [discardLoading, setDiscardLoading] = useState(false);
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const imageFiles = uploadedFiles.map((file) => file.getFile());
  const showAlert = useAlertStore((state) => state.showAlert);
  const [labelData, setLabelData] = useState<LabelData | null>(null);
  const { t } = useTranslation("inspectionPage");
  const [error, setError] = useState<AxiosResponse | null>(null);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteInspection = (id: string, signal: AbortSignal) => {
    axios
      .delete(`/api-next/inspections/${id}`, {
        headers: { Authorization: getAuthHeader() },
        signal,
      })
      .then(() => {
        showAlert(t("alert.deleteSuccess"), "success");
        router.push("/");
      })
      .catch((error) => {
        showAlert(
          `${t("alert.discardFailed")}: ${processAxiosError(error)}`,
          "error",
        );
        setDiscardLoading(false);
      });
  };

  useEffect(() => {
    if (!inspectionId) return;
    const controller = new AbortController();

    setLoading(true);

    axios
      .get(`/api-next/inspections/${inspectionId}`, {
        headers: { Authorization: getAuthHeader() },
        signal: controller.signal,
      })
      .then((response) => {
        setLabelData(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.debug("fetch aborted");
        } else if (error.response) {
          setError(error.response);
        } else {
          showAlert(
            `${t("alert.getInspectionFailed")}: ${processAxiosError(error)}`,
            "error",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [inspectionId, showAlert, t]);

  const handleEditClick = () => {
    setEditLoading(true);
    router.push(`/label-data-validation/${labelData?.inspectionId}`);
  };

  const handleDiscardClick = () => {
    setConfirmOpen(true);
  };

  const confirmDiscard = () => {
    setConfirmOpen(false);
    if (!inspectionId) {
      showAlert(t("alert.internalErrorLabelNotFound"), "error");
      return;
    }
    setDiscardLoading(true);
    deleteInspection(inspectionId, new AbortController().signal);
  };

  if (loading) {
    return (
      <Box className="flex h-[100vh] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return error ? (
    <Error statusCode={error.status} />
  ) : (
    <Container
      className="h-min-[calc(100vh-65px)] flex max-w-[1920px] flex-col bg-gray-100 text-black"
      maxWidth={false}
      data-testid="label-data-validator-container"
    >
      <SplitContentLayout
        imageFiles={imageFiles}
        expandable
        header={
          <Box className="mx-auto flex w-full flex-col rounded-sm bg-gray-100 p-4 text-left shadow-md">
            <Typography variant="h5" className="!font-bold">
              {t("inspectionDetails")}
            </Typography>
            <Box className="mt-3 grid w-full grid-cols-2 gap-4">
              <Typography variant="body1">
                <strong>{t("inspectionId")}:</strong> {labelData?.inspectionId}
              </Typography>
              <Typography variant="body1">
                <strong>{t("inspector")}:</strong> {}
              </Typography>
              <Typography variant="body1">
                <strong>{t("status")}:</strong>{" "}
                <span
                  className={
                    labelData?.confirmed ? "text-green-600" : "text-red-600"
                  }
                >
                  {labelData?.confirmed ? t("completed") : t("incomplete")}
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>{t("createdAt")}:</strong>
                {}
              </Typography>
              <Typography variant="body1">
                <strong>{t("lastUpdatedAt")}:</strong>{" "}
              </Typography>
            </Box>
          </Box>
        }
        body={<LabelInformation labelData={labelData} disableNotes={true} />}
        footer={
          <Box className="flex items-center justify-center gap-4 p-4">
            <LoadingButton
              variant="contained"
              color="secondary"
              onClick={handleEditClick}
              data-testid="edit-button"
              loading={editLoading}
              text={t("edit")}
              aria-label={t("alt.edit")}
              disabled={labelData?.confirmed}
            />
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleDiscardClick}
              data-testid="discard-button"
              text={t("discard")}
              aria-label={t("alt.discard")}
              //   disabled={labelData?.confirmed}
              loading={discardLoading}
            />
          </Box>
        }
      />
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("confirmDiscardTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("confirmDiscardMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={confirmDiscard} color="error" autoFocus>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default InspectionPage;
