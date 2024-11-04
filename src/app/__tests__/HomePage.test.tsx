import { render, screen, fireEvent } from "@testing-library/react";
import { fetch, Response } from 'whatwg-fetch';

// Mock fetch
global.fetch = jest.fn((path: string | URL | Request) => {
    if (typeof path === 'string' && (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'))) {
      return Promise.resolve(new Response('', {
        status: 200,
        headers: new Headers({
          'Content-Type': path.endsWith('.png') ? 'image/png' : 'image/jpeg',
        })
      }));
    }
    return Promise.resolve(new Response(JSON.stringify({ error: 'Unsupported file type' }), {
      status: 400,
      headers: new Headers({ 'Content-Type': 'application/json' })
    }));
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

    it("handles file drop", async () => {
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

        await screen.findByText(/Uploaded files/i);
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

    it("handles unsupported file types gracefully", async () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).parentElement;
        const unsupportedFile = new File(["dummy content"], "example.txt", { type: "text/plain" });

        fireEvent.drop(dropzone!, {
            dataTransfer: { files: [unsupportedFile] },
        });
        expect('Unsupported file type').toBeInTheDocument();
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
