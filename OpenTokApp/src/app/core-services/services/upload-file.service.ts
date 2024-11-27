import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import { GenericApiService } from './generic-api.service';

@Injectable({
    providedIn: 'root',
})
export class UploadFileService {
    constructor(private readonly _genericApiService: GenericApiService) { }

    uploadFileWithProgress<T>(
        apiUrl: string,
        file: File,
        action: (isDone: boolean, isFailed: boolean, progress: number, result: T | null | undefined) => void
    ): void {
        const formData = new FormData();
        formData.append('file', file);

        this._genericApiService.uploadFile<T>(apiUrl, formData)
            .subscribe(data => {
                if (data.type === HttpEventType.Response && data.body)
                    action(true, false, 100.00, data.body);
                else if (data.type === HttpEventType.UploadProgress) {
                    const progress = Math.ceil(((data.loaded || 0) * 100.00) / (data.total || 0.01));
                    action(false, false, progress, null);
                }
            }, error => {
                action(false, true, 0, null);
            });
    }
}