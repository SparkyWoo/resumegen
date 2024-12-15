/**
 * Type declarations for PDF.js ESM module
 * Extends the base pdfjs-dist types for ESM compatibility
 */
declare module 'pdfjs-dist/build/pdf.mjs' {
  import { PDFDocumentProxy, PDFPageProxy, GlobalWorkerOptions } from 'pdfjs-dist';

  export interface GetDocumentParams {
    data: Uint8Array;
    cMapUrl?: string;
    cMapPacked?: boolean;
  }

  export interface TextContent {
    items: Array<{
      str: string;
      dir: string;
      transform: number[];
      width: number;
      height: number;
    }>;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
    destroy(): void;
  }

  export const getDocument: (params: GetDocumentParams) => PDFDocumentLoadingTask;
  export const GlobalWorkerOptions: typeof GlobalWorkerOptions;
}

declare module 'pdfjs-dist/build/pdf.min.mjs' {
  export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  const worker: any;
  export default worker;
} 