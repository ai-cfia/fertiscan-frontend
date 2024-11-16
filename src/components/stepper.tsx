import { LabelData } from "@/types/organization";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

export enum StepStatus {
  Incomplete = "incomplete",
  Completed = "completed",
  Error = "error",
}

export interface StepComponentProps {
  title: string;
  status: StepStatus;
  setStatus: React.Dispatch<React.SetStateAction<StepStatus>>;
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
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
  const handleStep = (step: number) => () => setActiveStep(step);

  return (
    <Box className="w-full">
      <Stepper nonLinear activeStep={activeStep}>
        {stepTitles.map((title, index) => (
          <Step
            key={index}
            completed={stepStatuses[index] === StepStatus.Completed}
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
