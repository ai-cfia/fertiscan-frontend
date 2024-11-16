"use client";
import Dummy from "@/components/Dummy";
import ImageViewer from "@/components/ImageViewer";
import OrganizationForm from "@/components/OrganizationForm";
import {
  HorizontalNonLinearStepper,
  StepComponentProps,
  StepperControls,
  StepStatus,
} from "@/components/stepper";
import { LabelData, TEST_LABEL_DATA } from "@/types/organization";
import useBreakpoints from "@/utils/useBreakpoints";
import { Box, Button, Container } from "@mui/material";
import * as React from "react";
import { useState } from "react";

function LabelDataValidationPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isDownXs, isBetweenXsSm, isBetweenSmMd, isBetweenMdLg } =
    useBreakpoints();
  const isLgOrBelow =
    isDownXs || isBetweenXsSm || isBetweenSmMd || isBetweenMdLg;
  const [activeStep, setActiveStep] = useState(0);
  const [labelData, setLabelData] = useState<LabelData>(TEST_LABEL_DATA);
  const [organizationStatus, setOrganizationStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );
  const [dummyStatus, setDummyStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );

  const createStep = (
    Component: React.FC<StepComponentProps>,
    props: StepComponentProps,
  ) => {
    return {
      title: props.title,
      status: props.status,
      setStatus: props.setStatus,
      labelData: props.labelData,
      setLabelData: props.setLabelData,
      render: () => (
        <Component
          title={props.title}
          status={props.status}
          setStatus={props.setStatus}
          labelData={props.labelData}
          setLabelData={props.setLabelData}
        />
      ),
    };
  };

  const steps = [
    createStep(OrganizationForm, {
      title: "Organizations",
      status: organizationStatus,
      setStatus: setOrganizationStatus,
      labelData: labelData,
      setLabelData: setLabelData,
    }),
    createStep(Dummy, {
      title: "Dummy",
      status: dummyStatus,
      setStatus: setDummyStatus,
      labelData: labelData,
      setLabelData: setLabelData,
    }),
  ];

  const stepperProps = {
    stepTitles: steps.map((step) => step.title),
    stepStatuses: steps.map((step) => step.status),
    activeStep,
    setActiveStep,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <Container
      className="flex flex-col h-screen max-w-[1920px] max-h-[80vh]"
      maxWidth={false}
      data-testid="container"
    >
      {!isLgOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper
            stepTitles={stepperProps.stepTitles}
            stepStatuses={stepperProps.stepStatuses}
            activeStep={stepperProps.activeStep}
            setActiveStep={stepperProps.setActiveStep}
          />
        </Box>
      )}

      <Box className="flex flex-col lg:flex-row" data-testid="main-content">
        <Box
          className="flex w-full py-4 justify-center min-w-0 h-[720px]"
          data-testid="swiper-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        {isLgOrBelow && (
          <Box className="p-4 mt-4" data-testid="stepper-md">
            <HorizontalNonLinearStepper
              stepTitles={stepperProps.stepTitles}
              stepStatuses={stepperProps.stepStatuses}
              activeStep={stepperProps.activeStep}
              setActiveStep={stepperProps.setActiveStep}
            />
          </Box>
        )}

        <Box
          className="flex w-full py-4 justify-center min-w-0 min-h-[500px] lg:max-h-[80vh] overflow-y-auto"
          data-testid="form-container"
        >
          <Box className="w-full text-center" data-testid="forms">
            <Box className="">{steps[activeStep].render()}</Box>
            <StepperControls
              stepTitles={stepperProps.stepTitles}
              stepStatuses={stepperProps.stepStatuses}
              activeStep={stepperProps.activeStep}
              setActiveStep={stepperProps.setActiveStep}
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
