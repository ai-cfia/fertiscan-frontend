import { fireEvent, render, screen } from "@testing-library/react";
import LabelDataValidationPage from "../page";

jest.mock("@/components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-image-viewer">Mock Image Viewer</div>
  )),
}));

describe("LabelDataValidationPage Rendering", () => {
  it("renders the container and main components", () => {
    render(<LabelDataValidationPage />);

    expect(screen.getByTestId("container")).toBeInTheDocument();
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByTestId("mock-image-viewer")).toBeInTheDocument();
  });

  it("renders the correct step component initially", () => {
    render(<LabelDataValidationPage />);

    expect(screen.getByTestId("organizations-form")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy Step")).not.toBeInTheDocument();
  });
});

describe("LabelDataValidationPage Functionality", () => {
  it("navigates between steps using the stepper controls", () => {
    render(<LabelDataValidationPage />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.queryByTestId("organizations-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("Dummy Step")).toBeInTheDocument();

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(screen.getByTestId("organizations-form")).toBeInTheDocument();
    expect(screen.queryByTestId("Dummy Step")).not.toBeInTheDocument();
  });

  it("does not navigate beyond the first or last step", () => {
    render(<LabelDataValidationPage />);

    const nextButton = screen.getByText("Next");
    const backButton = screen.getByText("Back");

    fireEvent.click(backButton);
    expect(screen.getByTestId("organizations-form")).toBeInTheDocument();

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    expect(screen.getByTestId("Dummy Step")).toBeInTheDocument();
  });

  it("renders the mocked Image Viewer", () => {
    render(<LabelDataValidationPage />);

    const imageViewer = screen.getByTestId("mock-image-viewer");
    expect(imageViewer).toBeInTheDocument();
  });
});

describe("LabelDataValidationPage and OrganizationsForm Integration", () => {
  it("marks the Organizations step as Completed when all organizations are Verified", () => {
    render(<LabelDataValidationPage />);

    const spans = screen.getAllByText("Organizations", { exact: true });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");
    const button = targetSpan!.closest("button");
    fireEvent.click(button!);

    const verifyAllButton = screen.getByTestId("verify-all-btn-0");
    fireEvent.click(verifyAllButton);
    expect(targetSpan).toHaveClass("Mui-completed");
  });

  it("keeps the Organizations step as Incomplete when at least one organization is not Verified", () => {
    render(<LabelDataValidationPage />);

    const spans = screen.getAllByText("Organizations", { exact: true });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    fireEvent.click(button!);

    const verifyAllButton = screen.getByTestId("verify-all-btn-0");
    fireEvent.click(verifyAllButton);
    expect(targetSpan).toHaveClass("Mui-completed");

    const toggleStatusButton = screen.getByTestId(
      "toggle-status-btn-organizations.0.name.status",
    );
    fireEvent.click(toggleStatusButton);

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });
});
