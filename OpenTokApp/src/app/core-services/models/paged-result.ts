export interface IPagedResultDto<TModel> {
    records: TModel[],
    pageNumber?: number,
    pageSize?: number,
    totalRecords?: number,
    isFirstPage?: boolean,
    isLastPage?: boolean,
}