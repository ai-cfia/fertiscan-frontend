export type FileType = "pdf" | "png" | "jpg";

interface Dimension {
    width: number;
    height: number;
}

interface User {
    username: string;
}

interface Tag {
    name: string;
    description?: string;
}

export interface FileInfo {
    dimension: Dimension;
    path: string;
    user: User;
    tags?: Tag[];
    uploadDate: Date;
    type: FileType;
}

export class FileUploaded {
    private info: FileInfo;

    constructor(info: FileInfo) {
        this.info = info;
    }

    getInfo(): FileInfo {
        return this.info;
    }

    addTag(tag: Tag) {
        if (!this.info.tags) {
            this.info.tags = [];
        }
        this.info.tags.push(tag);
    }

    removeTag(tagName: string) {
        if (this.info.tags) {
            this.info.tags = this.info.tags.filter(tag => tag.name !== tagName);
        }
    }

    updatePath(newPath: string) {
        this.info.path = newPath;
    }

    rename(newName: string) {
        if (this.info.tags && this.info.tags.length >= 1) {
            this.info.tags[0] = { name: newName };
        } else {
            this.addTag({ name: newName });
        }
    }

    static newFile(dimension: Dimension, path: string, user: User, type: FileType, tags?: Tag[]): FileUploaded {
        const uploadDate = new Date();
        const fileInfo: FileInfo = { dimension, path, user, type, uploadDate, tags };
        return new FileUploaded(fileInfo);
    }

    async detectType(): Promise<FileType | { type: "pdf", images: FileUploaded[] }> {
        const response = await fetch(this.info.path);
        const type = response.headers.get('Content-Type');
        if (!type) {
            throw new Error('Content-Type header is missing');
        }
        {/* if (type.includes('pdf')) {
            // Implement the logic to extract images from a PDF file in other PR see: https://github.com/ai-cfia/fertiscan-frontend/blob/256-nextjs-test/src/Classes/File/File.tsx
        } else */
        }
        if (type.includes('png') || type.includes('jpeg') || type.includes('jpg')) {
            return type.slice(type.indexOf('/') + 1) as FileType;
        } else {
            throw new Error('Unsupported file type');
        }
    }
}
