import { LabelData } from "./LabelData";

export interface FormComponentProps {
  title: string;
  labelData: LabelData;
  setLabelData: React.Dispatch<React.SetStateAction<LabelData>>;
}
