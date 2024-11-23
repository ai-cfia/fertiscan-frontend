import { VerifiedQuantityField } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import VerifiedQuantityMultiInput from "../VerifiedQuantityMultiInput";

const Wrapper = ({
  label = "Test Label",
  placeholder = "Enter a value",
  path = "",
  unitOptions = ["kg", "lb", "oz", "ton"],
  defaultValues = {
    quantities: [{ value: "0", unit: "kg" }],
    verified: false,
  },
  onSubmit = jest.fn(),
}: {
  label?: string;
  placeholder?: string;
  path?: string;
  unitOptions?: string[];
  defaultValues?: VerifiedQuantityField;
  onSubmit?: (data: VerifiedQuantityField) => void;
}) => {
  const methods = useForm<VerifiedQuantityField>({
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
        <VerifiedQuantityMultiInput
          label={label}
          placeholder={placeholder}
          path={path}
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

    expect(screen.getByTestId("quantity-multi-input-label-")).toHaveTextContent(
      "Test Label",
    );
    expect(screen.getByTestId("add-button-")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-verified-btn-")).toBeInTheDocument();

    const dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(1);
    expect(dropdowns[0].children.length).toBeGreaterThan(0);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    const removeButtons = screen.getAllByTestId(
      /delete-button-\.quantities-\d+/,
    );
    expect(removeButtons.length).toBe(1);

    expect(screen.getByTestId("add-button-")).toBeInTheDocument();
  });

  it("renders initial rows and dropdown options correctly based on defaultValues", () => {
    const defaultValues = {
      quantities: [
        { value: "10", unit: "kg" },
        { value: "20", unit: "lb" },
      ],
      verified: false,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    const fieldRows = screen.getAllByTestId(/field-row-\.quantities-\d+/);
    expect(fieldRows.length).toBe(2);

    const inputs = fieldRows.map(
      (row) =>
        row.querySelector(
          "[data-testid^='.quantities.'][data-testid$='.value'] input",
        ) as HTMLInputElement,
    );
    expect(inputs[0].value).toBe("10");
    expect(inputs[1].value).toBe("20");

    const dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(2);
    expect(dropdowns[0].children.length).toBeGreaterThan(0);
  });
});

describe("QuantityMultiInput functionality", () => {
  it("disables inputs rows and add row button when status is Verified", () => {
    const defaultValues = {
      quantities: [{ value: "50", unit: "kg" }],
      verified: true,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    screen.getAllByTestId(/quantities\.\d+\.value/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen.getAllByTestId(/quantities\.\d+\.unit/).forEach((dropdown) => {
      expect(dropdown).toBeDisabled();
    });
    screen
      .getAllByTestId(/delete-button-\.quantities-\d+/)
      .forEach((button) => {
        expect(button).toBeDisabled();
      });
    expect(screen.getByTestId("add-button-")).toBeDisabled();

    userEvent.click(screen.getByTestId("toggle-verified-btn-"));

    screen.getAllByTestId(/quantities\.\d+\.value/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen.getAllByTestId(/quantities\.\d+\.unit/).forEach((dropdown) => {
      expect(dropdown).toBeDisabled();
    });
    screen
      .getAllByTestId(/delete-button-\.quantities-\d+/)
      .forEach((button) => {
        expect(button).toBeDisabled();
      });
    expect(screen.getByTestId("add-button-")).toBeDisabled();
  });

  it("handles Add and Remove row functionality", () => {
    const defaultValues = {
      quantities: [
        { value: "10", unit: "kg" },
        { value: "20", unit: "lb" },
      ],
      verified: false,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    let fieldRows = screen.getAllByTestId(/field-row-\.quantities-\d+/);
    expect(fieldRows.length).toBe(2);

    const removeButtons = screen.getAllByTestId(
      /delete-button-\.quantities-\d+/,
    );
    fireEvent.click(removeButtons[0]);

    fieldRows = screen.queryAllByTestId(/field-row-\.quantities-\d+/);
    expect(fieldRows.length).toBe(1);

    const addButton = screen.getByTestId("add-button-");
    fireEvent.click(addButton);

    fieldRows = screen.getAllByTestId(/field-row-\.quantities-\d+/);
    expect(fieldRows.length).toBe(2);
  });

  it("shows an error for negative values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      quantities: [{ value: "0", unit: "kg" }],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "-10");

    await userEvent.click(screen.getByTestId("submit-button"));

    expect(
      screen.getByTestId(/value-error-icon-\.quantities-\d+/),
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows an error for non-numeric values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      quantities: [{ value: "0", unit: "kg" }],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "abc");

    await userEvent.click(screen.getByTestId("submit-button"));

    expect(
      screen.getByTestId(/value-error-icon-\.quantities-\d+/),
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows an error for duplicate units", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      quantities: [
        { value: "10", unit: "kg" },
        { value: "20", unit: "kg" },
      ],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(2);

    const inputField = inputFields[1].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("20");

    await userEvent.click(screen.getByTestId("submit-button"));

    expect(
      screen.getAllByTestId(/unit-error-icon-\.quantities-\d+/).length,
    ).toBe(2);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values", async () => {
    const mockOnSubmit = jest.fn();
    const defaultValues = {
      quantities: [{ value: "0", unit: "kg" }],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "10");

    const dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(1);
    const dropdown = dropdowns[0] as HTMLSelectElement;
    await userEvent.selectOptions(dropdown, "lb");

    await userEvent.click(screen.getByTestId("toggle-verified-btn-"));

    await userEvent.click(screen.getByTestId("submit-button"));

    expect(mockOnSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        quantities: [{ value: "10", unit: "lb" }],
        verified: true,
      }),
    );
  });

  it("doesn't allow toggling status when there are errors", async () => {
    const defaultValues = {
      quantities: [{ value: "0", unit: "kg" }],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} />);

    const inputFields = screen.getAllByTestId(/quantities\.\d+\.value/);
    expect(inputFields.length).toBe(1);

    const inputField = inputFields[0].querySelector(
      "input",
    ) as HTMLInputElement;
    expect(inputField).toHaveValue("0");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "abc");

    const toggleButton = screen.getByTestId("verified-icon-");
    await userEvent.click(toggleButton);
    expect(toggleButton).not.toHaveClass("text-green-500");

    await userEvent.clear(inputField);
    await userEvent.type(inputField, "10");
    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveClass("text-green-500");
  });

  it("adds a row with a different unit every time add button is clicked", async () => {
    const defaultValues = {
      quantities: [{ value: "0", unit: "kg" }],
      verified: false,
    };

    render(<Wrapper defaultValues={defaultValues} />);

    const addButton = screen.getByTestId("add-button-");

    await userEvent.click(addButton);
    let dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(2);
    expect(dropdowns[1]).toHaveValue("lb");

    await userEvent.click(addButton);
    dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(3);
    expect(dropdowns[2]).toHaveValue("oz");

    await userEvent.click(addButton);
    dropdowns = screen.getAllByTestId(/quantities\.\d+\.unit/);
    expect(dropdowns.length).toBe(4);
    expect(dropdowns[3]).toHaveValue("ton");

    expect(addButton).toBeDisabled();
  });
});
