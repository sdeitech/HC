import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, Renderer2 } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ScriptService {
    private readonly _scriptMap = new Map<string, HTMLElement>();

    constructor(
        @Inject(DOCUMENT) private readonly _document: Document
    ) { }

    /**
     * Registers the script in the component
     * @param renderer2 The Angular Renderer
     * @param url The url of javascript to be added
     */
    registerScript(key: string, renderer2: Renderer2, url: string): void {
        if (!url) return;

        this.removeElement(key);

        const script = renderer2.createElement('script') as HTMLScriptElement;
        script.type = 'text/javascript';
        script.src = url;
        renderer2.appendChild(this._document.head, script);

        this._scriptMap.set(key, script);
    }

    registerScriptwithProperty(key: string, renderer2: Renderer2, url: string, referrerPolicy: string): void {
        if (!url) return;

        this.removeElement(key);

        const script = renderer2.createElement('script') as HTMLScriptElement;
        script.type = 'text/javascript';
        script.src = url;
        script.referrerPolicy = referrerPolicy;
        renderer2.appendChild(this._document.head, script);

        this._scriptMap.set(key, script);
    }

    registerInlineStyle(key: string, renderer2: Renderer2, contents: string): void {
        if (!contents) return;

        this.removeElement(key);

        const style = renderer2.createElement('style') as HTMLStyleElement;
        style.innerHTML = contents;
        renderer2.appendChild(this._document.head, style);

        this._scriptMap.set(key, style);
    }

    registerFavicon(key: string, renderer2: Renderer2, contents: string): void {
        if (!contents) return;

        this.removeElement(key);

        const faviconElement = this._document.head.querySelector('link[rel*="icon"]');

        if (faviconElement)
            this._document.head.removeChild(faviconElement);

        const link = renderer2.createElement('link') as HTMLLinkElement;
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = contents;

        renderer2.appendChild(this._document.head, link);
        this._scriptMap.set(key, link);
    }

    getStyleContents(primaryColor: string) {
        const rgbColor = this.getRGBColor(primaryColor);
        const backgroundColor = this.getHexColor(this.getUpdatedRGBColor(rgbColor, -16));
        const borderColor = this.getHexColor(this.getUpdatedRGBColor(rgbColor, 16));

        const primaryButtonStyles = [
            '.btn-primary {',
            `--bs-btn-bg: ${primaryColor};`,
            `--bs-btn-border-color: ${primaryColor};`,
            `--bs-btn-disabled-bg: ${primaryColor};`,
            `--bs-btn-disabled-border-color: ${primaryColor};`,
            '}'
        ];

        const buttonClasses = [
            '.btn-primary:focus',
            '.btn-primary.focus',
            '.btn-primary:hover',
            '.btn-primary:not(:disabled):not(.disabled):active',
            '.btn-primary:not(:disabled):not(.disabled).active',
            '.show > .btn-primary.dropdown-toggle',
        ];

        const buttonStyle = [
            buttonClasses.join(','),
            '{',
            ` background-color: ${backgroundColor};`,
            ` border-color: ${borderColor};`,
            '}'
        ];

        const colors = [
            `--primary: ${primaryColor};`,
            `--bs-primary: ${primaryColor};`,
            `--bs-primary-rgb: ${rgbColor.red}, ${rgbColor.green}, ${rgbColor.blue};`
        ];

        const styles = [
            primaryButtonStyles.join('\n'),
            `:root { ${colors.join(' ')} }`,
            buttonStyle.join('\n')
        ];

        return styles.join('\n');
    }

    private getRGBColor(colorInHex: string) {
        const rgbColor = { red: 0, green: 0, blue: 0 };

        colorInHex = (colorInHex || '').trim();

        if (colorInHex.length !== 7)
            return rgbColor;

        rgbColor.red = parseInt(colorInHex.substring(1, 3), 16);
        rgbColor.green = parseInt(colorInHex.substring(3, 5), 16);
        rgbColor.blue = parseInt(colorInHex.substring(5), 16);

        return rgbColor;
    }

    private getUpdatedRGBColor(colorInRGB: { red: number, green: number, blue: number }, value: number) {
        const range = (val: number) => (val < 0 ? 0 : (val > 255 ? 255 : val));

        return {
            red: range(colorInRGB.red + value),
            green: range(colorInRGB.green + value),
            blue: range(colorInRGB.blue + value)
        };
    }

    private getHexColor(colorInRGB: { red: number, green: number, blue: number }) {
        const redInHex = colorInRGB.red.toString(16).padStart(2, '0');
        const greenInHex = colorInRGB.green.toString(16).padStart(2, '0');
        const blueInHex = colorInRGB.blue.toString(16).padStart(2, '0');
        return `#${redInHex}${greenInHex}${blueInHex}`;
    }

    private removeElement(key: any): void {
        const element = this._scriptMap.get(key);

        if (element) {
            this._scriptMap.delete(key);
            this._document.head.removeChild(element);
        }
    }
}