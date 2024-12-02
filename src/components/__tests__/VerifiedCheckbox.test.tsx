import { VerifiedBooleanField } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { VerifiedCheckbox } from "../VerifiedFieldComponents";

const TestWrapper = ({ verified }: { verified: boolean }) => {
  const methods = useForm<Record<string, VerifiedBooleanField>>({
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
        <VerifiedCheckbox
          label="Test Checkbox"
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
    expect(label).toHaveTextContent("Test Checkbox");

    const checkbox = screen.getByTestId("checkbox-field-fieldName.value");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    expect(
      screen.getByTestId("toggle-verified-btn-fieldName.verified"),
    ).toBeInTheDocument();
  });
});

describe("Verified Behavior", () => {
  it("should disable the checkbox when verified is true", () => {
    render(<TestWrapper verified={true} />);
    const checkboxSpan = screen.getByTestId("checkbox-field-fieldName.value");
    const checkbox = checkboxSpan.querySelector("input");
    expect(checkbox).toBeDisabled();
  });

  it("should enable the checkbox when verified is false", () => {
    render(<TestWrapper verified={false} />);
    const checkbox = screen.getByTestId("checkbox-field-fieldName.value");
    expect(checkbox).not.toBeDisabled();
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
      "bg-green-100",
    );
    expect(verifiedIcon).toHaveClass("text-green-500");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("verified-field-fieldName")).not.toHaveClass(
      "bg-green-100",
    );
    expect(verifiedIcon).not.toHaveClass("text-green-500");
  });

  it("should toggle checkbox value when not verified", () => {
    render(<TestWrapper verified={false} />);
    const checkboxSpan = screen.getByTestId("checkbox-field-fieldName.value");
    const checkbox = checkboxSpan.querySelector("input") as HTMLInputElement;
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
