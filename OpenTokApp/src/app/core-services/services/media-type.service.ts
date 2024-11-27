import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class MediaTypeService {
    isVideoFile = (fileName: string | undefined | null): boolean => {
        const videos = ["3gp", "3g2", "flv", "mp4", "mpeg", "ts", "mov", "avi", "wmv"];
        return this.isExtensionExists(videos, fileName);
    }

    isImageFile = (fileName: string | undefined | null): boolean => {
        const images = ["jpg", "jpeg", "png", "gif", "tif", "tiff", "webp"];
        return this.isExtensionExists(images, fileName);
    }

    isPDFFile = (fileName: string | undefined | null): boolean => {
        return this.isExtensionExists(["pdf"], fileName);
    }

    private isExtensionExists = (extensions: string[], fileName: string | undefined | null): boolean => {
        if (!fileName)
            return false;

        const fileExtension = ((fileName || '').toLocaleLowerCase().split('.').pop() || '');

        return extensions.filter(x => x).map(x => x.toLocaleLowerCase()).indexOf(fileExtension) !== -1;
    }
}