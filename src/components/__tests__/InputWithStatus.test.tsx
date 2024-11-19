import { Field, FieldStatus } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import InputWithStatus from "../InputWithStatus";

const TestWrapper = ({ defaultStatus }: { defaultStatus: FieldStatus }) => {
  const methods = useForm<Record<string, Field>>({
    defaultValues: {
      fieldName: {
        value: "",
        status: defaultStatus,
        errorMessage: null,
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <InputWithStatus
          label="Test Field"
          placeholder="Enter text"
          name="fieldName.value"
          statusName="fieldName.status"
          className="test-class"
        />
      </form>
    </FormProvider>
  );
};

describe("Rendering", () => {
  it("should render all elements with correct attributes and content", () => {
    render(<TestWrapper defaultStatus={FieldStatus.Unverified} />);

    const label = screen.getByTestId("input-label-fieldName.value");
    expect(label).toHaveTextContent("Test Field");

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "fieldName.value");
    expect(input).toHaveValue("");

    expect(
      screen.getByTestId("input-with-status-fieldName.value"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("toggle-status-btn-fieldName.status"),
    ).toBeInTheDocument();
  });
});

describe("Status Behavior", () => {
  it("should disable the input field when statusValue is FieldStatus.Verified", () => {
    render(<TestWrapper defaultStatus={FieldStatus.Verified} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeDisabled();
  });

  it("should enable the input field when statusValue is not FieldStatus.Verified", () => {
    render(<TestWrapper defaultStatus={FieldStatus.Unverified} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).not.toBeDisabled();
  });

  it("should toggle the status between Verified and Unverified on IconButton click", () => {
    render(<TestWrapper defaultStatus={FieldStatus.Unverified} />);
    const toggleButton = screen.getByTestId(
      "toggle-status-btn-fieldName.status",
    );
    const statusIcon = screen.getByTestId("status-icon-fieldName.status");
    expect(statusIcon).not.toHaveClass("text-green-500");
    fireEvent.click(toggleButton);
    expect(statusIcon).toHaveClass("text-green-500");
    fireEvent.click(toggleButton);
    expect(statusIcon).not.toHaveClass("text-green-500");
  });

  it("should not toggle the status when the current status is FieldStatus.Error", () => {
    render(<TestWrapper defaultStatus={FieldStatus.Error} />);
    const toggleButton = screen.getByTestId(
      "toggle-status-btn-fieldName.status",
    );
    const statusIcon = screen.getByTestId("status-icon-fieldName.status");
    expect(statusIcon).not.toHaveClass("text-green-500");
    fireEvent.click(toggleButton);
    expect(statusIcon).not.toHaveClass("text-green-500");
  });
});
