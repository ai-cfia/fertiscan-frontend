/* eslint-disable react/display-name */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Response } from "whatwg-fetch";
import Home from "../SearchPage/page";

// Mock the FileElement component
jest.mock(
  "../../components/FileElement",
  ()  =>
    ({
      fileName,
      fileUrl,
      handleDelete,
    }: {
      fileName: string;
      fileUrl: string;
      handleDelete: (url: string) => void;
    }) => (
      <div data-testid="file-element">
        <span data-testid="file-name">{fileName}</span>
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

describe("Home Component", () => {
  it("should allow file uploads and display the uploaded files", async () => {
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(/browse file/i);
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
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the dropzone and simulate the drop event
    const dropzone = await screen.getByTestId("dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

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
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(/browse file/i);
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

  it("The button submit should not be visible when no file is uploaded", () => {
    render(<Home />);

    expect(screen.queryByTestId("submit-button")).not.toBeInTheDocument();
  });

  it("The button submit should be visible when a file is uploaded", async () => {
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(/browse file/i);
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
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(/browse file/i);
    userEvent.upload(input, file);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByTestId("file-element");
    expect(fileElement).toBeInTheDocument();

    const fileName = await screen.findByTestId("file-name");
    expect(fileName).toHaveTextContent("hello.png");

    // Check that the file count is displayed
    expect(screen.getByText("Uploaded files (1)")).toBeInTheDocument();
  });

  it("The file count should be updated when multiple files are uploaded", async () => {
    render(<Home />);

    // Mock file
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const file2 = new File(["hello2"], "hello2.png", { type: "image/png" });

    // Find the file input element and upload the file
    const input = screen.getByLabelText(/browse file/i);
    userEvent.upload(input, [file, file2]);

    // Check that the file was uploaded and appears in the list.
    const fileElement = await screen.findByText("hello.png");
    expect(fileElement).toBeInTheDocument();

    // Check that the file was uploaded and appears in the list.
    const fileElement2 = await screen.findByText("hello2.png");
    expect(fileElement2).toBeInTheDocument();

    // Check that the file count is displayed
    expect(screen.getByText("Uploaded files (2)")).toBeInTheDocument();
  });

  it("displays 'No files uploaded' when there are no files", () => {
    render(<Home />);

    expect(screen.getByText("No uploaded files")).toBeInTheDocument();
  });
});
