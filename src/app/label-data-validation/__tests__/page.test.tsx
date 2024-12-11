import { render, screen } from "@testing-library/react";
import LabelDataValidationPage from "../page";

jest.mock("@/components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-image-viewer">Mock Image Viewer</div>
  )),
}));

describe("LabelDataValidationPage Rendering", () => {
  it("renders the LabelDataValidator component", () => {
    render(<LabelDataValidationPage />);
    expect(
      screen.getByTestId("label-data-validator-container"),
    ).toBeInTheDocument();
  });
});
