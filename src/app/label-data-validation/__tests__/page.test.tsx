import { fireEvent, render, screen } from "@testing-library/react";
import LabelDataValidationPage from "../page";

jest.mock("@/components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-image-viewer">Mock Image Viewer</div>
  )),
}));

describe("LabelDataValidationPage", () => {
  it("displays only the correct step component when control buttons are clicked", () => {
    render(<LabelDataValidationPage />);

    expect(screen.getByTestId("Dummy 1")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy 2")).not.toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByTestId("Dummy 2")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy 1")).not.toBeInTheDocument();

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(screen.getByTestId("Dummy 1")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy 2")).not.toBeInTheDocument();
  });

  it("does not navigate beyond the first or last step", () => {
    render(<LabelDataValidationPage />);

    const nextButton = screen.getByText("Next");
    const backButton = screen.getByText("Back");

    fireEvent.click(backButton);
    expect(screen.getByTestId("Dummy 1")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy 2")).not.toBeInTheDocument();

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(screen.getByTestId("Dummy 2")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy 1")).not.toBeInTheDocument();
  });

  it("renders the mocked image viewer", () => {
    render(<LabelDataValidationPage />);
    expect(screen.getByTestId("mock-image-viewer")).toBeInTheDocument();
  });
});
