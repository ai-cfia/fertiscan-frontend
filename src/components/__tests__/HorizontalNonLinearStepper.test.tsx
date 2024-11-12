import HorizontalNonLinearStepper, {
  StepStatus,
} from "@/components/HorizontalNonLinearStepper";
import { fireEvent, render, screen } from "@testing-library/react";

describe("HorizontalNonLinearStepper Rendering", () => {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const activeStep = 1;
  const stepStatuses: { [key: number]: StepStatus } = {
    0: StepStatus.Completed,
    1: StepStatus.Incomplete,
    2: StepStatus.Error,
    3: StepStatus.Incomplete,
  };

  it("renders the correct number of steps based on steps prop", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    const renderedSteps = screen.getAllByRole("button");
    expect(renderedSteps).toHaveLength(steps.length);
  });

  it("indicates the correct active step based on activeStep prop", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    const activeStepButton = screen.getAllByRole("button")[activeStep];
    expect(activeStepButton).toHaveAttribute("aria-current", "step");
  });

  it("displays each step's status correctly (complete, incomplete, error)", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    steps.forEach((_, index) => {
      const stepLabel = screen.getByText(steps[index]);

      if (stepStatuses[index] === StepStatus.Completed) {
        expect(stepLabel).toHaveClass("Mui-completed");
      } else if (stepStatuses[index] === StepStatus.Error) {
        expect(stepLabel).toHaveClass("Mui-error");
      } else {
        expect(stepLabel).not.toHaveClass("Mui-completed");
        expect(stepLabel).not.toHaveClass("Mui-error");
      }
    });
  });
});

describe("HorizontalNonLinearStepper Functionality", () => {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  let activeStep = 0;
  let stepStatuses = {
    0: StepStatus.Incomplete,
    1: StepStatus.Incomplete,
    2: StepStatus.Incomplete,
    3: StepStatus.Incomplete,
  };

  const setActiveStep = jest.fn((newStep) => {
    activeStep = newStep;
  });

  const setStepStatuses = jest.fn((updateFn) => {
    stepStatuses = updateFn(stepStatuses);
  });

  it("changes active step when a step is clicked", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        stepStatuses={stepStatuses}
      />,
    );

    const secondStepButton = screen.getByText("Step 2").closest("button");
    if (secondStepButton) fireEvent.click(secondStepButton);

    expect(setActiveStep).toHaveBeenCalledWith(1);
  });

  it("marks a step as completed when set to StepStatus.Complete", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={1}
        setActiveStep={setActiveStep}
        stepStatuses={stepStatuses}
        setStepStatuses={setStepStatuses}
      />,
    );

    setStepStatuses((prevStatuses: { [key: number]: StepStatus }) => ({
      ...prevStatuses,
      1: StepStatus.Completed,
    }));

    expect(stepStatuses[1]).toBe(StepStatus.Completed);
  });

  it("displays an error indication when step status is StepStatus.Error", () => {
    render(
      <HorizontalNonLinearStepper
        steps={steps}
        activeStep={2}
        setActiveStep={setActiveStep}
        stepStatuses={{
          ...stepStatuses,
          2: StepStatus.Error,
        }}
      />,
    );

    const errorStepLabel = screen.getByText("Step 3");
    expect(errorStepLabel).toHaveClass("Mui-error");
  });
});

describe("HorizontalNonLinearStepper Edge Cases", () => {
    it("handles empty steps array without error", () => {
      render(
        <HorizontalNonLinearStepper
          steps={[]}
          activeStep={0}
          setActiveStep={() => {}}
          stepStatuses={{}}
        />
      );
  
      const stepButtons = screen.queryAllByRole("button");
      expect(stepButtons).toHaveLength(0);
    });
  
    it("handles out-of-range indexes in activeStep or stepStatuses gracefully", () => {
      const steps = ["Step 1", "Step 2"];
      const activeStep = 5; 
      const stepStatuses = {
        0: StepStatus.Completed,
        5: StepStatus.Error,
      };
  
      render(
        <HorizontalNonLinearStepper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={() => {}}
          stepStatuses={stepStatuses}
        />
      );
  
      const renderedSteps = screen.getAllByRole("button");
      expect(renderedSteps).toHaveLength(steps.length);
  
      steps.forEach((stepLabel) => {
        expect(screen.queryByText(stepLabel)).toBeInTheDocument();
      });
    });
  });
