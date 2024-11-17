"use client";
import DummyStepComponent from "@/components/DummyStepComponent";
import ImageViewer from "@/components/ImageViewer";
import {
  HorizontalNonLinearStepper,
  StepperControls,
  StepStatus,
} from "@/components/stepper";
import { FormComponentProps } from "@/types/FormComponentProps";
import { LabelData, TEST_LABEL_DATA } from "@/types/LabelData";
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
  const [labelData, setLabelData] = useState<LabelData>(TEST_LABEL_DATA);
  const [stepStatus, setStepStatus] = useState<StepStatus>(
    StepStatus.Incomplete,
  );
  const [activeStep, setActiveStep] = useState(0);

  const createStep = (
    StepComponent: React.FC<FormComponentProps>,
    props: FormComponentProps,
    stepStatus: StepStatus,
    setStepStatus: React.Dispatch<React.SetStateAction<StepStatus>>,
  ) => {
    return {
      title: props.title,
      stepStatus,
      setStepStatus,
      render: () => (
        <StepComponent
          title={props.title}
          labelData={props.labelData}
          setLabelData={props.setLabelData}
        />
      ),
    };
  };

  const steps = [
    createStep(
      DummyStepComponent,
      {
        title: "Dummy 1",
        labelData: labelData,
        setLabelData: setLabelData,
      },
      stepStatus,
      setStepStatus,
    ),
    createStep(
      DummyStepComponent,
      {
        title: "Dummy 2",
        labelData: labelData,
        setLabelData: setLabelData,
      },
      stepStatus,
      setStepStatus,
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
