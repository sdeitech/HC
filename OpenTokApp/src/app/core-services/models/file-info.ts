export interface IFileInfo {
    fileName: string;
    fileData: string | ArrayBuffer | null;
    isDone?: boolean;
    isError?: boolean;
    errorMessage?: string;
}