import { VERIFIED_LABEL_DATA_WITH_ID } from "@/utils/client/constants";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import InspectionPage from "../[id]/page";

jest.mock("../../../components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="image-viewer-mock">Mock ImageViewer</div>
  )),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({ id: "123" })),
}));

jest.mock("axios");

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

describe("InspectionPage", () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    mockRouter = { push: jest.fn() };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<InspectionPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("fetches and displays inspection data", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: VERIFIED_LABEL_DATA_WITH_ID,
    });

    render(<InspectionPage />);

    await waitFor(() =>
      expect(
        screen.getByText(VERIFIED_LABEL_DATA_WITH_ID.inspectionId),
      ).toBeInTheDocument(),
    );

    expect(
      screen.getByText(VERIFIED_LABEL_DATA_WITH_ID.baseInformation.name.value),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        VERIFIED_LABEL_DATA_WITH_ID.baseInformation.registrationNumber.value,
      ),
    ).toBeInTheDocument();
  });

  it("handles API error and displays error page", async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { status: 404 } });

    render(<InspectionPage />);

    await waitFor(() => expect(screen.getByText("404")).toBeInTheDocument());
  });

  it("redirects to edit page on edit click", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: VERIFIED_LABEL_DATA_WITH_ID,
    });

    render(<InspectionPage />);
    await waitFor(() =>
      expect(
        screen.getByText(VERIFIED_LABEL_DATA_WITH_ID.inspectionId),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("edit-button"));

    expect(mockRouter.push).toHaveBeenCalledWith(
      `/label-data-validation/${VERIFIED_LABEL_DATA_WITH_ID.inspectionId}`,
    );
  });

  it("calls delete API and redirects on discard", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: VERIFIED_LABEL_DATA_WITH_ID,
    });
    (axios.delete as jest.Mock).mockResolvedValue({});

    render(<InspectionPage />);
    await waitFor(() =>
      expect(
        screen.getByText(VERIFIED_LABEL_DATA_WITH_ID.inspectionId),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("discard-button"));

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
  });

  it("handles delete API failure without alert", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: VERIFIED_LABEL_DATA_WITH_ID,
    });
    (axios.delete as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    render(<InspectionPage />);
    await waitFor(() =>
      expect(
        screen.getByText(VERIFIED_LABEL_DATA_WITH_ID.inspectionId),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId("discard-button"));

    await waitFor(() => expect(mockRouter.push).not.toHaveBeenCalled());
  });
});
