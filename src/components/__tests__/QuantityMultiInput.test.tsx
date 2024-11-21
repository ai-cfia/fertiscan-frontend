import { FieldStatus } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import QuantityMultiInput from "../QuantityMultiInput";

interface QuantityInput {
  value: number;
  unit: string;
}

interface FormValues {
  testInputs: QuantityInput[];
  testStatus: FieldStatus;
}

const Wrapper = ({
  label = "Test Label",
  placeholder = "Enter a value",
  name = "testInputs",
  statusName = "testStatus",
  unitOptions = ["kg", "lb", "oz", "ton"],
  defaultValues = {
    testInputs: [{ value: 0, unit: "kg" }],
    testStatus: FieldStatus.Unverified,
  },
  onSubmit = jest.fn(),
}: {
  label?: string;
  placeholder?: string;
  name?: string;
  statusName?: string;
  unitOptions?: string[];
  defaultValues?: FormValues;
  onSubmit?: (data: FormValues) => void;
}) => {
  const methods = useForm<FormValues>({
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          methods.handleSubmit(onSubmit)();
        }}
      >
        <QuantityMultiInput
          label={label}
          placeholder={placeholder}
          name={name}
          statusName={statusName}
          unitOptions={unitOptions}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

describe("QuantityMultiInput rendering", () => {
  it("renders correctly with default settings", () => {
    render(<Wrapper />);

    expect(
      screen.getByTestId("quantity-multi-input-label-testInputs"),
    ).toHaveTextContent("Test Label");
    expect(screen.getByTestId("add-button-testInputs")).toBeInTheDocument();
    expect(
      screen.getByTestId("toggle-status-btn-testStatus"),
    ).toBeInTheDocument();

    const dropdowns = screen.getAllByTestId(/unit-selector-testInputs-\w+/);
    expect(dropdowns.length).toBe(1);
    expect(dropdowns[0].children.length).toBeGreaterThan(0);

    const inputFields = screen.getAllByTestId(/input-field-testInputs-\w+/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    const removeButtons = screen.getAllByTestId(/delete-button-testInputs-\w+/);
    expect(removeButtons.length).toBe(1);

    expect(screen.getByTestId("add-button-testInputs")).toBeInTheDocument();
  });

  it("renders initial rows and dropdown options correctly based on defaultValues", () => {
    const defaultValues = {
      testInputs: [
        { value: 10, unit: "kg" },
        { value: 20, unit: "lb" },
      ],
      testStatus: FieldStatus.Unverified,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    const fieldRows = screen.getAllByTestId(/field-row-testInputs-\w+/);
    expect(fieldRows.length).toBe(2);

    const inputs = fieldRows.map(
      (row) =>
        row.querySelector(
          "[data-testid^='input-field-'] input",
        ) as HTMLInputElement,
    );
    expect(inputs[0].value).toBe("10");
    expect(inputs[1].value).toBe("20");

    const dropdowns = screen.getAllByTestId(/unit-selector-testInputs-\w+/);
    expect(dropdowns.length).toBe(2);
    expect(dropdowns[0].children.length).toBe(4);
  });
});

describe("QuantityMultiInput functionality", () => {
  it("disables inputs rows and add row button when status is Verified", () => {
    const defaultValues = {
      testInputs: [{ value: 50, unit: "kg" }],
      testStatus: FieldStatus.Verified,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    screen.getAllByTestId(/input-field-testInputs-\w+/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen
      .getAllByTestId(/unit-selector-testInputs-\w+/)
      .forEach((dropdown) => {
        expect(dropdown).toBeDisabled();
      });
    screen.getAllByTestId(/delete-button-testInputs-\w+/).forEach((button) => {
      expect(button).toBeDisabled();
    });
    expect(screen.getByTestId("add-button-testInputs")).toBeDisabled();

    fireEvent.click(screen.getByTestId("toggle-status-btn-testStatus"));

    screen.getAllByTestId(/input-field-testInputs-\w+/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen
      .getAllByTestId(/unit-selector-testInputs-\w+/)
      .forEach((dropdown) => {
        expect(dropdown).toBeDisabled();
      });
    screen.getAllByTestId(/delete-button-testInputs-\w+/).forEach((button) => {
      expect(button).toBeDisabled();
    });
    expect(screen.getByTestId("add-button-testInputs")).toBeDisabled();
  });

  it("handles Add and Remove row functionality", () => {
    const defaultValues = {
      testInputs: [
        { value: 10, unit: "kg" },
        { value: 20, unit: "lb" },
      ],
      testStatus: FieldStatus.Unverified,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    let fieldRows = screen.getAllByTestId(/field-row-testInputs-\w+/);
    expect(fieldRows.length).toBe(2);

    const removeButtons = screen.getAllByTestId(/delete-button-testInputs-\w+/);
    fireEvent.click(removeButtons[0]);

    fieldRows = screen.queryAllByTestId(/field-row-testInputs-\w+/);
    expect(fieldRows.length).toBe(1);

    const addButton = screen.getByTestId("add-button-testInputs");
    fireEvent.click(addButton);

    fieldRows = screen.getAllByTestId(/field-row-testInputs-\w+/);
    expect(fieldRows.length).toBe(2);
  });

  it("shows an error for negative values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      testInputs: [{ value: 0, unit: "kg" }],
      testStatus: FieldStatus.Unverified,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/input-field-testInputs-\w+/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "-10");

    await userEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = screen.getByTestId(/error-message-testInputs-\w+/);
    expect(errorMessage).toHaveTextContent("errors.minValue");

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows an error for non-numeric values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      testInputs: [{ value: 0, unit: "kg" }],
      testStatus: FieldStatus.Unverified,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/input-field-testInputs-\w+/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "abc");

    await userEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = screen.getByTestId(/error-message-testInputs-\w+/);
    expect(errorMessage).toHaveTextContent("errors.numbersOnly");

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      testInputs: [{ value: 0, unit: "kg" }],
      testStatus: FieldStatus.Unverified,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/input-field-testInputs-\w+/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "10");

    const dropdowns = screen.getAllByTestId(/unit-selector-testInputs-\w+/);
    expect(dropdowns.length).toBe(1);
    const dropdown = dropdowns[0] as HTMLSelectElement;
    await userEvent.selectOptions(dropdown, "lb");

    await userEvent.click(screen.getByTestId("toggle-status-btn-testStatus"));

    await userEvent.click(screen.getByTestId("submit-button"));

    expect(mockOnSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        testInputs: [{ value: "10", unit: "lb" }],
        testStatus: "verified",
      }),
    );
  });

  it("doesn't allow toggling status when there are errors", async () => {
    const defaultValues = {
      testInputs: [{ value: 0, unit: "kg" }],
      testStatus: FieldStatus.Unverified,
    };

    render(<Wrapper defaultValues={defaultValues} />);

    const inputFields = screen.getAllByTestId(/input-field-testInputs-\w+/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "abc");

    const toggleButton = screen.getByTestId("status-icon-testStatus");
    await userEvent.click(toggleButton);
    expect(toggleButton).not.toHaveClass("text-green-500");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "10");
    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveClass("text-green-500");
  });
});
