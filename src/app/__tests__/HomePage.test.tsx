import { render, screen, fireEvent } from "@testing-library/react";

// Mock fetch
global.fetch = jest.fn((path: string | URL | Request) => {
  if (typeof path === 'string' && path.endsWith(".png")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      headers: new Headers({
        "Content-Type": "image/png"
      }),
      redirected: false,
      statusText: "OK",
      type: "basic",
      url: "",
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    });
  }
  return Promise.resolve({
    ok: false,
    status: 400,
    json: () => Promise.resolve({ error: "Unsupported file type" }),
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    redirected: false,
    statusText: "Bad Request",
    type: "basic",
    url: "",
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
  });
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn();
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import Home from "../page";

describe("Home Component", () => {
    it("renders the Home component and its sub-components", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        // Check if the drag and drop area is rendered
        expect(screen.getByText(/Drag & Drop To Upload Files/i)).toBeInTheDocument();

        // Check if the Browse File button is rendered
        expect(screen.getByText(/Browse File/i)).toBeInTheDocument();
    });

    it("handles file drop", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [file] },
        });

        // Check if the file is processed and displayed
        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
    });

    it("handles file upload via input", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const input = screen.getByLabelText(/Browse File/i);
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.change(input!, {
            target: { files: [file] },
        });

        // Check if the file is processed and displayed
        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
    });

    it("handles drag over event", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;

        fireEvent.dragOver(dropzone!);

        // Check if the drag over event is handled
        expect(dropzone).toHaveStyle("border-color: theme.palette.secondary.main");
    });

    it("handles file deletion", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [file] },
        });

        // Check if the file is processed and displayed
        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();

        const deleteButton = screen.getByText(/Delete/i);
        fireEvent.click(deleteButton);

        // Check if the file is deleted
        expect(screen.getByText(/No files uploaded/i)).toBeInTheDocument();
    });

    it("displays the correct number of uploaded files", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const file1 = new File(["dummy content"], "example1.png", { type: "image/png" });
        const file2 = new File(["dummy content"], "example2.png", { type: "image/png" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [file1, file2] },
        });

        // Check if the correct number of files is displayed
        expect(screen.getByText(/Uploaded files \(2\)/i)).toBeInTheDocument();
    });

    it("handles multiple file uploads", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const input = screen.getByLabelText(/Browse File/i).querySelector("input");
        const file1 = new File(["dummy content"], "example1.png", { type: "image/png" });
        const file2 = new File(["dummy content"], "example2.png", { type: "image/png" });

        fireEvent.change(input!, {
            target: { files: [file1, file2] },
        });

        // Check if the files are processed and displayed
        expect(screen.getByText(/Uploaded files \(2\)/i)).toBeInTheDocument();
    });

    it("displays the uploaded image in the dropzone", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [file] },
        });

        // Check if the uploaded image is displayed in the dropzone
        expect(screen.getByAltText(/Uploaded file/i)).toBeInTheDocument();
    });

    it("displays 'No files uploaded' when there are no files", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        // Check if the 'No files uploaded' message is displayed
        expect(screen.getByText(/No files uploaded/i)).toBeInTheDocument();
    });

    it("displays the submit button when files are uploaded", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [file] },
        });

        // Check if the submit button is displayed
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });
});
