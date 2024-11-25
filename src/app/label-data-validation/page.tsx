"use client";
import BaseInformationForm from "@/components/BaseInformationForm";
import ImageViewer from "@/components/ImageViewer";
import OrganizationsForm from "@/components/OrganizationsForm";
import {
  HorizontalNonLinearStepper,
  StepperControls,
  StepStatus,
} from "@/components/stepper";
import {
  DEFAULT_LABEL_DATA,
  FormComponentProps,
  isVerified,
  LabelData,
} from "@/types/types";
import useBreakpoints from "@/utils/useBreakpoints";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LabelDataValidationPage() {
  const { t } = useTranslation("labelDataValidationPage");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;
  const [labelData, setLabelData] = useState<LabelData>(DEFAULT_LABEL_DATA);
  const [activeStep, setActiveStep] = useState(0);
  const [organizationsStepStatus, setOrganizationsStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);
  const [baseInformationStepStatus, setBaseInformationStepStatus] =
    useState<StepStatus>(StepStatus.Incomplete);

  const createStep = (
    title: string,
    StepComponent: React.FC<FormComponentProps>,
    stepStatus: StepStatus,
    setStepStatusState: React.Dispatch<React.SetStateAction<StepStatus>>,
  ) => {
    return {
      title: title,
      stepStatus: stepStatus,
      setStepStatus: setStepStatusState,
      render: () => (
        <StepComponent labelData={labelData} setLabelData={setLabelData} />
      ),
    };
  };

  const steps = [
    createStep(
      t("baseInformation.stepTitle"),
      BaseInformationForm,
      baseInformationStepStatus,
      setBaseInformationStepStatus,
    ),
    createStep(
      t("organizations.stepTitle"),
      OrganizationsForm,
      organizationsStepStatus,
      setOrganizationsStepStatus,
    ),
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input")?.click();
  };

  useEffect(() => {
    const verified = labelData.organizations.every((org) => isVerified(org));
    setOrganizationsStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.organizations, setOrganizationsStepStatus]);

  useEffect(() => {
    const verified = isVerified(labelData.baseInformation);
    setBaseInformationStepStatus(
      verified ? StepStatus.Completed : StepStatus.Incomplete,
    );
  }, [labelData.baseInformation, setBaseInformationStepStatus]);

  return (
    <Container
      className="flex flex-col h-screen max-w-[1920px] max-h-[80vh]"
      maxWidth={false}
      data-testid="container"
    >
      {!isLgOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper
            stepTitles={steps.map((step) => step.title)}
            stepStatuses={steps.map((step) => step.stepStatus)}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Box>
      )}

      <Box
        className="flex flex-col lg:flex-row gap-4"
        data-testid="main-content"
      >
        <Box
          className="flex w-full justify-center min-w-0 h-[720px]"
          data-testid="swiper-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        {isLgOrBelow && (
          <Box className="p-4 mt-4" data-testid="stepper-md">
            <HorizontalNonLinearStepper
              stepTitles={steps.map((step) => step.title)}
              stepStatuses={steps.map((step) => step.stepStatus)}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Box>
        )}

        <Box
          className="flex w-full justify-center min-w-0 min-h-[500px] lg:max-h-[80vh] overflow-y-auto"
          data-testid="form-container"
        >
          <Box className="w-full text-center" data-testid="forms">
            <Typography
              variant="h6"
              className="text-lg font-bold"
              data-testid="form-title"
            >
              {steps[activeStep].title}
            </Typography>
            <Box className="">{steps[activeStep].render()}</Box>
            <StepperControls
              stepTitles={steps.map((step) => step.title)}
              stepStatuses={steps.map((step) => step.stepStatus)}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Box>
        </Box>
      </Box>

      <Box className="flex justify-center mt-4">
        <Button variant="contained" onClick={openFileDialog}>
          Upload Images
        </Button>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    </Container>
  );
}

export default LabelDataValidationPage;
