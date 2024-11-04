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

class FileUploaded {
  private info: FileInfo;
  private file: File;

  constructor(info: FileInfo, path: string, file: File) {
    this.info = info;
    this.file = file;
    this.info.name = file.name;
    this.info.type = file.type.split("/")[1] as FileType;
    this.info.uploadDate = new Date();
    this.info.path = path;
  }

  getInfo(): FileInfo {
    return this.info;
  }

  getFile(): File {
    return this.file;
  }

  updatePath(newPath: string) {
    this.info.path = newPath;
  }

  setName(newName: string) {
    this.info.name = newName;
  }

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
