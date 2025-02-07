import FileUploaded from "@/classe/File";
import useUploadedFilesStore from "@/stores/fileStore";
import useLabelDataStore from "@/stores/labelDataStore";
import {
  VERIFIED_LABEL_DATA,
  VERIFIED_LABEL_DATA_WITH_ID,
} from "@/utils/client/constants";
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import LabelDataConfirmationPage from "../page";
import { QuantityChips } from "@/components/QuantityChip";
import { Quantity } from "@/types/types";

const mockedRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: mockedRouterPush,
    };
  },
}));

jest.mock("@/components/ImageViewer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-image-viewer">Mock Image Viewer</div>
  )),
}));

jest.mock("axios");

describe("LabelDataConfirmationPage", () => {
  describe("Checkbox Tests", () => {
    it("should be unchecked by default", () => {
      render(<LabelDataConfirmationPage />);
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");
      expect(checkboxInput).not.toBeChecked();
    });

    it("should toggle state when clicked", () => {
      render(<LabelDataConfirmationPage />);
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");
      fireEvent.click(checkboxInput!);
      expect(checkboxInput).toBeChecked();
      fireEvent.click(checkboxInput!);
      expect(checkboxInput).not.toBeChecked();
    });

    it("should be disabled when loading is true", () => {});
  });

  describe("Confirm Button Tests", () => {
    it("should be disabled by default when checkbox is unchecked or loading is true", () => {
      render(<LabelDataConfirmationPage />);
      const confirmButton = screen.getByTestId("confirm-button");
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");
      expect(confirmButton).toBeDisabled();
      fireEvent.click(checkboxInput!);
      expect(confirmButton).not.toBeDisabled();
      fireEvent.click(checkboxInput!);
      expect(confirmButton).toBeDisabled();
    });

    it("should be enabled when checkbox is checked and loading is false", () => {
      render(<LabelDataConfirmationPage />);
      const confirmButton = screen.getByTestId("confirm-button");
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");
      fireEvent.click(checkboxInput!);
      expect(confirmButton).not.toBeDisabled();
    });

    it("should send a PUT request with the correct payload when labelData has an inspectionId", async () => {
      useLabelDataStore.setState({ labelData: VERIFIED_LABEL_DATA_WITH_ID });
      const mockPut = jest.spyOn(axios, "put").mockResolvedValueOnce({});

      render(<LabelDataConfirmationPage />);
      const confirmButton = screen.getByTestId("confirm-button");
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");

      fireEvent.click(checkboxInput!);
      fireEvent.click(confirmButton);

      expect(mockPut).toHaveBeenCalledWith(
        `/api-next/inspections/${VERIFIED_LABEL_DATA_WITH_ID.inspectionId}`,
        { ...VERIFIED_LABEL_DATA_WITH_ID, confirmed: true },
        expect.objectContaining({
          headers: expect.any(Object),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("should send a POST request with the correct FormData when labelData does not have an inspectionId and include uploaded files", async () => {
      const mockFile = new File(["file content"], "test-file.txt", {
        type: "text/plain",
      });
      const mockFileUploaded = new FileUploaded(
        {
          path: "mock-path",
          user: { username: "test-user" },
          file: mockFile,
          uploadDate: new Date(),
          type: "pdf",
          name: mockFile.name,
        },
        "mock-path",
        mockFile,
      );

      const mockPost = jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: { inspectionId: "5678" },
      });

      useLabelDataStore.setState({ labelData: VERIFIED_LABEL_DATA });
      useUploadedFilesStore.setState({
        uploadedFiles: [mockFileUploaded],
      });

      const mockSetLabelData = jest.fn();
      jest
        .spyOn(useLabelDataStore.getState(), "setLabelData")
        .mockImplementation(mockSetLabelData);

      render(<LabelDataConfirmationPage />);
      const confirmButton = screen.getByTestId("confirm-button");
      const checkboxInput = screen
        .getByTestId("confirmation-checkbox")
        .querySelector("input");

      fireEvent.click(checkboxInput!);
      fireEvent.click(confirmButton);

      expect(mockPost).toHaveBeenCalledWith(
        "/api-next/inspections",
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.any(Object),
          signal: expect.any(AbortSignal),
        }),
      );

      const capturedFormData = mockPost.mock.calls[0][1] as FormData;

      expect(capturedFormData.get("labelData")).toEqual(
        JSON.stringify(VERIFIED_LABEL_DATA),
      );
      const fileEntries = capturedFormData.getAll("files") as File[];
      expect(fileEntries.length).toBe(1);
      expect(fileEntries[0]).toEqual(mockFile);
    });
  });

  describe("Edit Button Tests", () => {
    it("should navigate to the correct URL when labelData has an inspectionId", () => {
      useLabelDataStore.setState({ labelData: VERIFIED_LABEL_DATA_WITH_ID });
      jest.mock("next/navigation", () => ({
        useRouter: () => ({ push: mockedRouterPush }),
      }));
      render(<LabelDataConfirmationPage />);
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton);
      expect(mockedRouterPush).toHaveBeenCalledWith(
        `/label-data-validation/${VERIFIED_LABEL_DATA_WITH_ID.inspectionId}`,
      );
    });

    it("should navigate to the default URL when labelData does not have an inspectionId", () => {
      useLabelDataStore.setState({ labelData: VERIFIED_LABEL_DATA });
      jest.mock("next/navigation", () => ({
        useRouter: () => ({ push: mockedRouterPush }),
      }));
      render(<LabelDataConfirmationPage />);
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton);
      expect(mockedRouterPush).toHaveBeenCalledWith("/label-data-validation");
    });
  });

  it("should render all required tables in the Confirmation Section", () => {
    render(<LabelDataConfirmationPage />);
    const specificTables = [
      "base-information-table",
      "organizations-table",
      "guaranteed-analysis-title-table",
    ];
    specificTables.forEach((testId) => {
      const table = screen.getByTestId(testId);
      expect(table).toBeInTheDocument();
    });
    const bilingualTableContainers = screen.getAllByTestId(
      "bilingual-table-container",
    );
    expect(bilingualTableContainers.length).toBe(4);
  });
});

