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
        
        if (this.info.tags && this.info.tags.length >= 1) {
            this.info.tags[0] = { name: newName };
        } else {
            // If tags are undefined or empty, create or add the new name as a tag
            this.addTag({ name: newName });
        }
    }


    static newFile(dimension: Dimension, path: string, user: User, type: FileType, tags?: Tag[]): FileUploaded {
        const uploadDate = new Date();
        const fileInfo: FileInfo = { dimension, path, user, type, uploadDate, tags };
        return new FileUploaded(fileInfo);
    }

    async processImage(imagePath: string): Promise<string> {
        const img = new Image();
        img.src = imagePath;
        
        // Wait for the image to load
        await new Promise((resolve) => { img.onload = resolve; });
    
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
    
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Draw the image in its original dimensions
        if (ctx) {
            ctx.drawImage(img, 0, 0);
        }
    
        // Return a Promise that resolves to the data URL of the canvas image
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
    

    async extractPagesFromPDF(fileBuffer: ArrayBuffer): Promise<FileUploaded[]> {
        if (!pdfjsLib) {
            throw new Error('pdfjsLib is not loaded');
        }
    
        const typedArray = new Uint8Array(fileBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const filesExtracted = [];
    
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
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
    
                const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve));
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
    
                    const imageFile = FileUploaded.newFile(
                        { width: canvas.width, height: canvas.height },
                        imageUrl, 
                        this.info.user, 
                        "png",
                        [{ name: `Page ${i}` }]
                    );
    
                    filesExtracted.push(imageFile);
                }
            }
        }
    
        return filesExtracted;
    }

    async detectType(): Promise<FileType | { type: "pdf", images: FileUploaded[] }> {  
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
