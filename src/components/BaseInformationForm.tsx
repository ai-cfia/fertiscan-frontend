import { FormComponentProps } from "@/types/FormComponentProps";

function BaseInformationForm({ title }: FormComponentProps) {
  return <div data-testid={title}>{title}</div>;
}

export default BaseInformationForm;