describe("QuantityChips", () => {
  it("renders valid quantities, filters out invalid values", () => {
    const quantities: Quantity[] = [
      { value: "5", unit: "kg" },
      { value: "", unit: "g" },
      { value: "0", unit: "kg" },
    ];

    render(<QuantityChips quantities={quantities} />);

    expect(screen.getByText("5 kg")).toBeInTheDocument();
    expect(screen.getByText("0 kg")).toBeInTheDocument();
    expect(screen.queryByText("g")).not.toBeInTheDocument();
  });
});

describe("Notes Section Tests", () => {
  it("should render the notes section with a textbox", () => {
    render(<LabelDataConfirmationPage />);
    const notesSection = screen.getByTestId("notes-section");
    const notesTextbox = screen.getByTestId("notes-textbox");
    expect(notesSection).toBeInTheDocument();
    expect(notesTextbox).toBeInTheDocument();
  });

  it("should update the comment value when text is entered", () => {
    useLabelDataStore.getState().setLabelData(VERIFIED_LABEL_DATA);
    expect(useLabelDataStore.getState().labelData?.comment).toBe("Compliant with regulations.");
    render(<LabelDataConfirmationPage />);
    const notesTextbox = screen
      .getByTestId("notes-textbox")
      .querySelector("textarea");
    expect(notesTextbox).toBeInTheDocument();
    fireEvent.change(notesTextbox!, { target: { value: "New note" } });
    expect(useLabelDataStore.getState().labelData?.comment).toBe("New note");
    expect(notesTextbox).toHaveValue("New note");
  });

  it("should toggle the notes textbox disabled state when the checkbox is clicked", () => {
    render(<LabelDataConfirmationPage />);
    const notesTextbox = screen
      .getByTestId("notes-textbox")
      .querySelector("textarea");
    const checkboxInput = screen
      .getByTestId("confirmation-checkbox")
      .querySelector("input");
    expect(notesTextbox).toBeInTheDocument();
    expect(checkboxInput).toBeInTheDocument();
    expect(notesTextbox).not.toBeDisabled();
    fireEvent.click(checkboxInput!);
    expect(notesTextbox).toBeDisabled();
    fireEvent.click(checkboxInput!);
    expect(notesTextbox).not.toBeDisabled();
  });
});
