import { StepComponentProps } from "./stepper";

function DummyStepComponent({ title }: StepComponentProps) {
  return <div data-testid={title}>{title}</div>;
}

export default DummyStepComponent;
