import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker'; // Import the worker entry
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'; // Worker local

export { pdfjsLib };