import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { VerifiedRadio } from "../VerifiedFieldComponents";

const TestWrapper = ({ verified }: { verified: boolean }) => {
  const methods = useForm({
    defaultValues: {
      fieldName: {
        value: false,
        verified: verified,
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <VerifiedRadio
          label="Test Radio"
          path="fieldName"
          className="test-class"
        />
      </form>
    </FormProvider>
  );
};

describe("Rendering", () => {
  it("should render all elements with correct attributes and content", () => {
    render(<TestWrapper verified={false} />);

    const label = screen.getByTestId("field-label-fieldName");
    expect(label).toHaveTextContent("Test Radio");

    const radioGroup = screen.getByTestId("radio-group-field-fieldName.value");
    expect(radioGroup).toBeInTheDocument();

    const yesRadioSpan = screen.getByTestId("radio-yes-field-fieldName.value");
    expect(yesRadioSpan).toBeInTheDocument();

    const yesRadioInput = yesRadioSpan.querySelector(
      "input",
    ) as HTMLInputElement;
    expect(yesRadioInput).toBeInTheDocument();
    expect(yesRadioInput).not.toBeChecked();

    const noRadioSpan = screen.getByTestId("radio-no-field-fieldName.value");
    expect(noRadioSpan).toBeInTheDocument();

    const noRadioInput = noRadioSpan.querySelector("input") as HTMLInputElement;
    expect(noRadioInput).toBeInTheDocument();
    expect(noRadioInput).toBeChecked();

    expect(
      screen.getByTestId("toggle-verified-btn-fieldName.verified"),
    ).toBeInTheDocument();
  });
});

describe("Verified Behavior", () => {
  it("should disable the radio buttons when verified is true", () => {
    render(<TestWrapper verified={true} />);

    const yesRadioSpan = screen.getByTestId("radio-yes-field-fieldName.value");
    const noRadioSpan = screen.getByTestId("radio-no-field-fieldName.value");

    const yesRadioInput = yesRadioSpan.querySelector(
      "input",
    ) as HTMLInputElement;
    const noRadioInput = noRadioSpan.querySelector("input") as HTMLInputElement;

    expect(yesRadioInput).toBeDisabled();
    expect(noRadioInput).toBeDisabled();
  });

  it("should enable the radio buttons when verified is false", () => {
    render(<TestWrapper verified={false} />);

    const yesRadio = screen.getByTestId("radio-yes-field-fieldName.value");
    const noRadio = screen.getByTestId("radio-no-field-fieldName.value");

    expect(yesRadio).not.toBeDisabled();
    expect(noRadio).not.toBeDisabled();
  });

  it("should toggle verified between true and false on IconButton click", () => {
    render(<TestWrapper verified={false} />);

    const toggleButton = screen.getByTestId(
      "toggle-verified-btn-fieldName.verified",
    );
    const verifiedIcon = screen.getByTestId("verified-icon-fieldName.verified");

    expect(verifiedIcon).not.toHaveClass("text-green-500");

    fireEvent.click(toggleButton);
    expect(screen.getByTestId("verified-field-fieldName")).toHaveClass(
      "border-green-500",
    );
    expect(verifiedIcon).toHaveClass("text-green-500");

    fireEvent.click(toggleButton);
    expect(screen.getByTestId("verified-field-fieldName")).not.toHaveClass(
      "border-green-500",
    );
    expect(verifiedIcon).not.toHaveClass("text-green-500");
  });

  it("should toggle radio value when not verified", () => {
    render(<TestWrapper verified={false} />);

    const yesRadioSpan = screen.getByTestId("radio-yes-field-fieldName.value");
    const noRadioSpan = screen.getByTestId("radio-no-field-fieldName.value");

    const yesRadioInput = yesRadioSpan.querySelector(
      "input",
    ) as HTMLInputElement;
    const noRadioInput = noRadioSpan.querySelector("input") as HTMLInputElement;

    expect(noRadioInput).toBeChecked();
    fireEvent.click(yesRadioInput);
    expect(yesRadioInput).toBeChecked();
    expect(noRadioInput).not.toBeChecked();
    fireEvent.click(noRadioInput);
    expect(noRadioInput).toBeChecked();
    expect(yesRadioInput).not.toBeChecked();
  });
});
