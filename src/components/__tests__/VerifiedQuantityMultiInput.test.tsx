import { VerifiedQuantityField } from "@/types/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import VerifiedQuantityList from "../VerifiedQuantityList";

const Wrapper = ({
  label = "Test Label",
  path = "",
  unitOptions = ["kg", "lb", "oz", "ton"],
  defaultValues = {
    quantities: [{ value: "0", unit: "kg" }],
    verified: false,
  },
  loading = false,
  onSubmit = jest.fn(),
}: {
  label?: string;
  placeholder?: string;
  path?: string;
  unitOptions?: string[];
  defaultValues?: VerifiedQuantityField;
  loading?: boolean;
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
        <VerifiedQuantityList
          label={label}
          path={path}
          unitOptions={unitOptions}
          loading={loading}
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

    const dropdowns = screen.getAllByTestId(/quantities\.\d+-value-input/);
    expect(dropdowns.length).toBe(1);
    expect(dropdowns[0].children.length).toBeGreaterThan(0);

    const inputFields = screen.getAllByTestId(/quantities\.\d+-value-input/);
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
          "[data-testid^='.quantities.'][data-testid$='-value-input'] input",
        ) as HTMLInputElement,
    );
    expect(inputs[0].value).toBe("10");
    expect(inputs[1].value).toBe("20");

    const dropdowns = screen.getAllByTestId(/quantities\.\d+-value-input/);
    expect(dropdowns.length).toBe(2);
    expect(dropdowns[0].children.length).toBeGreaterThan(0);
  });

  it("handles loading state correctly", () => {
    const { rerender } = render(<Wrapper loading={true} />);

    const skeleton = screen.getByTestId("styled-skeleton");
    expect(skeleton).toBeInTheDocument();

    expect(screen.queryByTestId("add-button-")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("toggle-verified-btn-"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(/quantities\.\d+-value-input/),
    ).not.toBeInTheDocument();

    rerender(<Wrapper loading={false} />);

    expect(screen.queryByTestId("styled-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("add-button-")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-verified-btn-")).toBeInTheDocument();
    expect(screen.getAllByTestId(/quantities\.\d+-value-input/).length).toBe(1);
  });
});

describe("QuantityMultiInput functionality", () => {
  it("disables inputs rows and add row button when status is Verified", () => {
    const defaultValues = {
      quantities: [{ value: "50", unit: "kg" }],
      verified: true,
    };
    render(<Wrapper defaultValues={defaultValues} />);

    screen.getAllByTestId(/quantities\.\d+-value-input/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen.getAllByTestId(/quantities\.\d+-value-input/).forEach((dropdown) => {
      expect(dropdown.querySelector("input")).toBeDisabled();
    });
    screen
      .getAllByTestId(/delete-button-\.quantities-\d+/)
      .forEach((button) => {
        expect(button).toBeDisabled();
      });
    expect(screen.getByTestId("add-button-")).toBeDisabled();

    userEvent.click(screen.getByTestId("toggle-verified-btn-"));

    screen.getAllByTestId(/quantities\.\d+-value-input/).forEach((field) => {
      expect(field.querySelector("input")).toBeDisabled();
    });
    screen.getAllByTestId(/quantities\.\d+-value-input/).forEach((dropdown) => {
      expect(dropdown.querySelector("input")).toBeDisabled();
    });
    screen
      .getAllByTestId(/delete-button-\.quantities-\d+/)
      .forEach((button) => {
        expect(button).toBeDisabled();
      });
    expect(screen.getByTestId("add-button-")).toBeDisabled();
    expect(screen.getByTestId("quantity-multi-input-")).toHaveClass(
      "border-green-500",
    );
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

  // Not tested as now since verification are gonna be added in next PR

  // it("calls onSubmit with correct values", async () => {
  //   const mockOnSubmit = jest.fn();
  //   const defaultValues = {
  //     quantities: [{ value: "0", unit: "kg" }],
  //     verified: false,
  //   };

  //   render(<Wrapper defaultValues={defaultValues} onSubmit={mockOnSubmit} />);

  //   const inputFields = screen.getAllByTestId(/quantities\.\d+-value-input/);
  //   expect(inputFields.length).toBe(1);

  //   const inputField = inputFields[0].querySelector(
  //     "input",
  //   ) as HTMLInputElement;
  //   expect(inputField).toHaveValue("0");

  //   await userEvent.clear(inputField);
  //   await userEvent.type(inputField, "10");

  //   const dropdowns = screen.getAllByTestId(/quantities\.\d+-unit-input/);
  //   expect(dropdowns.length).toBe(1);

  //   const dropdownInput = dropdowns[0].querySelector(
  //     "input",
  //   ) as HTMLInputElement;
  //   await userEvent.clear(dropdownInput);
  //   await userEvent.type(dropdownInput, "lb");

  //   await userEvent.click(screen.getByTestId("toggle-verified-btn-"));

  //   await userEvent.click(screen.getByTestId("submit-button"));

  //   expect(mockOnSubmit.mock.calls[0][0]).toEqual(
  //     expect.objectContaining({
  //       quantities: [{ value: "10", unit: "lb" }],
  //       verified: true,
  //     }),
  //   );
  // });

  // it("doesn't allow toggling status when there are errors", async () => {
  //   const defaultValues = {
  //     quantities: [{ value: "0", unit: "kg" }],
  //     verified: false,
  //   };

  //   render(<Wrapper defaultValues={defaultValues} />);

  //   const inputFields = screen.getAllByTestId(/quantities\.\d+-value-input/);
  //   expect(inputFields.length).toBe(1);

  //   const inputField = inputFields[0].querySelector(
  //     "input",
  //   ) as HTMLInputElement;
  //   expect(inputField).toHaveValue("0");

  //   await userEvent.clear(inputField);
  //   await userEvent.type(inputField, "abc");

  //   const toggleButton = screen.getByTestId("verified-icon-");
  //   await userEvent.click(toggleButton);
  //   expect(toggleButton).not.toHaveClass("text-green-500");

  //   await userEvent.clear(inputField);
  //   await userEvent.type(inputField, "10");
  //   await userEvent.click(toggleButton);
  //   expect(toggleButton).toHaveClass("text-green-500");
  // });
});
