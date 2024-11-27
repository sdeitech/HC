export module DateTimeUtilities {
    export function convertDateToString(date: any) {
        if (date == undefined || date == null || date == "") {
            return null
        }
        let originalDate: Date = new Date(date);

        // Extract year, month, and day
        let year: number = originalDate.getFullYear();
        let month: number = originalDate.getMonth() + 1;
        let day: number = originalDate.getDate();

        // Format the date in "yyyy-mm-dd" format
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
}