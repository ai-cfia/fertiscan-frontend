import { FormComponentProps } from "@/types/FormComponentProps";

function DummyStepComponent({ title }: FormComponentProps) {
  return <div data-testid={title}>{title}</div>;
}

export default DummyStepComponent;
