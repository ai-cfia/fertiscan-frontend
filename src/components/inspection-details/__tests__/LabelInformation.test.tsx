import { VERIFIED_LABEL_DATA } from "@/utils/client/constants";
import { fireEvent, render, screen } from "@testing-library/react";
import LabelInformation from "../LabelInformation";

jest.mock("@/components/QuantityChip", () => ({
  QuantityChips: jest.fn(() => <div data-testid="quantity-chips" />),
}));

describe("LabelInformation", () => {
  const mockSetNotes = jest.fn();

  it("does not render if labelData is null", () => {
    const { container } = render(
      <LabelInformation
        labelData={null}
        setNotes={mockSetNotes}
        disableNotes={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders label information correctly", () => {
    render(
      <LabelInformation
        labelData={VERIFIED_LABEL_DATA}
        setNotes={mockSetNotes}
        disableNotes={false}
      />,
    );
    expect(screen.getByText("SuperGrow 20-20-20")).toBeInTheDocument();
    expect(screen.getByText("1234567A")).toBeInTheDocument();
    expect(screen.getByText("LOT-4567")).toBeInTheDocument();
    expect(screen.getByText("20-20-20")).toBeInTheDocument();
    expect(screen.getAllByTestId("quantity-chips")).toHaveLength(3);
    expect(screen.getAllByText("AgriGrow Fertilizers Inc.")).toHaveLength(2);
    expect(screen.getAllByText("123 Greenfield Ave, Springfield")).toHaveLength(
      2,
    );
    expect(screen.getAllByText("www.agrigrow.com")).toHaveLength(2);
    expect(screen.getAllByText("+1-800-555-0199")).toHaveLength(2);
    expect(screen.getByText("Guaranteed Analysis")).toBeInTheDocument();
    expect(screen.getByText("Analyse Garantie")).toBeInTheDocument();
    expect(screen.getByText("yes")).toBeInTheDocument();

    expect(screen.getByText("Urea")).toBeInTheDocument();
    expect(screen.getByText("Ammonium phosphate")).toBeInTheDocument();
    expect(screen.getByText("Potassium chloride")).toBeInTheDocument();

    expect(screen.getByText("Nitrogen (N)")).toBeInTheDocument();
    expect(screen.getByText("Phosphorus (P)")).toBeInTheDocument();
    expect(screen.getAllByText("Potassium (K)")).toHaveLength(2);

    expect(screen.getByText("Compliant with regulations.")).toBeInTheDocument();
    const notesField = screen.getByPlaceholderText("notes.placeholder");
    fireEvent.change(notesField, { target: { value: "Updated comment" } });
    expect(mockSetNotes).toHaveBeenCalledWith("Updated comment");
  });

  it("disables notes input when disableNotes is true", () => {
    render(
      <LabelInformation
        labelData={VERIFIED_LABEL_DATA}
        setNotes={mockSetNotes}
        disableNotes={true}
      />,
    );
    const notesField = screen.getByPlaceholderText("notes.placeholder");
    expect(notesField).toBeDisabled();
  });
});
