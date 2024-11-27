import { Injectable } from "@angular/core";
import { Observable, Subscriber } from "rxjs";

import { IFileDataResponseDto } from "../models";
import { IFileInfo } from "../models/file-info";

@Injectable({
    providedIn: "root"
})
export class FileDataHandlerService {
    handleSingleFileFromEvent(maxAllowedFileSizeInMB: number, event: Event) {
        const target = event.target as HTMLInputElement;

        if (target.files == null || target.files.length == 0)
            return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
                subscriber.next({
                    hasError: true,
                    errorMessage: 'File not selected.',
                    files: [],
                });
            });

        const file: File = target.files[0];
        const maxAllowedFileSizeInBytes = maxAllowedFileSizeInMB * 1024 * 1024;

        if (file.size > maxAllowedFileSizeInBytes)
            return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
                subscriber.next({
                    hasError: true,
                    errorMessage: `File size exceeds ${maxAllowedFileSizeInMB} MB limit.`,
                    files: [{
                        fileName: file.name,
                        fileData: null
                    }],
                });
            });

        return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
            this.readFile(file, subscriber);
        });
    }

    handleMultipleFilesFromEvent(maxAllowedFileSizeInMB: number, event: Event) {
        const target = event.target as HTMLInputElement;

        if (target.files == null || target.files.length == 0)
            return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
                subscriber.next({
                    hasError: true,
                    errorMessage: 'File not selected.',
                    files: [],
                });
            });

        const files = target.files;
        const maxAllowedFileSizeInBytes = maxAllowedFileSizeInMB * 1024 * 1024;
        const largeFiles: IFileInfo[] = [];

        for (let x = 0; x < files.length; x++) {
            const file: File = files[x];

            if (file.size > maxAllowedFileSizeInBytes)
                largeFiles.push({
                    fileName: file.name,
                    fileData: null
                });
        }

        if (largeFiles.length > 0)
            return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
                subscriber.next({
                    hasError: true,
                    errorMessage: `File size exceeds ${maxAllowedFileSizeInMB} MB limit.`,
                    files: largeFiles,
                });
            });

        return new Observable((subscriber: Subscriber<IFileDataResponseDto>) => {
            for (let x = 0; x < files.length; x++) {
                const file: File = files[x];
                const resultList: IFileInfo[] = [];

                this.readFileWithCallback(file, (result) => {
                    resultList.push(result);

                    if (files.length === resultList.length) {
                        const errorList = resultList.filter(y => y.isError);

                        if (errorList.length > 0) {
                            subscriber.error({
                                hasError: true,
                                errorMessage: errorList[0].errorMessage,
                                files: errorList.map(y => ({ fileName: y.fileName, fileData: y.fileData }))
                            });

                            subscriber.complete();
                            return;
                        }

                        subscriber.next({
                            hasError: false,
                            errorMessage: '',
                            files: resultList.map(y => ({ fileName: y.fileName, fileData: y.fileData }))
                        });

                        subscriber.complete();
                    }
                });
            }
        });
    }

    private readFile(file: File, subscriber: Subscriber<IFileDataResponseDto>) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            subscriber.next({
                hasError: false,
                errorMessage: '',
                files: [{
                    fileName: file.name,
                    fileData: fileReader.result,
                }]
            });

            subscriber.complete();
        }

        fileReader.onerror = () => {
            subscriber.error({
                hasError: true,
                errorMessage: 'Error while reading file data',
                files: [{
                    fileName: file.name,
                    fileData: null,
                }]
            });

            subscriber.complete();
        }
    }

    private readFileWithCallback(
        file: File,
        callback: (fileInfoData: IFileInfo) => void
    ) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            callback({
                isDone: true,
                fileName: file.name,
                fileData: fileReader.result
            });
        }

        fileReader.onerror = () => {
            callback({
                isError: true,
                errorMessage: 'Error while reading file data',
                fileName: file.name,
                fileData: null
            });
        }
    }
}