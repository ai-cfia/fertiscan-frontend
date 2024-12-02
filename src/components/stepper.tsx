import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { useEffect, useRef } from "react";

export enum StepStatus {
  Incomplete = "incomplete",
  Completed = "completed",
  Error = "error",
}

export interface StepperProps {
  stepTitles: string[];
  stepStatuses: StepStatus[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export const HorizontalNonLinearStepper: React.FC<StepperProps> = ({
  stepTitles,
  stepStatuses,
  activeStep,
  setActiveStep,
}) => {
  const stepRefs = useRef<HTMLDivElement[]>([]);

  const handleStep = (step: number) => () => setActiveStep(step);

  useEffect(() => {
    const currentStepRef = stepRefs.current[activeStep];
    if (currentStepRef && currentStepRef.scrollIntoView) {
      currentStepRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeStep, stepRefs]);
  
  return (
    <Box className="w-full overflow-x-auto overflow-y-hidden">
      <Stepper nonLinear activeStep={activeStep} className="mx-2">
        {stepTitles.map((title, index) => (
          <Step
            key={index}
            completed={stepStatuses[index] === StepStatus.Completed}
            ref={(el) => {
              if (el) {
                stepRefs.current[index] = el;
              }
            }}
          >
            <StepButton onClick={handleStep(index)}>
              <StepLabel error={stepStatuses[index] === StepStatus.Error}>
                {title}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export const StepperControls: React.FC<StepperProps> = ({
  stepTitles,
  activeStep,
  setActiveStep,
}) => {
  const stepsTotal = stepTitles.length;

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, stepsTotal - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box className="flex flex-col gap-2 content-center">
      <Box className="flex justify-between pt-2 w-full">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={activeStep >= stepsTotal - 1}
          variant="contained"
          color="secondary"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
