export interface IPageFilterDto {
    pageNumber: number;
    pageSize: number;
    sortColumn?: string;
    sortOrder?: string;
    searchText?: string;
}