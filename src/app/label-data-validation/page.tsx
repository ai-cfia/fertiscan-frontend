"use client";
import HorizontalNonLinearStepper, {
  CustomStepperProps,
  StepStatus,
} from "@/components/HorizontalNonLinearStepper";
import ImageViewer from "@/components/ImageViewer";
import Organizations from "@/components/Organizations";
import useBreakpoints from "@/utils/useBreakpoints";
import { Box, Button, Container, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";

function LabelDataValidationPage() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isDownXs, isBetweenXsSm, isBetweenSmMd } = useBreakpoints();
  const isMdOrBelow = isDownXs || isBetweenXsSm || isBetweenSmMd;
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepStatuses, setStepStatuses] = React.useState<{
    [k: number]: StepStatus;
  }>({});

  // To be removed, just for testing
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

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
      className="flex flex-col h-screen max-w-[1920px]"
      maxWidth={false}
      data-testid="container"
    >
      {!isMdOrBelow && (
        <Box className="p-4 mt-4" data-testid="stepper">
          <HorizontalNonLinearStepper
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            stepStatuses={stepStatuses}
          />
        </Box>
      )}

      <Box className="flex flex-col md:flex-row" data-testid="main-content">
        <Box
          className="flex w-full p-4 justify-center min-w-0 h-[720px]"
          data-testid="swiper-container"
        >
          <ImageViewer imageFiles={imageFiles} />
        </Box>

        {isMdOrBelow && (
          <Box className="p-4 mt-4 border" data-testid="stepper-md">
            <HorizontalNonLinearStepper
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepStatuses={stepStatuses}
            />
          </Box>
        )}

        <Box
          className="flex w-full p-4 justify-center min-w-0 min-h-[500px]"
          data-testid="form-container"
        >
          <Box
            className="w-full h-[400px] p-4 text-center "
            data-testid="form-placeholder"
          >
            {/* <StepControls
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepStatuses={stepStatuses}
              setStepStatuses={setStepStatuses}
            /> */}
            <Organizations />
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

// To be removed, just for testing
const StepControls: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  setActiveStep,
  stepStatuses,
  setStepStatuses,
}) => {
  const stepsTotal = steps.length;
  const allStepsCompleted = Object.values(stepStatuses).every(
    (status) => status === StepStatus.Completed,
  );

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, stepsTotal - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    setStepStatuses?.((prev) => ({
      ...prev,
      [activeStep]: StepStatus.Completed,
    }));
  };

  const handleIncomplete = () => {
    setStepStatuses?.((prev) => ({
      ...prev,
      [activeStep]: StepStatus.Incomplete,
    }));
  };

  const handleError = () => {
    setStepStatuses?.((prev) => ({ ...prev, [activeStep]: StepStatus.Error }));
  };

  const handleReset = () => {
    setActiveStep(0);
    setStepStatuses?.({});
  };

  return (
    <>
      <Typography className="mt-2 mb-1 py-1">
        {allStepsCompleted
          ? "All steps completed - you're finished"
          : `Step ${activeStep + 1}`}
      </Typography>

      <Box className="flex justify-center gap-2 pt-2">
        <Button
          color="secondary"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          color="secondary"
          onClick={handleNext}
          disabled={activeStep >= stepsTotal - 1}
        >
          Next
        </Button>
        <Button
          color="secondary"
          onClick={handleComplete}
          disabled={stepStatuses[activeStep] === StepStatus.Completed}
        >
          Complete Step
        </Button>
        <Button
          color="secondary"
          onClick={handleIncomplete}
          disabled={stepStatuses[activeStep] === StepStatus.Incomplete}
        >
          Undo
        </Button>
        <Button
          color="error"
          onClick={handleError}
          disabled={stepStatuses[activeStep] === StepStatus.Error}
        >
          Mark as Error
        </Button>
        <Button color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </>
  );
};

export default LabelDataValidationPage;
