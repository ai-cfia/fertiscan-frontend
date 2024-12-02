import { BilingualField } from "@/types/types";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import VerifiedBilingualTable from "../VerifiedBilingualTable";

const Wrapper = ({
  path = "bilingualFields",
  defaultValues = {
    bilingualFields: [
      { en: "English Text", fr: "French Text", verified: false },
    ],
  },
  valueColumns = false,
  unitOptions,
  onSubmit = jest.fn(),
}: {
  path?: string;
  defaultValues?: {
    bilingualFields: {
      en: string;
      fr: string;
      verified: boolean;
      unit?: string;
      value?: string;
    }[];
  };
  valueColumns?: boolean;
  unitOptions?: string[];
  onSubmit?: (data: { bilingualFields: BilingualField[] }) => void;
}) => {
  const methods = useForm({
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
        <VerifiedBilingualTable
          path={path}
          unitOptions={unitOptions}
          valueColumn={valueColumns}
        />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

describe("VerifiedBilingualTable rendering and functionality", () => {
  it("renders correctly", () => {
    render(<Wrapper />);

    expect(
      screen.getByTestId("table-header-english-bilingualFields"),
    ).toHaveTextContent("verifiedBilingualTable.english");
    expect(
      screen.getByTestId("table-header-french-bilingualFields"),
    ).toHaveTextContent("verifiedBilingualTable.french");
    expect(
      screen.getByTestId("table-header-actions-bilingualFields"),
    ).toHaveTextContent("verifiedBilingualTable.actions");

    const rows = screen.getAllByTestId(/table-row-bilingualFields-\d+/);
    expect(rows.length).toBe(1);

    const englishInputBase = screen.getByTestId(
      "input-english-bilingualFields-0",
    );
    const englishInput = englishInputBase.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    const frenchInputBase = screen.getByTestId(
      "input-french-bilingualFields-0",
    );
    const frenchInput = frenchInputBase.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(englishInput.value).toBe("English Text");
    expect(frenchInput.value).toBe("French Text");
  });

  it("renders correctly with value column", () => {
    render(
      <Wrapper
        defaultValues={{
          bilingualFields: [
            {
              en: "English Text",
              fr: "French Text",
              unit: "%",
              value: "10",
              verified: false,
            },
          ],
        }}
        unitOptions={["%", "ppm"]}
        valueColumns
      />,
    );

    const unitSelect = screen.getByTestId("bilingualFields.0.unit");
    const valueInputBase = screen.getByTestId("bilingualFields.0.value");
    const valueInput = valueInputBase.querySelector(
      "input",
    ) as HTMLInputElement;
    expect(unitSelect).toHaveValue("%");
    expect(valueInput.value).toBe("10");
  });

  it("adds a new row when Add button is clicked", () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByTestId("add-row-btn-bilingualFields"));

    const rows = screen.getAllByTestId(/table-row-bilingualFields-\d+/);
    expect(rows.length).toBe(2);

    const englishInputBase = screen.getByTestId(
      "input-english-bilingualFields-1",
    );
    const englishInput = englishInputBase.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;
    const frenchInputBase = screen.getByTestId(
      "input-french-bilingualFields-1",
    );
    const frenchInput = frenchInputBase.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(englishInput.value).toBe("");
    expect(frenchInput.value).toBe("");
  });

  it("deletes a row when Delete button is clicked", () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByTestId("delete-row-btn-bilingualFields-0"));

    const rows = screen.queryAllByTestId(/table-row-bilingualFields-\d+/);
    expect(rows.length).toBe(0);
  });

  it("marks all rows as verified when Verify All button is clicked", async () => {
    render(<Wrapper />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("verify-all-btn-bilingualFields"));
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const verifyButtons = await screen.findAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    for (const button of verifyButtons) {
      const icon = button.querySelector("svg");
      expect(icon).toHaveClass("text-green-500");
    }

    const deleteButtons = await screen.findAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    for (const button of deleteButtons) {
      expect(button).toBeDisabled();
    }

    const inputs = await screen.findAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    for (const baseInput of inputs) {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    }
  });

  it("marks all rows as unverified when Unverify All button is clicked", async () => {
    const defaultValues = {
      bilingualFields: [
        {
          en: "Verified English 1",
          fr: "Verified French 1",
          verified: true,
          unit: "%",
          value: "10",
        },
        {
          en: "Verified English 2",
          fr: "Verified French 2",
          verified: true,
          unit: "%",
          value: "20",
        },
      ],
    };

    render(
      <Wrapper
        defaultValues={defaultValues}
        unitOptions={["%", "ppm"]}
        valueColumns
      />,
    );

    const verifyButtonsBefore = await screen.findAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    for (const button of verifyButtonsBefore) {
      const icon = button.querySelector("svg");
      expect(icon).toHaveClass("text-green-500");
    }

    const inputsBefore = await screen.findAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    for (const baseInput of inputsBefore) {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    }

    const deleteButtonsBefore = await screen.findAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    for (const button of deleteButtonsBefore) {
      expect(button).toBeDisabled();
    }

    const unitSelectsBefore = await screen.findAllByTestId(
      /bilingualFields\.\d+\.unit/,
    );
    for (const unitSelect of unitSelectsBefore) {
      expect(unitSelect).toBeDisabled();
    }

    const valueInputBasesBefore = await screen.findAllByTestId(
      /bilingualFields\.\d+\.value/,
    );
    for (const valueInputBase of valueInputBasesBefore) {
      const valueInput = valueInputBase.querySelector(
        "input",
      ) as HTMLInputElement;
      expect(valueInput).toBeDisabled();
    }

    await act(async () => {
      fireEvent.click(screen.getByTestId("unverify-all-btn-bilingualFields"));
    });

    const verifyButtonsAfter = await screen.findAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    for (const button of verifyButtonsAfter) {
      const icon = button.querySelector("svg");
      expect(icon).not.toHaveClass("text-green-500");
    }

    const inputsAfter = await screen.findAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    for (const baseInput of inputsAfter) {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).not.toBeDisabled();
    }

    const deleteButtonsAfter = await screen.findAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    for (const button of deleteButtonsAfter) {
      expect(button).not.toBeDisabled();
    }

    const unitSelectsAfter = await screen.findAllByTestId(
      /bilingualFields\.\d+\.unit/,
    );
    for (const unitSelect of unitSelectsAfter) {
      expect(unitSelect).not.toBeDisabled();
    }

    const valueInputBasesAfter = await screen.findAllByTestId(
      /bilingualFields\.\d+\.value/,
    );
    for (const valueInputBase of valueInputBasesAfter) {
      const valueInput = valueInputBase.querySelector(
        "input",
      ) as HTMLInputElement;
      expect(valueInput).not.toBeDisabled();
    }
  });

  it("submits correct data on form submit", async () => {
    const onSubmit = jest.fn();
    render(<Wrapper onSubmit={onSubmit} />);

    const englishTextarea = screen
      .getByTestId("input-english-bilingualFields-0")
      .querySelector("textarea") as HTMLTextAreaElement;

    const frenchTextarea = screen
      .getByTestId("input-french-bilingualFields-0")
      .querySelector("textarea") as HTMLTextAreaElement;

    fireEvent.change(englishTextarea, {
      target: { value: "Updated English Text" },
    });
    fireEvent.change(frenchTextarea, {
      target: { value: "Updated French Text" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(onSubmit.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          bilingualFields: [
            {
              en: "Updated English Text",
              fr: "Updated French Text",
              verified: false,
            },
          ],
        }),
      );
    });
  });

  it("submits correct data on form submit with value columns", async () => {
    const onSubmit = jest.fn();
    render(
      <Wrapper
        defaultValues={{
          bilingualFields: [
            {
              en: "English Text",
              fr: "French Text",
              unit: "%",
              value: "10",
              verified: false,
            },
          ],
        }}
        unitOptions={["%", "ppm"]}
        valueColumns
        onSubmit={onSubmit}
      />,
    );

    const englishTextarea = screen
      .getByTestId("input-english-bilingualFields-0")
      .querySelector("textarea") as HTMLTextAreaElement;

    const frenchTextarea = screen
      .getByTestId("input-french-bilingualFields-0")
      .querySelector("textarea") as HTMLTextAreaElement;

    const unitSelect = screen.getByTestId("bilingualFields.0.unit");
    const valueInput = screen
      .getByTestId("bilingualFields.0.value")
      .querySelector("input") as HTMLInputElement;

    fireEvent.change(englishTextarea, {
      target: { value: "Updated English Text" },
    });
    fireEvent.change(frenchTextarea, {
      target: { value: "Updated French Text" },
    });
    fireEvent.change(unitSelect, { target: { value: "ppm" } });
    fireEvent.change(valueInput, { target: { value: "20" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(onSubmit.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          bilingualFields: [
            {
              en: "Updated English Text",
              fr: "Updated French Text",
              unit: "ppm",
              value: "20",
              verified: false,
            },
          ],
        }),
      );
    });
  });

  it("shows an error for negative values", async () => {
    render(
      <Wrapper
        defaultValues={{
          bilingualFields: [
            {
              en: "English Text",
              fr: "French Text",
              unit: "%",
              value: "10",
              verified: false,
            },
          ],
        }}
        unitOptions={["%", "ppm"]}
        valueColumns
      />,
    );

    const valueInput = screen
      .getByTestId("bilingualFields.0.value")
      .querySelector("input") as HTMLInputElement;

    fireEvent.change(valueInput, { target: { value: "-10" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.getByTestId("value-error-icon-bilingualFields-0"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error for non-numeric values", async () => {
    render(
      <Wrapper
        defaultValues={{
          bilingualFields: [
            {
              en: "English Text",
              fr: "French Text",
              unit: "%",
              value: "10",
              verified: false,
            },
          ],
        }}
        unitOptions={["%", "ppm"]}
        valueColumns
      />,
    );

    const valueInput = screen
      .getByTestId("bilingualFields.0.value")
      .querySelector("input") as HTMLInputElement;

    fireEvent.change(valueInput, { target: { value: "abc" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.getByTestId("value-error-icon-bilingualFields-0"),
      ).toBeInTheDocument();
    });
  });
});
