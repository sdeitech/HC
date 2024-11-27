import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DownloadFileService {
    download = (downloadDocumentUrl: string, fileName: string, isWindowObjectUrl: boolean = false): void => {
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = downloadDocumentUrl;
        downloadAnchor.setAttribute('target', '_blank');
        downloadAnchor.setAttribute("download", fileName);
        downloadAnchor.click();

        window.setTimeout(() => {
            document.body.removeChild(downloadAnchor);

            if (isWindowObjectUrl)
                window.URL.revokeObjectURL(downloadDocumentUrl);
        }, 10000);
    }
}