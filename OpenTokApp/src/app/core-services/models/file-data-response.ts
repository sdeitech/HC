import { IFileInfo } from "./file-info";

export interface IFileDataResponseDto {
    hasError: boolean;
    errorMessage: string;
    files: IFileInfo[]
}