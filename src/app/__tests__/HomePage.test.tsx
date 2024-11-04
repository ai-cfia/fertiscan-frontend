import { render, screen, fireEvent, act } from "@testing-library/react";
import { fetch, Response } from 'whatwg-fetch';
import FileUploaded, { FileInfo } from "../../classe/File"

// Mock fetch
global.fetch = jest.fn((path: string | URL | Request) => {
    if (typeof path === 'string' && (path.endsWith('.png') || path.endsWith('.jpeg'))) {
      return Promise.resolve(new Response('', {
        status: 200,
        headers: new Headers({ 'Content-Type': path.endsWith('.png') ? 'image/png' : 'image/jpeg' })
      }));
    } else if (typeof path === 'string' && path.endsWith('.pdf')) {
      return Promise.resolve(new Response('', {
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/pdf' })
      }));
    }
    return Promise.resolve(new Response(JSON.stringify({ error: 'Unsupported file type' }), {
      status: 400,
      headers: new Headers({ 'Content-Type': 'application/json' })
    }));
  });

global.URL.createObjectURL = jest.fn().mockImplementation(() => "blob:example/image.png");
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
        console.log(`File: ${file.name}`);
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

        act(() => {
        fireEvent.change(input!, {
            target: { files: [file] },
        });
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

    it("removes a file from the list when delete button is clicked", async () => {
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

        // Check if the file is displayed
        await screen.findByText(/Uploaded files/i);
        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();

        // Simulate clicking the delete button
        const deleteButtons = screen.getAllByTestId('delete');
        deleteButtons.forEach(button => fireEvent.click(button));

        // Check if the file is removed
        expect(screen.queryByText(/Uploaded files/i)).not.toBeInTheDocument();
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
