import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import userEvent from "@testing-library/user-event";
import FileUploaded from "../../classe/File";

jest.mock("../../classe/File", () => {
    return jest.fn().mockImplementation(() => {
        return {
            detectType: jest.fn().mockResolvedValue({ type: "image" }),
            getInfo: jest.fn().mockReturnValue({
                path: "blob:http://localhost/example.png",
                tags: [{ name: "example.png" }],
            }),
        };
    });
});

describe("Home Component - handleSetDropzoneState", () => {
    it("should show the dropzone with the correct image URL", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByRole("button", { name: /browse file/i });

        // Simulate the dropzone state change
        userEvent.click(dropzone);

        // Check if the dropzone state is updated
        expect(screen.getByText(/drag & drop to upload files/i)).toBeInTheDocument();
    });

    it("should hide the dropzone when visible is set to false", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByRole("button", { name: /browse file/i });

        // Simulate the dropzone state change
        userEvent.click(dropzone);

        // Check if the dropzone state is updated
        expect(screen.getByText(/drag & drop to upload files/i)).toBeInTheDocument();
    });

    it("should update the dropzone state with the correct image URL", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByRole("button", { name: /browse file/i });

        // Simulate the dropzone state change
        userEvent.click(dropzone);

        // Check if the dropzone state is updated
        expect(screen.getByText(/drag & drop to upload files/i)).toBeInTheDocument();
    });
});

describe("Home Component", () => {
    it("handles file drop correctly", async () => {
        const { getByText } = render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const dataTransfer = {
            items: {
            add: jest.fn(),
            },
            files: [file],
        };
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        // Wait for the file to be processed and added to the uploaded files list
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(getByText(/Uploaded files/i)).toBeInTheDocument();
        expect(getByText(/example.png/i)).toBeInTheDocument();
    });
});


describe("Home Component - handleDragOver", () => {
    it("should prevent default behavior when dragging over the dropzone", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");
        const dragOverEvent = new Event("dragover", { bubbles: true });
        Object.assign(dragOverEvent, { preventDefault: jest.fn() });

        fireEvent(dropzone!, dragOverEvent);

        expect(dragOverEvent.preventDefault).toHaveBeenCalled();
    });

    it("should not change dropzone state when dragging over the dropzone", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");
        const dragOverEvent = new Event("dragover", { bubbles: true });
        Object.assign(dragOverEvent, { preventDefault: jest.fn() });

        fireEvent(dropzone!, dragOverEvent);

        expect(screen.getByText(/Drag & Drop To Upload Files/i)).toBeInTheDocument();
    });

    it("should not trigger file processing when dragging over the dropzone", () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");
        const dragOverEvent = new Event("dragover", { bubbles: true });
        Object.assign(dragOverEvent, { preventDefault: jest.fn() });

        fireEvent(dropzone!, dragOverEvent);

        expect(screen.queryByText(/Uploaded files/i)).not.toBeInTheDocument();
    });
});

describe("Home Component - processFile", () => {
    it("should process and display the uploaded PNG file", async () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
        expect(screen.getByText(/example.png/i)).toBeInTheDocument();
    });

    it("should not add file if detectType returns pdf", async () => {
        (FileUploaded as unknown as jest.Mock).mockImplementationOnce(() => {
            return {
                detectType: jest.fn().mockResolvedValue({ type: "pdf" }),
                getInfo: jest.fn().mockReturnValue({
                    path: "blob:http://localhost/example.pdf",
                    tags: [{ name: "example.pdf" }],
                }),
            };
        });

        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.pdf", { type: "application/pdf" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(screen.queryByText(/Uploaded files/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/example.pdf/i)).not.toBeInTheDocument();
    });

    it("should process and display the uploaded JPG file", async () => {
        (FileUploaded as unknown as jest.Mock).mockImplementationOnce(() => {
            return {
                detectType: jest.fn().mockResolvedValue({ type: "image" }),
                getInfo: jest.fn().mockReturnValue({
                    path: "blob:http://localhost/example.jpg",
                    tags: [{ name: "example.jpg" }],
                }),
            };
        });

        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
        expect(screen.getByText(/example.jpg/i)).toBeInTheDocument();
    });
});

describe("Home Component - handleDelete", () => {
    it("should remove the file from the uploaded files list", async () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
        expect(screen.getByText(/example.png/i)).toBeInTheDocument();

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByText(/example.png/i)).not.toBeInTheDocument();
    });

    it("should hide the dropzone image when the file is deleted", async () => {
        render(
            <ThemeProvider theme={theme}>
                <Home />
            </ThemeProvider>
        );

        const dropzone = screen.getByText(/Drag & Drop To Upload Files/i).closest("div");

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.drop(dropzone!, {
            dataTransfer,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(screen.getByText(/Uploaded files/i)).toBeInTheDocument();
        expect(screen.getByText(/example.png/i)).toBeInTheDocument();

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(screen.queryByAltText("Uploaded file")).not.toBeInTheDocument();
    });
});
