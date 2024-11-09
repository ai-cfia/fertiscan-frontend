"use client";
import HorizontalNonLinearStepper, {
  CustomStepperProps,
  StepStatus,
} from "@/components/HorizontalNonLinearStepper";
import { Box, Button, Container, Typography } from "@mui/material";
import * as React from "react";

function LabelDataValidationPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepStatuses, setStepStatuses] = React.useState<{
    [k: number]: StepStatus;
  }>({});

  // To be removed, just for testing
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

  return (
    <Container
      className="flex flex-col h-screen max-w-[1920px] overflow-hidden"
      maxWidth={false}
    >
      <Box className="p-4 mt-4">
        <HorizontalNonLinearStepper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          stepStatuses={stepStatuses}
        />
      </Box>

      <Box className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <Box className="flex-1 p-4 flex justify-center">
          {/* Carousel Placeholder: To be removed, just for testing */}
          <Box className="w-full h-3/4 p-4 text-center font-bold bg-gray-300">
            Carousel Placeholder
          </Box>
        </Box>

        <Box className="flex flex-1 p-4 justify-center overflow-y-auto">
          {/* Form Placeholder: To be removed, just for testing */}
          <Box className="w-full h-3/4 p-4 text-center font-bold bg-gray-400">
            <StepControls
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepStatuses={stepStatuses}
              setStepStatuses={setStepStatuses}
            />
          </Box>
        </Box>
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
      <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
        {allStepsCompleted
          ? "All steps completed - you're finished"
          : `Step ${activeStep + 1}`}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, pt: 2 }}>
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
