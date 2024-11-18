import { FormComponentProps } from "@/types/types";

function DummyStepComponent({ title }: FormComponentProps) {
  return <div data-testid={title}>{title}</div>;
}

export default DummyStepComponent;
