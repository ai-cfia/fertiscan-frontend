import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";

export enum StepStatus {
  Incomplete = "incomplete",
  Completed = "completed",
  Error = "error",
}

export interface CustomStepperProps {
  steps: string[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  stepStatuses: { [k: number]: StepStatus };
  setStepStatuses?: React.Dispatch<
    React.SetStateAction<{ [k: number]: StepStatus }>
  >;
}

export default function HorizontalNonLinearStepper({
  steps,
  activeStep,
  stepStatuses,
  setActiveStep,
}: CustomStepperProps) {
  const handleStep = (step: number) => () => setActiveStep(step);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={stepStatuses[index] === StepStatus.Completed}
          >
            <StepButton onClick={handleStep(index)}>
              <StepLabel error={stepStatuses[index] === StepStatus.Error}>
                {label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
