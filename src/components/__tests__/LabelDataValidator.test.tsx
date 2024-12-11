import { act, fireEvent, render, screen } from "@testing-library/react";
import LabelDataValidator from "@/components/LabelDataValidator";
import { DEFAULT_LABEL_DATA } from "@/types/types";

jest.mock("@/components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-image-viewer">Mock Image Viewer</div>
  )),
}));

const mockFiles = [new File(["mock-content"], "file1.png")];

describe("LabelDataValidator Rendering", () => {
  it("renders the container and main components", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    expect(screen.getByTestId("label-data-validator-container")).toBeInTheDocument();
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
    expect(screen.getByTestId("mock-image-viewer")).toBeInTheDocument();
  });

  it("renders the correct step component initially", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    expect(screen.getByTestId("base-information-form")).toBeInTheDocument();
    expect(screen.queryByTestId("organizations-form")).not.toBeInTheDocument();
  });
});

describe("LabelDataValidator Functionality", () => {
  it("navigates between steps using the stepper controls", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(
      screen.queryByTestId("base-information-form"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("organizations-form")).toBeInTheDocument();

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(screen.getByTestId("base-information-form")).toBeInTheDocument();
    expect(screen.queryByTestId("organizations-form")).not.toBeInTheDocument();
  });

  it("does not navigate beyond the first or last step", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const nextButton = screen.getByText("Next");
    const backButton = screen.getByText("Back");

    fireEvent.click(backButton);
    expect(screen.getByTestId("base-information-form")).toBeInTheDocument();

    for (let i = 0; i < 10; i++) {
      fireEvent.click(nextButton);
    }
    expect(screen.getByTestId("ingredients-form")).toBeInTheDocument();
  });

  it("renders the mocked Image Viewer", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const imageViewer = screen.getByTestId("mock-image-viewer");
    expect(imageViewer).toBeInTheDocument();
  });
});

describe("LabelDataValidator and Forms Integration", () => {
  it("marks the Organizations step as Completed or Incomplete when fields are Verified", () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("organizations.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");
    const button = targetSpan!.closest("button");
    fireEvent.click(button!);

    const verifyAllButton = screen.getByTestId("verify-all-btn-0");
    fireEvent.click(verifyAllButton);
    expect(targetSpan).toHaveClass("Mui-completed");

    fireEvent.click(
      screen.getByTestId("verified-icon-organizations.0.address.verified"),
    );

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });

  it("marks the Base Information step as Completed or Incomplete when fields are Verified", async () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("baseInformation.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    await act(async () => {
      fireEvent.click(button!);
    });

    const verifyButtons = screen.getAllByTestId(
      /verified-icon-baseInformation/,
    );
    expect(verifyButtons.length).toBeGreaterThanOrEqual(7);

    for (const button of verifyButtons) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    expect(targetSpan).toHaveClass("Mui-completed");

    await act(async () => {
      fireEvent.click(verifyButtons[0]);
    });

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });

  it("marks the Cautions step as Completed or Incomplete when fields are Verified", async () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("cautions.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    await act(async () => {
      fireEvent.click(button!);
    });

    const verifyButtons = screen.getAllByTestId(/verify-row-btn-cautions-\d+/);
    expect(verifyButtons.length).toBeGreaterThanOrEqual(1);

    for (const button of verifyButtons) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    expect(targetSpan).toHaveClass("Mui-completed");

    await act(async () => {
      fireEvent.click(verifyButtons[0]);
    });

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });

  it("marks the Instructions step as Completed or Incomplete when fields are Verified", async () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("instructions.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    await act(async () => {
      fireEvent.click(button!);
    });

    const verifyButtons = screen.getAllByTestId(
      /verify-row-btn-instructions-\d+/,
    );
    expect(verifyButtons.length).toBeGreaterThanOrEqual(1);

    for (const button of verifyButtons) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    expect(targetSpan).toHaveClass("Mui-completed");

    await act(async () => {
      fireEvent.click(verifyButtons[0]);
    });

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });

  it("marks the Guaranteed Analysis step as Completed or Incomplete when fields are Verified", async () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("guaranteedAnalysis.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    await act(async () => {
      fireEvent.click(button!);
    });

    await act(async () => {
      fireEvent.click(
        screen.getByTestId("verified-icon-guaranteedAnalysis.titleEn.verified"),
      );
      fireEvent.click(
        screen.getByTestId("verified-icon-guaranteedAnalysis.titleFr.verified"),
      );
      fireEvent.click(
        screen.getByTestId(
          "verified-icon-guaranteedAnalysis.isMinimal.verified",
        ),
      );
      screen
        .getAllByTestId(/verify-row-btn-guaranteedAnalysis\.nutrients-\d+/)
        .forEach((btn) => fireEvent.click(btn));
    });

    expect(targetSpan).toHaveClass("Mui-completed");

    await act(async () => {
      fireEvent.click(
        screen.getByTestId("verified-icon-guaranteedAnalysis.titleEn.verified"),
      );
    });

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });

  it("marks the Ingredients step as Completed or Incomplete when fields are Verified", async () => {
    render(<LabelDataValidator files={mockFiles} initialLabelData={DEFAULT_LABEL_DATA} />);

    const spans = screen.getAllByText("ingredients.stepTitle", {
      exact: true,
    });
    const targetSpan = spans.find((span) =>
      span.classList.contains("MuiStepLabel-label"),
    );
    expect(targetSpan).not.toHaveClass("Mui-completed");

    const button = targetSpan!.closest("button");
    await act(async () => {
      fireEvent.click(button!);
    });

    const verifyButtons = screen.getAllByTestId(
      /verify-row-btn-ingredients-\d+/,
    );
    expect(verifyButtons.length).toBeGreaterThanOrEqual(1);

    for (const button of verifyButtons) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    expect(targetSpan).toHaveClass("Mui-completed");

    await act(async () => {
      fireEvent.click(verifyButtons[0]);
    });

    expect(targetSpan).not.toHaveClass("Mui-completed");
  });
});
