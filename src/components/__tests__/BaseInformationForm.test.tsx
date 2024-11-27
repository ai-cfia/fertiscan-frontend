import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import { render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BaseInformationForm from "../BaseInformationForm";

const Wrapper = ({
  initialData,
  onStateChange,
}: {
  initialData: LabelData;
  onStateChange?: (data: LabelData) => void;
}) => {
  const [labelData, setLabelData] = useState<LabelData>(initialData);
  const methods = useForm<LabelData>({
    defaultValues: labelData,
  });

  useEffect(() => {
    if (onStateChange) {
      onStateChange(labelData);
    }
  }, [labelData, onStateChange]);

  return (
    <FormProvider {...methods}>
      <BaseInformationForm labelData={labelData} setLabelData={setLabelData} />
    </FormProvider>
  );
};

describe("BaseInformationForm Rendering", () => {
  it("should render all fields with correct components", () => {
    render(<Wrapper initialData={DEFAULT_LABEL_DATA} />);

    const verifiedFields = ["name", "registrationNumber", "lotNumber", "npk"];
    const quantityFields = ["weight", "density", "volume"];

    verifiedFields.forEach((key) => {
      const verifiedInput = screen.getByTestId(
        `verified-input-baseInformation.${key}`,
      );
      expect(verifiedInput).toBeInTheDocument();
    });

    quantityFields.forEach((key) => {
      const quantityInput = screen.getByTestId(
        `quantity-multi-input-baseInformation.${key}`,
      );
      expect(quantityInput).toBeInTheDocument();
    });
  });
});
