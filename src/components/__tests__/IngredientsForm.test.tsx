import { DEFAULT_LABEL_DATA, LabelData } from "@/types/types";
import { render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import IngredientsForm from "../IngredientsForm";

const Wrapper = ({
  initialData,
  onStateChange,
}: {
  initialData: LabelData;
  onStateChange?: (data: LabelData) => void;
}) => {
  const [labelData, setLabelData] = useState(initialData);
  const methods = useForm({
    defaultValues: labelData,
  });

  useEffect(() => {
    if (onStateChange) {
      onStateChange(labelData);
    }
  }, [labelData, onStateChange]);

  return (
    <FormProvider {...methods}>
      <IngredientsForm labelData={labelData} setLabelData={setLabelData} />
    </FormProvider>
  );
};

describe("IngredientsForm Rendering", () => {
  it("should render the title input fields and nutrients table", () => {
    render(<Wrapper initialData={DEFAULT_LABEL_DATA} />);

    expect(screen.getByTestId("ingredients-form")).toBeInTheDocument();
    expect(
      screen.getByTestId("table-container-ingredients"),
    ).toBeInTheDocument();
  });
});
