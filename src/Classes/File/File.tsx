let pdfjsLib: any;
if (typeof window !== 'undefined') {
    import('@/utils/pdfjssetup').then(mod => {
        pdfjsLib = mod.pdfjsLib;
    });
}

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
        const pathParts = this.info.path.split('/');
        pathParts[pathParts.length - 1] = newName;
        this.info.path = pathParts.join('/');
    }

    static newFile(dimension: Dimension, path: string, user: User, type: FileType, tags?: Tag[]): FileUploaded {
        const uploadDate = new Date();
        const fileInfo: FileInfo = { dimension, path, user, type, uploadDate, tags };
        return new FileUploaded(fileInfo);
    }

    async processImage(width: number, height: number, imagePath: string): Promise<string> {
        const img = new Image();
        img.src = imagePath;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        const scale = Math.min(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;

        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const newPath = URL.createObjectURL(blob);
                    resolve(newPath);
                } else {
                    reject(new Error("Image processing failed"));
                }
            }, "image/png");
        });
    }
    async extractPagesFromPDF(fileBuffer: ArrayBuffer) {
        if (!pdfjsLib) {
            throw new Error('pdfjsLib is not loaded');
        }

        const typedArray = new Uint8Array(fileBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const imageList = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);

            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');

            if (context) {
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;

                const imageUrl = canvas.toDataURL('image/png');
                imageList.push(imageUrl);
            }
        }

        return imageList;
    }

    async detectType(): Promise<FileType | { type: "pdf", images: string[] }> {  
        if (typeof window === 'undefined') {
            return 'pdf' as FileType;
        }

        const response = await fetch(this.info.path);
        const type = response.headers.get('Content-Type');

        if (!type) throw new Error('Cannot determine the file type');

        if (type.includes('pdf')) {
            const arrayBuffer = await response.arrayBuffer();
            const images = await this.extractPagesFromPDF(arrayBuffer);
            return { type: "pdf", images };
        } else if (type.includes('png') || type.includes('jpeg') || type.includes('jpg')) {
            return type.slice(type.indexOf('/') + 1) as FileType;
        } else {
            throw new Error('Unsupported file type');
        }
    }
}
