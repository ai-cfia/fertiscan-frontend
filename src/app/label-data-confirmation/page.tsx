"use client";
import ImageViewer from "@/components/ImageViewer";
import LoadingButton from "@/components/LoadingButton";
import { QuantityChips } from "@/components/QuantityChip";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import useLabelDataStore from "@/stores/labelDataStore";
import { BilingualField, LabelData } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import { isAllVerified } from "@/utils/client/fieldValidation";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LabelDataConfirmationPage = () => {
  const labelData = useLabelDataStore((state) => state.labelData);
  const setLabelData = useLabelDataStore((state) => state.setLabelData);
  const resetLabelData = useLabelDataStore((state) => state.resetLabelData);
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const clearUploadedFiles = useUploadedFilesStore(
    (state) => state.clearUploadedFiles,
  );
  const imageFiles = uploadedFiles.map((file) => file.getFile());
  const router = useRouter();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);
  const [confirmed, setConfirmed] = useState(false);
  const { t } = useTranslation("confirmationPage");

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
        showAlert("Label data saved successfully.", "success");
        resetLabelData();
        clearUploadedFiles();
        router.push("/");
      })
      .catch((error) => {
        showAlert(
          `Label data saving failed: ${processAxiosError(error)}`,
          "error",
        );
      })
      .finally(() => {
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
          throw new Error("ID missing in initial label data saving response.");
        }
        setLabelData(response.data);
        putLabelData(response.data, signal);
      })
      .catch((error) => {
        showAlert(
          `Label data initial saving failed: ${processAxiosError(error)}`,
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
      showAlert("Internal error: Label data not found.", "error");
      return;
    }
    if (!confirmed) {
      showAlert("Internal error: Label data not confirmed.", "error");
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
    if (imageFiles.length === 0) {
      console.warn("No files uploaded.");
      return router.push("/");
    }

    if (!labelData) {
      console.warn("Label data not found.");
      return router.push("/");
    }

    if (labelData.confirmed) {
      console.warn("Label data already confirmed.");
      return router.push("/");
    }

    if (!isAllVerified(labelData)) {
      console.warn("Label data not fully verified.");
      return router.push("/");
    }
  }, [imageFiles, labelData, router, showAlert]);

  return (
    <Container
      className="flex flex-col max-w-[1920px] bg-gray-100 text-black"
      maxWidth={false}
      data-testid="label-data-validator-container"
    >
      <Box
        className="flex flex-col lg:flex-row gap-4 my-4 lg:h-[75vh] lg:min-h-[500px]"
        data-testid="main-content"
      >
        <Box
          className="flex h-[500px] md:h-[720px] lg:size-full justify-center min-w-0"
          data-testid="image-viewer-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        <Box className="flex flex-col size-full min-w-0 p-4 text-center gap-4 content-end bg-white border border-black">
          <Box className="flex flex-col gap-4 p-4">
            {/* Title */}
            <Typography
              variant="h4"
              className="text-center !font-bold"
              data-testid="page-title"
            >
              {t("pageTitle")}
            </Typography>
          </Box>

          <Box
            className="flex flex-col gap-4 flex-1 border overflow-y-auto sm:px-8 py-4"
            data-testid="form-container"
          >
            {/* Base Information */}
            <Box data-testid="base-information-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("baseInformation.sectionTitle")}
              </Typography>
              <TableContainer data-testid="base-information-table-container">
                <Table size="small" data-testid="base-information-table">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.name")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-48">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.registrationNumber")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.lotNumber")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.npk")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.weight")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.density")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          {t("baseInformation.tableHeaders.volume")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow data-testid="base-information-data-row">
                      <TableCell data-testid="base-information-name">
                        <Typography>
                          {labelData?.baseInformation.name.value}
                        </Typography>
                      </TableCell>
                      <TableCell data-testid="base-information-registration-number">
                        <Typography>
                          {labelData?.baseInformation.registrationNumber.value}
                        </Typography>
                      </TableCell>
                      <TableCell data-testid="base-information-lot-number">
                        <Typography>
                          {labelData?.baseInformation.lotNumber.value}
                        </Typography>
                      </TableCell>
                      <TableCell data-testid="base-information-npk">
                        <Typography>
                          {labelData?.baseInformation.npk.value}
                        </Typography>
                      </TableCell>
                      <TableCell data-testid="base-information-weight">
                        <QuantityChips
                          quantities={
                            labelData?.baseInformation.weight.quantities
                          }
                        />
                      </TableCell>
                      <TableCell data-testid="base-information-density">
                        <QuantityChips
                          quantities={
                            labelData?.baseInformation.density.quantities
                          }
                        />
                      </TableCell>
                      <TableCell data-testid="base-information-volume">
                        <QuantityChips
                          quantities={
                            labelData?.baseInformation.volume.quantities
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Organizations Table */}
            <Box data-testid="organizations-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("organizations.sectionTitle")}
              </Typography>
              <TableContainer data-testid="organizations-table-container">
                <Table size="small" data-testid="organizations-table">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">
                          {t("organizations.tableHeaders.name")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">
                          {t("organizations.tableHeaders.address")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="!font-bold">
                          {t("organizations.tableHeaders.website")}
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-44">
                        <Typography className="!font-bold">
                          {t("organizations.tableHeaders.phoneNumber")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labelData?.organizations?.map((org, index) => (
                      <TableRow
                        key={index}
                        data-testid={`organizations-row-${index}`}
                      >
                        <TableCell
                          data-testid={`organizations-row-${index}-name`}
                        >
                          <Typography>{org.name.value}</Typography>
                        </TableCell>
                        <TableCell
                          data-testid={`organizations-row-${index}-address`}
                        >
                          <Typography>{org.address.value}</Typography>
                        </TableCell>
                        <TableCell
                          data-testid={`organizations-row-${index}-website`}
                        >
                          <Typography>
                            <Link
                              href={`http://${org.website.value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {org.website.value}
                            </Link>
                          </Typography>
                        </TableCell>
                        <TableCell
                          data-testid={`organizations-row-${index}-phone-number`}
                        >
                          <Typography>
                            <Link href={`tel:${org.phoneNumber.value}`}>
                              {org.phoneNumber.value}
                            </Link>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Cautions */}
            <Box data-testid="cautions-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("cautions.sectionTitle")}
              </Typography>
              <BilingualTable
                data={labelData?.cautions ?? []}
                data-testid="cautions-bilingual-table"
              />
            </Box>

            {/* Instructions */}
            <Box data-testid="instructions-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("instructions.sectionTitle")}
              </Typography>
              <BilingualTable
                data={labelData?.instructions ?? []}
                data-testid="instructions-bilingual-table"
              />
            </Box>

            {/* Guaranteed Analysis */}
            <Box data-testid="guaranteed-analysis-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("guaranteedAnalysis.sectionTitle")}
              </Typography>

              {/* Title Section */}
              <Box
                className="mb-4"
                data-testid="guaranteed-analysis-title-section"
              >
                <Typography className="!font-bold mb-2 text-left">
                  {t("guaranteedAnalysis.title")}
                </Typography>
                <TableContainer data-testid="guaranteed-analysis-title-table-container">
                  <Table
                    size="small"
                    data-testid="guaranteed-analysis-title-table"
                  >
                    <TableHead>
                      <TableRow className="bg-gray-100">
                        <TableCell>
                          <Typography className="!font-bold">
                            {t("guaranteedAnalysis.tableHeaders.english")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">
                            {t("guaranteedAnalysis.tableHeaders.french")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">
                            {t("guaranteedAnalysis.tableHeaders.isMinimal")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow data-testid="guaranteed-analysis-title-row">
                        <TableCell data-testid="guaranteed-analysis-title-english">
                          <Typography>
                            {labelData?.guaranteedAnalysis.titleEn.value}
                          </Typography>
                        </TableCell>
                        <TableCell data-testid="guaranteed-analysis-title-french">
                          <Typography>
                            {labelData?.guaranteedAnalysis.titleFr.value}
                          </Typography>
                        </TableCell>
                        <TableCell data-testid="guaranteed-analysis-is-minimal">
                          <Typography>
                            {labelData?.guaranteedAnalysis.isMinimal.value
                              ? t("yes")
                              : t("no")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Nutrients Section */}
              <Box data-testid="guaranteed-analysis-nutrients-section">
                <Typography className="!font-bold mb-2 text-left">
                  {t("guaranteedAnalysis.nutrients")}
                </Typography>
                <BilingualTable
                  data={labelData?.guaranteedAnalysis.nutrients ?? []}
                  data-testid="guaranteed-analysis-nutrients-table"
                />
              </Box>
            </Box>

            {/* Ingredients */}
            <Box data-testid="ingredients-section">
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                {t("ingredients.sectionTitle")}
              </Typography>
              <Box>
                <Typography className="!font-bold mb-2 text-left">
                  {t("ingredients.nutrients")}
                </Typography>
                <BilingualTable
                  data={labelData?.ingredients ?? []}
                  data-testid="ingredients-nutrients-table"
                />
              </Box>
            </Box>
          </Box>

          {/* Confirmation Section */}
          <Box
            className="p-4 flex flex-col gap-1 text-center"
            data-testid="confirmation-section"
          >
            <Typography>{t("confirmationSection.prompt")}</Typography>
            {/* Acknowledgment Checkbox */}
            <FormGroup className="flex items-center justify-center gap-2">
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

            {/* Confirm and Edit Buttons */}
            <Box className="flex justify-center gap-4 pt-2">
              <LoadingButton
                className="px-4 py-2 font-bold hover:bg-green-700"
                variant="contained"
                color="success"
                disabled={!confirmed}
                onClick={handleConfirmClick}
                data-testid="confirm-button"
                loading={confirmLoading}
                text={t("confirmationSection.confirmButton")}
              />
              <LoadingButton
                variant="contained"
                className="px-4 py-2 bg-gray-300 text-black font-bold hover:bg-gray-400"
                onClick={handleEditClick}
                data-testid="edit-button"
                loading={editLoading}
                text={t("confirmationSection.editButton")}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LabelDataConfirmationPage;

interface BilingualTableProps {
  data: BilingualField[];
}

const BilingualTable: React.FC<BilingualTableProps> = ({ data }) => {
  const { t } = useTranslation("confirmationPage");

  return (
    <TableContainer data-testid="bilingual-table-container">
      <Table size="small" data-testid="bilingual-table">
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableCell className="min-w-60">
              <Typography className="!font-bold">
                {t("bilingualTable.tableHeaders.english")}
              </Typography>
            </TableCell>
            <TableCell className="min-w-60">
              <Typography className="!font-bold">
                {t("bilingualTable.tableHeaders.french")}
              </Typography>
            </TableCell>
            {data?.[0]?.value !== undefined && (
              <TableCell data-testid="bilingual-table-header-value">
                <Typography className="!font-bold">
                  {t("bilingualTable.tableHeaders.value")}
                </Typography>
              </TableCell>
            )}
            {data?.[0]?.unit !== undefined && (
              <TableCell data-testid="bilingual-table-header-unit">
                <Typography className="!font-bold">
                  {t("bilingualTable.tableHeaders.unit")}
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} data-testid={`bilingual-table-row-${index}`}>
              <TableCell data-testid={`bilingual-table-row-${index}-english`}>
                <Typography>{item.en}</Typography>
              </TableCell>
              <TableCell data-testid={`bilingual-table-row-${index}-french`}>
                <Typography>{item.fr}</Typography>
              </TableCell>
              {item.value !== undefined && (
                <TableCell
                  align="right"
                  data-testid={`bilingual-table-row-${index}-value`}
                >
                  <Typography>{item.value}</Typography>
                </TableCell>
              )}
              {item.unit !== undefined && (
                <TableCell
                  align="right"
                  data-testid={`bilingual-table-row-${index}-unit`}
                >
                  <Typography>{item.unit}</Typography>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
