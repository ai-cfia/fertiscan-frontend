"use client";
import ImageViewer from "@/components/ImageViewer";
import useAlertStore from "@/stores/alertStore";
import useUploadedFilesStore from "@/stores/fileStore";
import useLabelDataStore from "@/stores/labelDataStore";
import { LabelData, Quantity } from "@/types/types";
import { processAxiosError } from "@/utils/client/apiErrors";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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

interface QuantityChipsProps extends React.ComponentProps<typeof Box> {
  quantities: Quantity[] | undefined;
}

const QuantityChips = React.forwardRef<HTMLDivElement, QuantityChipsProps>(
  ({ quantities, ...rest }, ref) => {
    return (
      <Box
        {...rest}
        ref={ref}
        className={`flex flex-wrap gap-1 ${rest.className || ""}`}
      >
        {quantities?.map((q, i) => (
          <Chip key={i} label={`${q.value} ${q.unit}`} variant="outlined" />
        ))}
      </Box>
    );
  },
);

QuantityChips.displayName = "QuantityChips";

const LabelDataConfirmationPage = () => {
  const labelData = useLabelDataStore((state) => state.labelData);
  const setLabelData = useLabelDataStore((state) => state.setLabelData);
  const { uploadedFiles } = useUploadedFilesStore();
  const imageFiles = uploadedFiles.map((file) => file.getFile());
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);
  const [confirmed, setConfirmed] = useState(false);

  const getAuthHeader = () => {
    return "Basic " + btoa(`${atob(Cookies.get("token") ?? "")}:`);
  };

  const updateLabelData = (labelData: LabelData, signal: AbortSignal) => {
    if (!labelData.confirmed) {
      showAlert("Internal error: Label data not confirmed.", "error");
      return;
    }
    setLoading(true);
    axios
      .put(`/api/inspections/${labelData.inspectionId}`, labelData, {
        headers: { Authorization: getAuthHeader() },
        signal,
      })
      .then((response) => {
        showAlert("Label data saved successfully.", "success");
        const updatedLabelData: LabelData = response.data;
        setLabelData(updatedLabelData);
        router.push("/");
      })
      .catch((error) => {
        showAlert(
          `Label data saving failed: ${processAxiosError(error)}`,
          "error",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveLabelData = (labelData: LabelData, signal: AbortSignal) => {
    const formData = new FormData();
    uploadedFiles.forEach((fileUploaded) => {
      const file = fileUploaded.getFile();
      formData.append("files", file);
    });
    formData.append("labelData", JSON.stringify(labelData));
    setLoading(true);
    axios
      .post("/api/inspections", formData, {
        headers: { Authorization: getAuthHeader() },
        signal,
      })
      .then((response) => {
        const initiallySavedLabelData: LabelData = {
          ...response.data,
          confirmed: confirmed,
        };
        if (!initiallySavedLabelData.inspectionId) {
          throw new Error("ID missing in initial label data saving response.");
        }
        setLabelData(initiallySavedLabelData);
        updateLabelData(initiallySavedLabelData, signal);
      })
      .catch((error) => {
        showAlert(
          `Label data initial saving failed: ${processAxiosError(error)}`,
          "error",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = () => {
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
      const updatedLabelData = { ...labelData, confirmed: confirmed };
      return updateLabelData(updatedLabelData, signal);
    }
    return saveLabelData(labelData, signal);
  };

  useEffect(() => {
    console.debug("labelData", labelData);
  }, [labelData]);

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
              Review and Confirm The Label Data
            </Typography>
          </Box>

          <Box
            className="flex flex-col gap-4 flex-1 border overflow-y-auto sm:px-8 py-4"
            data-testid="form-container"
          >
            {/* Base Information */}
            <Box>
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                Fertilizer Base Information
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">Name</Typography>
                      </TableCell>
                      <TableCell className="min-w-48">
                        <Typography className="!font-bold">
                          Registration Number
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">
                          Lot Number
                        </Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">NPK</Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">Weight</Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">Density</Typography>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Typography className="!font-bold">Volume</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography>
                          {labelData?.baseInformation.name.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {labelData?.baseInformation.registrationNumber.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {labelData?.baseInformation.lotNumber.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {labelData?.baseInformation.npk.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <QuantityChips
                          quantities={
                            labelData?.baseInformation.weight.quantities
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <QuantityChips
                          quantities={
                            labelData?.baseInformation.density.quantities
                          }
                        />
                      </TableCell>
                      <TableCell>
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
            <Box>
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                Organizations
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">Name</Typography>
                      </TableCell>
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">Address</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="!font-bold">Website</Typography>
                      </TableCell>
                      <TableCell className="min-w-44">
                        <Typography className="!font-bold">
                          Phone Number
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labelData?.organizations?.map((org, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography>{org.name.value}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{org.address.value}</Typography>
                        </TableCell>
                        <TableCell>
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
                        <TableCell>
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
            <Box>
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                Cautions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">English</Typography>
                      </TableCell>
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">French</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labelData?.cautions?.map((caution, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography>{caution.en}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{caution.fr}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Instructions */}
            <Box>
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                Instructions
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow className="bg-gray-100">
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">English</Typography>
                      </TableCell>
                      <TableCell className="min-w-60">
                        <Typography className="!font-bold">French</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labelData?.instructions?.map((instruction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography>{instruction.en}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{instruction.fr}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Guaranteed Analysis */}
            <Box>
              <Typography
                variant="h5"
                className="text-left !font-bold"
                gutterBottom
              >
                Guaranteed Analysis
              </Typography>
              {/* Title Section */}
              <Box className="mb-4">
                <Typography className="!font-bold mb-2 text-left">
                  Title
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="bg-gray-100">
                        <TableCell>
                          <Typography className="!font-bold">
                            English
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">French</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">
                            Is Minimal
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography>
                            {labelData?.guaranteedAnalysis.titleEn.value}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {labelData?.guaranteedAnalysis.titleFr.value}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {labelData?.guaranteedAnalysis.isMinimal.value
                              ? "Yes"
                              : "No"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Nutrients Section */}
              <Box>
                <Typography className="!font-bold mb-2 text-left">
                  Nutrients
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="bg-gray-100">
                        <TableCell>
                          <Typography className="!font-bold">
                            English
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">French</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">Value</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="!font-bold">Unit</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {labelData?.guaranteedAnalysis.nutrients.map(
                        (nutrient, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography>{nutrient.en}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{nutrient.fr}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{nutrient.value}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{nutrient.unit}</Typography>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>

          {/* Confirmation Section */}
          <Box
            className="p-4 flex flex-col gap-1 text-center"
            data-testid="confirmation-section"
          >
            <Typography>
              Please confirm the data is accurate. If changes are needed, return
              to edit.
            </Typography>

            {/* Acknowledgment Checkbox */}
            <FormGroup className="flex items-center justify-center gap-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" className="!font-bold">
                    I acknowledge that the data is accurate.
                  </Typography>
                }
              />
            </FormGroup>

            <Box className="flex justify-center gap-4 pt-2">
              <Button
                variant="contained"
                color="success"
                className="px-4 py-2 font-bold hover:bg-green-700"
                disabled={!confirmed || loading}
                onClick={handleConfirmClick}
                data-testid="confirm-button"
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                className="px-4 py-2 bg-gray-300 text-black font-bold hover:bg-gray-400"
                disabled={loading}
                onClick={handleEditClick}
                data-testid="edit-button"
              >
                Edit Details
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LabelDataConfirmationPage;
