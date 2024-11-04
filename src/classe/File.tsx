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

/**
 * Represents an uploaded file with associated metadata.
 */
class FileUploaded {
    private info: FileInfo;
    private file: File;

    /**
     * Creates an instance of FileUploaded.
     * @param info - The file information.
     * @param path - The path where the file is stored.
     * @param file - The actual file object.
     */
    constructor(info: FileInfo, path: string, file: File) {
        this.info = info;
        this.file = file;
        this.info.name = file.name;
        this.info.type = file.type.split("/")[1] as FileType;
        this.info.uploadDate = new Date();
        this.info.path = path;
    }

    /**
     * Gets the file information.
     * @returns The file information.
     */
    getInfo(): FileInfo {
        return this.info;
    }

    /**
     * Gets the file object.
     * @returns The file object.
     */
    getFile(): File {
        return this.file;
    }

    /**
     * Updates the path where the file is stored.
     * @param newPath - The new path.
     */
    updatePath(newPath: string) {
        this.info.path = newPath;
    }

    /**
     * Sets a new name for the file.
     * @param newName - The new name.
     */
    setName(newName: string) {
        this.info.name = newName;
    }

    /**
     * Detects the type of the file based on its content type.
     * @param path - The path to the file.
     * @returns A promise that resolves to the file type or an object containing the type and an array of images if the file is a PDF.
     * @throws Will throw an error if the Content-Type header is missing or if the file type is unsupported.
     */
    static async detectType(
        path: string,
    ): Promise<FileType | { type: "pdf"; images: FileUploaded[] }> {
        const response = await fetch(path);
        const contentType = response.headers.get("Content-Type");

        if (!contentType) {
            throw new Error("Content-Type header is missing");
        }

        console.log(`detectType: Content-Type for ${path} is ${contentType}`);

        if (contentType.includes("application/pdf")) {
            return { type: "pdf", images: [] };
        } else if (
            contentType.includes("image/png") ||
            contentType.includes("image/jpeg")
        ) {
            return contentType.split("/")[1] as FileType;
        } else {
            throw new Error("Unsupported file type");
        }
    }

    /**
     * Creates a new FileUploaded instance.
     * @param user - The user who uploaded the file.
     * @param path - The path where the file is stored.
     * @param file - The actual file object.
     * @returns A new FileUploaded instance.
     */
    static newFile(user: User, path: string, file: File): FileUploaded {
        const fileInfo: FileInfo = {
            path: path,
            user: user,
            file: file,
            uploadDate: new Date(),
            type: file.type.split("/")[1] as FileType,
            name: file.name,
        };
        return new FileUploaded(fileInfo, path, file);
    }
}
export default FileUploaded;
export type { FileType, FileInfo };
