import { HorizontalNonLinearStepper, StepStatus } from "@/components/stepper";
import { fireEvent, render, screen } from "@testing-library/react";

describe("HorizontalNonLinearStepper Rendering", () => {
  const stepTitles = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const activeStep = 1;
  const stepStatuses = [
    StepStatus.Completed,
    StepStatus.Incomplete,
    StepStatus.Error,
    StepStatus.Incomplete,
  ];

  it("renders the correct number of steps based on stepTitles prop", () => {
    render(
      <HorizontalNonLinearStepper
        stepTitles={stepTitles}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    const renderedSteps = screen.getAllByRole("button");
    expect(renderedSteps).toHaveLength(stepTitles.length);
  });

  it("indicates the correct active step based on activeStep prop", () => {
    render(
      <HorizontalNonLinearStepper
        stepTitles={stepTitles}
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
        stepTitles={stepTitles}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    stepTitles.forEach((title, index) => {
      const stepLabel = screen.getByText(title);

      if (stepStatuses[index] === StepStatus.Completed) {
        expect(stepLabel.closest(".MuiStep-completed")).not.toBeNull();
      } else if (stepStatuses[index] === StepStatus.Error) {
        expect(stepLabel.closest(".Mui-error")).not.toBeNull();
      } else {
        expect(stepLabel.closest(".MuiStep-completed")).toBeNull();
        expect(stepLabel.closest(".Mui-error")).toBeNull();
      }
    });
  });
});

describe("HorizontalNonLinearStepper Functionality", () => {
  const stepTitles = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const setActiveStep = jest.fn();

  it("changes active step when a step is clicked", () => {
    render(
      <HorizontalNonLinearStepper
        stepTitles={stepTitles}
        activeStep={0}
        setActiveStep={setActiveStep}
        stepStatuses={Array(stepTitles.length).fill(StepStatus.Incomplete)}
      />,
    );

    const secondStepButton = screen.getByText("Step 2").closest("button");
    if (secondStepButton) fireEvent.click(secondStepButton);

    expect(setActiveStep).toHaveBeenCalledWith(1);
  });

  it("displays an error indication when step status is StepStatus.Error", () => {
    render(
      <HorizontalNonLinearStepper
        stepTitles={stepTitles}
        activeStep={2}
        setActiveStep={setActiveStep}
        stepStatuses={[
          StepStatus.Incomplete,
          StepStatus.Incomplete,
          StepStatus.Error,
          StepStatus.Incomplete,
        ]}
      />,
    );

    const errorStepLabel = screen.getByText("Step 3");
    expect(errorStepLabel.closest(".Mui-error")).not.toBeNull();
  });
});

describe("HorizontalNonLinearStepper Edge Cases", () => {
  it("handles empty stepTitles array without error", () => {
    render(
      <HorizontalNonLinearStepper
        stepTitles={[]}
        activeStep={0}
        setActiveStep={() => {}}
        stepStatuses={[]}
      />,
    );

    const stepButtons = screen.queryAllByRole("button");
    expect(stepButtons).toHaveLength(0);
  });

  it("handles out-of-range indexes in activeStep gracefully", () => {
    const stepTitles = ["Step 1", "Step 2"];
    const activeStep = 5;
    const stepStatuses = [StepStatus.Completed, StepStatus.Incomplete];

    render(
      <HorizontalNonLinearStepper
        stepTitles={stepTitles}
        activeStep={activeStep}
        setActiveStep={() => {}}
        stepStatuses={stepStatuses}
      />,
    );

    const renderedSteps = screen.getAllByRole("button");
    expect(renderedSteps).toHaveLength(stepTitles.length);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
  });
});
