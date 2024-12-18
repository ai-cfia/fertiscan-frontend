/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import useUploadedFilesStore from "@/stores/fileStore";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranslation } from "react-i18next";
import { Response } from "whatwg-fetch";
import HomePage from "@/app/page";
import FileUploaded from "@/classe/File";
import { DropzoneState } from "@/types/types";

type FileType = "pdf" | "png" | "jpg";

interface User {
  username: string;
}

interface FileInfo {
  path: string;
  user: User;
  file: File;
  uploadDate: Date;
  type: FileType;
  name: string;
}
describe("FileList Component", () => {
    const mockSetUploadedFiles = jest.fn();
    const mockSetDropzoneState = jest.fn();
    const fileInfo: FileInfo[] = [
        {
            path: "/path/to/file1.txt",
            user: { username: "user1" },
            file: new File([], "file1.png"),
            uploadDate: new Date(),
            type: "png",
            name: "file1.png"
        },
        {
            path: "/path/to/file2.txt",
            user: { username: "user1" },
            file: new File([], "file2.jpg"),
            uploadDate: new Date(),
            type: "jpg",
            name: "file2.jpg"
        },
        {
            path: "/path/to/file3.pdf",
            user: { username: "user1" },
            file: new File([], "file3.pdf"),
            uploadDate: new Date(),
            type: "pdf",
            name: "file3.pdf"
        }
    ];

    const uploadedFiles = [
        new FileUploaded({ path: "/path/to/file1.txt",}, "/path/to/file1.txt", new File([], "file1.txt")),
        new FileUploaded({ name: "file2.txt", path: "/path/to/file2.txt" }, "/path/to/file2.txt", new File([], "file2.txt")),
    ];

    const renderComponent = (files = uploadedFiles) => {
        render(
            <I18nextProvider i18n={i18n}>
                <FileList
                    uploadedFiles={files}
                    setUploadedFiles={mockSetUploadedFiles}
                    setDropzoneState={mockSetDropzoneState}
                />
            </I18nextProvider>
        );
    };
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

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));
const { t } = useTranslation("homePage");


// Mock the FileElement component
jest.mock(
  "../../components/FileElement",
  () =>
    ({
      uploadedFiles,
      setUploadedFiles,
      setDropzoneState,
    }: {
      uploadedFiles: FileUploaded[];
      setUploadedFiles: React.Dispatch<React.SetStateAction<FileUploaded[]>>;
      setDropzoneState: React.Dispatch<React.SetStateAction<DropzoneState>>;
    }) => (
      <div data-testid="file-element">
        <span data-testid="file-name">{uploadedFiles}</span>
        <button data-testid="delete" onClick={() => handleDelete(fileUrl)}>
          Delete
        </button>
      </div>
    ),
);

global.URL.createObjectURL = jest
  .fn()
  .mockImplementation(() => "blob:example/image.png");
global.fetch = jest.fn((path: string | URL | Request) => {
  if (
    typeof path === "string" &&
    (path.endsWith(".png") || path.endsWith(".jpeg"))
  ) {
    return Promise.resolve(
      new Response("", {
        status: 200,
        headers: new Headers({
          "Content-Type": path.endsWith(".png") ? "image/png" : "image/jpeg",
        }),
      }),
    );
  } else if (typeof path === "string" && path.endsWith(".pdf")) {
    return Promise.resolve(
      new Response("", {
        status: 200,
        headers: new Headers({ "Content-Type": "application/pdf" }),
      }),
    );
  }
  return Promise.resolve(
    new Response(JSON.stringify({ error: "Unsupported file type" }), {
      status: 400,
      headers: new Headers({ "Content-Type": "application/json" }),
    }),
  );
});

describe("HomePage Component", () => {
  afterEach(() => {
    const store = useUploadedFilesStore;
    store.getState().clearUploadedFiles();
  });

  it("should allow file uploads and display the uploaded files", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, file);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Find and click the delete button
    const deleteButton = screen.getByTestId("delete");
    fireEvent.click(deleteButton);

    // Check that the file was removed
    expect(screen.queryByTestId("file-element")).not.toBeInTheDocument();
  });

  it("should allow file uploads via drag and drop", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Create a dataTransfer object
    interface DataTransferItem {
      kind: string;
      type: string;
      getAsFile: () => File;
      webkitGetAsEntry: () => {
        isFile: boolean;
        file: (callback: (file: File) => void) => void;
      };
    }

    interface DataTransfer {
      items: DataTransferItem[];
      files: File[];
    }

    const dataTransfer: DataTransfer = {
      items: [
        {
          kind: "file",
          type: file.type,
          getAsFile: () => file,
          webkitGetAsEntry: () => ({
            isFile: true,
            file: (callback) => {
              callback(file);
            },
          }),
        },
      ],
      files: [file],
    };

    // Find the dropzone and simulate the drop event
    const dropzone = await screen.getByTestId("dropzone");

    fireEvent.drop(dropzone, {
      dataTransfer: dataTransfer,
    });

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Find and click the delete button
    const deleteButton = screen.getByTestId("delete");
    fireEvent.click(deleteButton);

    // Check that the file was removed
    expect(screen.queryByTestId("file-element")).not.toBeInTheDocument();
  });

  it("should allow file upload via input", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, file);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Find and click the delete button
    const deleteButton = screen.getByTestId("delete");
    fireEvent.click(deleteButton);

    // Check that the file was removed
    expect(screen.queryByTestId("file-element")).not.toBeInTheDocument();
  });

  it("The button submit should be visible when a file is uploaded", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, file);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Check that the submit button is visible
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("The file count should be displayed when a file is uploaded", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, file);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Check that the file count is displayed
    expect(
      screen.getByText(t("fileList.uploadedfiles") + " (1)"),
    ).toBeInTheDocument();
  });

  it("The file count should be updated when multiple files are uploaded", async () => {
    render(<HomePage />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const file2 = new File(["hello2"], "hello2.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, [file, file2]);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByText("hello.png");
    expect(fileElement).toBeInTheDocument();

    // Check that the file was uploaded and appears in the list.
    const fileElement2 = await screen.findByText("hello2.png");
    expect(fileElement2).toBeInTheDocument();

    // Check that the file count is displayed
    expect(
      screen.getByText(t("fileList.uploadedfiles") + " (2)"),
    ).toBeInTheDocument();
  });

  it("displays 'No files uploaded' when there are no files", () => {
    render(<HomePage />);

    expect(screen.getByText(t("fileList.noUploadedfiles"))).toBeInTheDocument();
  });

  it("The button submit should be deactivated when no file is uploaded", () => {
    render(<HomePage />);

    // Check that the submit button is disabled
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("The toolTip should showUp only when the button is disabled", () => {
    render(<HomePage />);

    // Check that the submit button is disabled
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();

    // Check that the tooltip is visible
    const tooltip = screen.getByTestId("hint-submit-button-disabled");
    expect(tooltip).toBeInTheDocument();
  });

  it("navigates to label data validation page when the submit button is clicked", async () => {
    render(<HomePage />);

    const file = new File(["hello"], "hello.png", { type: "image/png" });

    const input = screen.getByLabelText(t("dropzone.browseFile"));
    userEvent.upload(input, file);

    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(mockedRouterPush).toHaveBeenCalledWith("/label-data-validation");
  });
});
