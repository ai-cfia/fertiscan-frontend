import { BilingualField } from "@/types/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import VerifiedBilingualTable from "../VerifiedBilingualTable";

const Wrapper = ({
  path = "bilingualFields",
  defaultValues = {
    bilingualFields: [
      { en: "English Text", fr: "French Text", verified: false },
    ],
  },
  onSubmit = jest.fn(),
}: {
  path?: string;
  defaultValues?: {
    bilingualFields: { en: string; fr: string; verified: boolean }[];
  };
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
        <VerifiedBilingualTable path={path} />
        <button type="submit" data-testid="submit-button">
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

describe("VerifiedBilingualTable rendering and functionality", () => {
  it("renders with default values", () => {
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

  it("marks all rows as verified when Verify All button is clicked", () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByTestId("verify-all-btn-bilingualFields"));

    const verifyButtons = screen.getAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    verifyButtons.forEach((button) => {
      const icon = button.querySelector("svg");
      expect(icon).toHaveClass("text-green-500");
    });

    const inputs = screen.getAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    inputs.forEach((baseInput) => {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });

    const deleteButtons = screen.getAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("marks all rows as unverified when Unverify All button is clicked", () => {
    const defaultValues = {
      bilingualFields: [
        { en: "Verified English 1", fr: "Verified French 1", verified: true },
        { en: "Verified English 2", fr: "Verified French 2", verified: true },
      ],
    };

    render(<Wrapper defaultValues={defaultValues} />);

    const verifyButtonsBefore = screen.getAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    verifyButtonsBefore.forEach((button) => {
      const icon = button.querySelector("svg");
      expect(icon).toHaveClass("text-green-500");
    });

    const inputsBefore = screen.getAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    inputsBefore.forEach((baseInput) => {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).toBeDisabled();
    });

    const deleteButtonsBefore = screen.getAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    deleteButtonsBefore.forEach((button) => {
      expect(button).toBeDisabled();
    });

    fireEvent.click(screen.getByTestId("unverify-all-btn-bilingualFields"));

    const verifyButtonsAfter = screen.getAllByTestId(
      /verify-row-btn-bilingualFields-\d+/,
    );
    verifyButtonsAfter.forEach((button) => {
      const icon = button.querySelector("svg");
      expect(icon).not.toHaveClass("text-green-500");
    });

    const inputsAfter = screen.getAllByTestId(
      /input-(english|french)-bilingualFields-\d+/,
    );
    inputsAfter.forEach((baseInput) => {
      const textarea = baseInput.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      expect(textarea).not.toBeDisabled();
    });

    const deleteButtonsAfter = screen.getAllByTestId(
      /delete-row-btn-bilingualFields-\d+/,
    );
    deleteButtonsAfter.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
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
});
